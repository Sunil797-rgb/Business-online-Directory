import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/site/auth-form";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Thok Bazar account to list your wholesale business.",
};

export default function SignupPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <Logo />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="text-muted-foreground mt-1.5 text-center text-sm text-pretty">
        Free for suppliers. You can list your business straight after.
      </p>
      <Card className="mt-7 w-full p-6">
        <AuthForm mode="signup" />
      </Card>
    </div>
  );
}
