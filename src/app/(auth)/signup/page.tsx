import { RegisterForm } from "@/features/auth/components/register-form";
import { requireAuth } from "@/lib/auth-utils";
import React from "react";

const page = async () => {
  await requireAuth();
  return <RegisterForm />;
};

export default page;
