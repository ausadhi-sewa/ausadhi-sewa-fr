import  { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {  IconCheck } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmailConfirmationDialogProps {
  open: boolean;
  email: string;
  onResendEmail?: () => void;
  onClose?: () => void;
}

export function EmailConfirmationDialog({
  open,
  email,
  onResendEmail,
  onClose,
}: EmailConfirmationDialogProps) {
  const [cooldown, setCooldown] = useState(60);

  // Reset cooldown whenever dialog opens
  useEffect(() => {
    if (open) setCooldown(60);
  }, [open]);

  // Tick down while open and cooldown > 0
  useEffect(() => {
    if (!open || cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [open, cooldown]);

  const handleResend = () => {
    if (cooldown > 0) return;
    onResendEmail?.();
    setCooldown(60);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md rounded-4xl">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl text-center font-bold text-neutral-800">
            Check Your Email
          </DialogTitle>
          <DialogDescription className="text-neutral-600">
            We've sent a confirmation link to your email address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="border-none">
            <IconCheck className="h-4 w-4" />
            <AlertDescription>
         <strong>{email}</strong>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* time count down  1 minute  */}

            <div className="flex  items-center justify-center gap-3">
              
                <div className="text-sm text-neutral-600 text-center">
                  {cooldown > 0
                    ? `You can resend in ${cooldown}s`
                    : "You can resend now"}
                </div>
                {onResendEmail && (
                  <Button
                    variant="outline"
                    onClick={handleResend}
                    disabled={cooldown > 0}
                    className="w-1/2 rounded-4xl  shadow-2xl bg-accent disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Resend Email 
                  </Button>
                )}
              
            </div>

            {/* <div className="text-xs text-neutral-500 text-center">
              <p>This dialog will remain open until you confirm your email</p>
            </div> */}
            {onClose && (
                <Button 
                  variant="ghost" 
                  onClick={onClose}
                  className="w-full bg-transparent hover:bg-transparent text-neutral-600"
                >
                  I'll check my email later
                </Button>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
