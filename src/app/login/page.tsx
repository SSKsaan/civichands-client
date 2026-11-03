"use client";

import { useState, FormEvent, Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

type FieldErrors = Partial<Record<string, string>>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [socialPending, setSocialPending] = useState<"github" | "google" | null>(null);
  const redirectedRef = useRef(false);

  // Check session only once on mount
  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      if (redirectedRef.current || !mounted) return;
      const { data: session } = await authClient.getSession();
      if (session?.user && mounted) {
        redirectedRef.current = true;
        toast.error("Already logged in");
        router.push(redirectParam ?? "/");
      }
    };
    checkSession();
    return () => { mounted = false; };
  }, [router, redirectParam]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    else if (!/[A-Z]/.test(password)) next.password = "Password needs at least one uppercase letter.";
    else if (!/[a-z]/.test(password)) next.password = "Password needs at least one lowercase letter.";
    return next;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setPending(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message ?? "Invalid email or password.");
        return;
      }

      if (data) {
        toast.success("You are signed in.");
        const target =
          redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
            ? redirectParam
            : "/";
        router.push(target);
        router.refresh();
      }
    } catch {
      toast.error("Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
  }

  function handleForgotPassword(e: FormEvent) {
    e.preventDefault();
    toast("Forgot password feature coming soon.", { icon: "🔑" });
  }

  return (
    <main className="auth-page-enter flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl shadow-primary/5 p-6 sm:p-8 transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10">
          <div className="flex justify-center mb-3">
            <Image
              src="/images/logo-light.svg"
              alt=""
              width={64}
              height={61}
              priority
              className="logo-for-light h-[64px] w-auto"
            />
            <Image
              src="/images/logo-dark.svg"
              alt=""
              width={64}
              height={61}
              priority
              className="logo-for-dark h-[64px] w-auto"
            />
          </div>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-secondary">Sign in to continue making an impact</p>
          </div>

          <form className="space-y-4.5" onSubmit={onSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={pending}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-base-300 bg-base-100 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_0_3px_var(--color-primary)/0.15] disabled:opacity-50 placeholder:text-base-content/35 shadow-sm hover:shadow-md"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-error">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium" htmlFor="password">Password</label>
                <button type="button" onClick={handleForgotPassword} className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={pending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-base-300 bg-base-100 pl-10 pr-12 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_0_3px_var(--color-primary)/0.15] disabled:opacity-50 placeholder:text-base-content/35 shadow-sm hover:shadow-md"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-error">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-content transition hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-primary/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none disabled:hover:translate-y-0 flex items-center justify-center gap-2 my-4"
            >
              {pending ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-sm text-base-content/70">Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">Register Now!</Link>
            </p>
          </form>

          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase text-base-content/50">
                <span className="bg-base-100 px-2 text-base-content/50">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={pending || socialPending === "github"}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-base-300 bg-base-100 text-sm font-medium text-base-content transition hover:bg-base-200 hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setSocialPending("github");
                  authClient.signIn.social({ provider: "github", callbackURL: redirectParam ? `${redirectParam}?social_login=github` : "/?social_login=github" });
                }}
                aria-label="Sign in with GitHub"
              >
                {socialPending === "github" ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <FiGithub className="w-5 h-5" aria-hidden="true" />
                )}
                GitHub
              </button>
              <button
                type="button"
                disabled={pending || socialPending === "google"}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-base-300 bg-base-100 text-sm font-medium text-base-content transition hover:bg-base-200 hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setSocialPending("google");
                  authClient.signIn.social({ provider: "google", callbackURL: redirectParam ? `${redirectParam}?social_login=google` : "/?social_login=google" });
                }}
                aria-label="Sign in with Google"
              >
                {socialPending === "google" ? (
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <FcGoogle className="w-5 h-5" aria-hidden="true" />
                )}
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}