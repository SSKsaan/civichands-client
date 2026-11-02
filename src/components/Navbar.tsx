import Image from "next/image";
import Link from "next/link";
import { MdPersonAdd } from "react-icons/md";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="relative sticky top-0 z-40 border-b border-base-300/80 bg-base-100/85 backdrop-blur">
      <span className="navbar-accent absolute bottom-0 left-0 right-0" />
      <Container>
        <nav
          aria-label="Main"
          className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]"
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-3"
          >
            <span className="relative flex h-[33px] shrink-0 items-center sm:h-[38px]">
              <Image
                src="/images/logo-light.svg"
                alt=""
                width={40}
                height={38}
                priority
                className="logo-for-light h-full w-auto"
              />
              <Image
                src="/images/logo-dark.svg"
                alt=""
                width={40}
                height={38}
                priority
                className="logo-for-dark h-full w-auto"
              />
            </span>
            <span className="flex flex-col">
              <span className="text-xl font-bold leading-none tracking-tight sm:text-2xl">
                CivicHands
              </span>
              <span className="mt-1 text-[0.58rem] font-medium uppercase leading-none tracking-[0.02em] text-primary/70 sm:text-[0.62rem]">
                Community Initiatives
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content transition hover:opacity-90 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Sign in"
            >
              <MdPersonAdd className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}