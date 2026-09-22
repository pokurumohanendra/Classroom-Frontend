import { useEffect, type PropsWithChildren } from "react";
import { Navigate } from "react-router";
import { useGetIdentity } from "@refinedev/core";
import { toast } from "sonner";

type Identity = { role?: "admin" | "teacher" | "student" };

export const RequireRole = ({ roles, children }: PropsWithChildren<{ roles: Identity["role"][] }>) => {
  const { data: identity, isLoading } = useGetIdentity<Identity>();

  const allowed = !!identity?.role && roles.includes(identity.role);

  useEffect(() => {
    if (!isLoading && identity && !allowed) {
      toast.error("You don't have permission to view that page.");
    }
  }, [isLoading, identity, allowed]);

  if (isLoading) return null;
  if (!allowed) return <Navigate to="/" replace />;
  return <>{children}</>;
};
