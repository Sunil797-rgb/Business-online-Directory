"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

/**
 * Email + password auth against Supabase.
 *
 * In demo mode there is no auth backend, so the form explains that instead of
 * failing silently. Phone OTP would suit Nepali users better long term, but it
 * needs a paid SMS provider, so email is the starting point.
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const supabase = createClient();
  const configured = supabase !== null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;

    setBusy(true);
    setError(null);
    setNotice(null);

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        setNotice("Check your inbox for the confirmation link, then log in.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!configured && (
        <p className="border-warning/40 bg-warning/10 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm">
          <Info className="mt-0.5 size-4 shrink-0" />
          <span className="text-pretty">
            Accounts need a Supabase project. Add{" "}
            <code className="bg-background/60 rounded px-1 font-mono text-xs">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            and{" "}
            <code className="bg-background/60 rounded px-1 font-mono text-xs">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            to <code className="bg-background/60 rounded px-1 font-mono text-xs">.env.local</code>{" "}
            to enable login. Browsing the directory works without one.
          </span>
        </p>
      )}

      {error && (
        <p
          className="border-destructive/30 bg-destructive/8 text-destructive flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {notice && (
        <p className="border-success/30 bg-success/8 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm">
          <Mail className="text-success mt-0.5 size-4 shrink-0" />
          {notice}
        </p>
      )}

      {mode === "signup" && (
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Your name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            placeholder="Ram Bahadur Thapa"
            disabled={!configured}
            required
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          disabled={!configured}
          required
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {mode === "login" && (
            <span className="text-muted-foreground text-xs">At least 8 characters</span>
          )}
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          minLength={8}
          disabled={!configured}
          required
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={!configured || busy}>
        {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
