"use client";

import { useState, FormEvent, Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FiUser, FiMail, FiImage, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import Image from "next/image";

type FieldErrors = Partial<Record<string, string>>;

function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const redirectedRef = useRef(false);

  // Check session only once on mount
  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      if (redirectedRef.current || !mounted) return;
      const { data: session } = await authClient.getSession();
      if (session?.user && mounted) {
        redirectedRef.current = true;
        router.push("/");
      }
    };
    checkSession();
    return () => { mounted = false; };
  }, [router]);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "Name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (photoURL.trim() && !/^https?:\/\//i.test(photoURL.trim()))
      next.photoURL = "Photo URL must start with http or https.";
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
      const { data, error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        ...(photoURL.trim() ? { image: photoURL.trim() } : {}),
      });

      if (error) {
        throw new Error(error.message ?? "Registration failed.");
      }

      if (data) {
        router.push("/");
        router.refresh();
      }
    } catch {
      throw new Error("Could not reach the server. Try again.");
    } finally {
      setPending(false);
    }
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
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="mt-2 text-sm text-secondary">Join the community and start driving social change</p>
          </div>

          <form className="space-y-4.5" onSubmit={onSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="name">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  disabled={pending}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-base-300 bg-base-100 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_0_3px_var(--color-primary)/0.15] disabled:opacity-50 placeholder:text-base-content/35 shadow-sm hover:shadow-md"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email Address</label>
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
              <label className="block text-sm font-medium mb-1.5" htmlFor="photoURL">Profile Photo URL</label>
              <div className="relative">
                <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" aria-hidden="true" />
                <input
                  id="photoURL"
                  type="url"
                  autoComplete="photo"
                  disabled={pending}
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="w-full rounded-lg border border-base-300 bg-base-100 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_0_3px_var(--color-primary)/0.15] disabled:opacity-50 placeholder:text-base-content/35 shadow-sm hover:shadow-md"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <p className="mt-1.5 text-xs text-base-content/50">Optional: Leave empty for default avatar</p>
              {errors.photoURL && <p className="mt-1.5 text-xs text-error">{errors.photoURL}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
                  Creating your account...
                </>
              ) : (
                <>
                  Register
                  <FiArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>

            <p className="mt-4 text-center text-sm text-base-content/70">Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}