// src/components/auth/GoogleButton.tsx
import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";

interface GoogleButtonProps {
  onClick: () => void;
  children?: string;
  loading?: boolean;
}

export function GoogleButton({ onClick, children = "Sign in with Google", loading = false }: GoogleButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center gap-2"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <IconBrandGoogle className="w-5 h-5" />
      )}
      {loading ? "Connecting..." : children}
    </Button>
  );
}