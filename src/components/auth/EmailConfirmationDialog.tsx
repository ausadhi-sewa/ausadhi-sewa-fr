import React from "react";
import { Button } from "@/components/ui/button";
import { IconMail, IconCheck, IconAlertCircle } from "@tabler/icons-react";
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
  onClose 
}: EmailConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-medical-green-500 to-medical-blue-500 rounded-full flex items-center justify-center mb-4">
            <IconMail className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-neutral-800">
            Check Your Email
          </DialogTitle>
          <DialogDescription className="text-neutral-600">
            We've sent a confirmation link to your email address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <IconCheck className="h-4 w-4" />
            <AlertDescription>
              A confirmation email has been sent to <strong>{email}</strong>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="text-sm text-neutral-600 space-y-2">
              <p>To complete your registration:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the confirmation link in the email</li>
                <li>Return here to sign in with your account</li>
              </ol>
            </div>

            <div className="flex flex-col gap-3">
              {onResendEmail && (
                <Button 
                  variant="outline" 
                  onClick={onResendEmail}
                  className="w-full"
                >
                  Resend Confirmation Email
                </Button>
              )}
              
              {onClose && (
                <Button 
                  variant="ghost" 
                  onClick={onClose}
                  className="w-full"
                >
                  I'll check my email later
                </Button>
              )}
            </div>

            <div className="text-xs text-neutral-500 text-center">
              <p>This dialog will remain open until you confirm your email</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
