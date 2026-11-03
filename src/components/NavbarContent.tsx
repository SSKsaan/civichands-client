"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { MdPersonAdd, MdLogout, MdAdd, MdManageAccounts, MdEventNote, MdKeyboardArrowDown, MdOutlineCalendarMonth } from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";

interface NavbarClientProps {
  session: {
    user: {
      name: string;
      email: string;
      image?: string | null;
    };
  } | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  iconColor: string;
  onClick?: () => void;
}

export default function NavbarClient({ session }: NavbarClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isEventsPage = pathname === "/events";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await authClient.signOut();
      toast.success("Signed out");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Try again.");
    }
  }

  const menuItems: MenuItem[] = [
    {
      label: "Create Event",
      href: "/create-event",
      icon: <MdAdd className="w-5 h-5" aria-hidden="true" />,
      iconColor: "text-primary",
    },
    {
      label: "Manage Events",
      href: "/manage-events",
      icon: <MdManageAccounts className="w-5 h-5" aria-hidden="true" />,
      iconColor: "text-accent",
    },
    {
      label: "Joined Events",
      href: "/joined-events",
      icon: <MdEventNote className="w-5 h-5" aria-hidden="true" />,
      iconColor: "text-secondary",
    },
  ];

  return (
    <header className="relative sticky top-0 z-40 border-b border-base-300/80 bg-base-100/85 backdrop-blur">
      <span className="navbar-accent absolute bottom-0 left-0 right-0" />
      <Container>
        <nav
          aria-label="Main"
          className="flex h-14 sm:h-16 items-center justify-between gap-3 sm:gap-4 min-w-0"
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
            <span className="flex flex-col min-w-0">
              <span className="text-xl font-bold leading-none tracking-tight sm:text-2xl truncate">
                CivicHands
              </span>
              <span className="mt-1 text-[0.55rem] font-medium uppercase leading-none tracking-[0.02em] text-primary/70 sm:text-[0.6rem] truncate">
                Community Initiatives
              </span>
            </span>
          </Link>

          {/* Desktop: Upcoming Events link - unified icon+text with simple active color change */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/events"
              className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                isEventsPage
                  ? "text-primary bg-primary/10"
                  : "text-base-content/70 hover:text-primary hover:bg-base-200"
              }`}
              aria-label="Upcoming Events"
              aria-current={isEventsPage ? "page" : undefined}
            >
              <MdOutlineCalendarMonth className="w-4 h-4" aria-hidden="true" />
              <span>Upcoming Events</span>
            </Link>
          </div>

          {/* Mobile: Upcoming Events with curved square bg - active state with primary bg */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/events"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                isEventsPage
                  ? "bg-primary text-primary-content shadow-lg"
                  : "bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-lg"
              } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
              aria-label="Upcoming Events"
              aria-current={isEventsPage ? "page" : undefined}
            >
              <MdOutlineCalendarMonth className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {session?.user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="relative" ref={dropdownRef}>
                  <button
                    ref={buttonRef}
                    type="button"
                    className="relative flex items-center gap-1.5 sm:gap-2 rounded-full bg-primary/10 px-2.5 sm:px-3 pr-2.5 sm:pr-3 py-1.5 sm:py-2 text-sm sm:text-base text-primary transition hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    aria-label="User menu"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setDropdownOpen(false);
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setDropdownOpen(!dropdownOpen);
                      }
                    }}
                  >
                    <span className="relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 overflow-hidden">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt=""
                          width={32}
                          height={32}
                          className="h-full w-full rounded-full object-cover"
                          unoptimized
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            (e.currentTarget.nextElementSibling as HTMLElement)?.style.setProperty("display", "flex");
                          }}
                        />
                      ) : null}
                      <span
                        className={`flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-content font-medium text-sm ${
                          session.user.image ? "hidden" : "flex"
                        }`}
                      >
                        {getInitials(session.user.name)}
                      </span>
                    </span>

                    <MdKeyboardArrowDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-base-content/60 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl bg-base-100 border border-base-300 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150"
                      role="menu"
                    >
                      <div className="px-3 py-2.5 border-b border-base-300">
                        <p className="text-sm font-semibold text-base-content truncate">{session.user.name}</p>
                        <p className="text-xs text-base-content/60 truncate">{session.user.email}</p>
                      </div>
                      <div className="py-1">
                        {menuItems.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-base-content hover:bg-base-200 transition-colors focus-visible:outline-none focus-visible:bg-base-200"
                            role="menuitem"
                            onClick={() => {
                              if (item.href) {
                                router.push(item.href);
                                router.refresh();
                              }
                              setDropdownOpen(false);
                            }}
                          >
                            <span className={`${item.iconColor} flex-shrink-0`}>{item.icon}</span>
                            {item.label}
                          </button>
                        ))}
                      </div>
                      <hr className="mt-1 border-base-300" />
                      <div className="px-2 py-1">
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-error rounded-lg hover:bg-error/10 transition-colors focus-visible:outline-none focus-visible:bg-error/10"
                          role="menuitem"
                          onClick={handleLogout}
                        >
                          <MdLogout className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop: Logout button with curved square bg */}
                <div className="hidden md:flex">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-error/10 text-error transition hover:bg-error/20 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
                    aria-label="Sign out"
                    onClick={handleLogout}
                  >
                    <MdLogout className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary text-primary-content transition hover:opacity-90 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Sign in"
              >
                <MdPersonAdd className="w-5 h-5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}