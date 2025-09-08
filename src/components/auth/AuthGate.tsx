import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/utils/hooks";

interface AuthGateProps {
  children: ReactNode;
  redirectTo?: string;
}

export function AuthGate({
  children,
  redirectTo,
}: AuthGateProps) {
  const { user, loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
useEffect(()=>{
  if(user?.role !== "admin"){
    navigate("/");
  }else{
    navigate(redirectTo || "/");
  }
},[user,loading])
return <>{children}</>;

 
}


