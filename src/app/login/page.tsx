import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/site/auth-form";
import { Logo } from "@/components/site/logo";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to manage your Thok Bazar supplier listing.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <Logo />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="text-muted-foreground mt-1.5 text-center text-sm text-pretty">
        Log in to update your price list, terms and enquiries.
      </p>
      <Card className="mt-7 w-full p-6">
        <AuthForm mode="login" />
      </Card>
    </div>
  );
}
