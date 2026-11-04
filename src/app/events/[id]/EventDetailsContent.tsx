"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiTag,
  FiMapPin,
  FiCalendar,
  FiShare2,
  FiCheckCircle,
  FiUsers,
  FiCheck,
  FiAward,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Container from "@/components/Container";
import type { Event } from "@/lib/api";

interface SessionUser {
  name: string;
  email: string;
  image?: string | null;
}

type Session = {
  user: SessionUser;
} | null;

interface EventDetailsContentProps {
  event: Event;
  session: Session;
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  Cleanup: "bg-primary/15 text-primary border-primary/30",
  Plantation: "bg-success/15 text-success border-success/30",
  Donation: "bg-info/15 text-info border-info/30",
  "Food Distribution": "bg-info/15 text-info border-info/30",
  "Blood Donation": "bg-error/15 text-error border-error/30",
  "Health Camp": "bg-secondary/15 text-secondary border-secondary/30",
  Education: "bg-accent/15 text-accent border-accent/30",
  Other: "bg-base-300/50 text-base-content border-base-300",
};

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isEventEnded(eventDate: string) {
  return new Date() > new Date(eventDate);
}

function getEventTypeBadgeClass(eventType: string) {
  return EVENT_TYPE_COLORS[eventType] ?? EVENT_TYPE_COLORS.Other;
}

const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e8e8e8' width='400' height='300'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='16' fill='%23999'%3ECommunity Event%3C/text%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='12' fill='%23aaa'%3EIMAGE CURRENTLY UNAVAILABLE%3C/text%3E%3C/svg%3E`;

function VerifiedTooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <span className="relative inline-block cursor-help group">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-xs font-medium text-base-100 bg-base-content rounded-lg shadow-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
        {content}
      </span>
    </span>
  );
}

function ExpandModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-content/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[80vh] bg-base-100 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-200 sticky top-0 bg-base-100 z-10">
          <h3 id="modal-title" className="text-lg font-semibold text-base-content">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-square btn-sm text-base-content/60 hover:text-base-content hover:bg-base-200"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[65vh]">{children}</div>
      </div>
    </div>
  );
}

function DescriptionSection({
  description,
  targetHeight,
  isDesktop,
}: {
  description: string;
  targetHeight: number;
  isDesktop: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsExpand, setNeedsExpand] = useState(false);

  useLayoutEffect(() => {
    if (!isDesktop || !contentRef.current) {
      setNeedsExpand(false);
      return;
    }
    const { scrollHeight, clientHeight } = contentRef.current;
    const shouldExpand = scrollHeight > clientHeight + 4;
    setNeedsExpand(shouldExpand);
  }, [description, targetHeight, isDesktop]);

  const containerStyle = isDesktop ? { height: targetHeight } : {};

  return (
    <div className="rounded-2xl bg-base-100 border border-base-300 shadow-sm overflow-hidden flex flex-col" style={containerStyle}>
      <div className="px-5 py-3.5 border-b border-base-200 flex items-center justify-between gap-4 flex-shrink-0">
        <h2 className="text-base font-semibold text-base-content">About this Event</h2>
        {isDesktop && needsExpand && (
          <button
            onClick={() => setIsExpanded(true)}
            className="p-1 rounded-lg text-base-content/50 hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
            aria-label="Expand description"
          >
            <FiChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
      <div
        ref={contentRef}
        className={`prose prose-base text-base-content/70 max-w-none whitespace-pre-wrap leading-relaxed overflow-hidden flex-1 relative p-5 pt-2 ${
          isDesktop && isExpanded ? "max-h-[500px] overflow-y-auto" : ""
        }`}
      >
        {description}
        {isDesktop && !isExpanded && needsExpand && (
          <div className="absolute bottom-0 left-5 right-5 h-16 bg-gradient-to-t from-base-100 via-base-100/80 to-transparent pointer-events-none" />
        )}
      </div>

      <ExpandModal
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        title="About this Event"
      >
        <div className="prose prose-base text-base-content/70 max-w-none whitespace-pre-wrap leading-relaxed">
          {description}
        </div>
      </ExpandModal>
    </div>
  );
}

const OrganizerSection = React.forwardRef<HTMLDivElement, {
  event: EventDetailsContentProps["event"];
  isDesktop: boolean;
}>(({ event, isDesktop }, ref) => {
  const creatorName = event.creatorName || "Community Organizer";
  const creatorEmail = event.creatorEmail || "organizer@civichands.demo";
  
  const creatorOrganizedCount = event.creatorOrganizedCount ?? 0;
  const creatorJoinedCount = event.creatorJoinedCount ?? 0;
  const isVerified = creatorOrganizedCount >= 1 && creatorJoinedCount >= 1;

  const recordParts = [];
  if (creatorOrganizedCount > 0) recordParts.push(`Organized ${creatorOrganizedCount} initiative${creatorOrganizedCount === 1 ? "" : "s"}`);
  if (creatorJoinedCount > 0) recordParts.push(`Joined ${creatorJoinedCount} initiative${creatorJoinedCount === 1 ? "" : "s"}`);
  const recordText = recordParts.join(" · ");

  const containerStyle = isDesktop ? {} : {};

  return (
    <div ref={ref} className="rounded-2xl bg-base-100 border border-base-300 shadow-sm overflow-hidden flex flex-col" style={containerStyle}>
      <div className="px-5 py-3 border-b border-base-200 flex-shrink-0">
        <h2 className="text-base font-semibold text-base-content">Initiative Organizer</h2>
      </div>
      <div className="p-4 pb-3 flex-1 flex flex-col overflow-hidden">
        {/* Profile + Name + Email */}
        <div className="flex items-start gap-3 mb-2">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-primary/15 flex-shrink-0 border-2 border-primary/20">
            {event.creatorImage ? (
              <Image
                src={event.creatorImage}
                alt={creatorName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-primary text-lg">
                {creatorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-base-content/70 truncate text-base">{creatorName}</p>
            <p className="text-sm text-base-content/60 truncate mt-0.5">
              <VerifiedTooltip content="Verified Platform Member">
                <span className="font-medium text-base-content/60">{creatorEmail}</span>
              </VerifiedTooltip>
            </p>
          </div>
        </div>

        <div className="border-t border-base-200 my-2" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          
          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200 flex-shrink-0 self-start">
              <FiAward className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span>Verified Platform Member</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 text-success text-xs font-medium border border-success/30 flex-shrink-0 self-start">
              <FaLeaf className="w-3.5 h-3.5 text-success" aria-hidden="true" />
              <span>New Platform Member</span>
            </span>
          )}

          {recordText && (
            <p className="text-xs text-base-content/60 whitespace-nowrap">{recordText}</p>
          )}
        </div>
      </div>
    </div>
  );
});
OrganizerSection.displayName = "OrganizerSection";

const GuidelinesSection = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="rounded-2xl bg-base-100 border border-base-300 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-3 border-b border-base-200 flex-shrink-0">
        <h2 className="text-base font-semibold text-base-content">Volunteer Guidelines</h2>
      </div>
      <div className="p-4 flex-1">
        <ul className="space-y-1.5 text-sm text-base-content/70">
          <li className="flex items-start gap-3">
            <span className="flex h-5 w-5 items-center justify-center shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
            </span>
            <span>Please arrive 15 minutes before the scheduled time at the designated location.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-5 w-5 items-center justify-center shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
            </span>
            <span>Wear comfortable clothing suitable for physical social work and distribution.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-5 w-5 items-center justify-center shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
            </span>
            <span>Bring any pre-coordinated relief packages or distribution items if requested.</span>
          </li>
        </ul>
      </div>
    </div>
  );
});
GuidelinesSection.displayName = "GuidelinesSection";

function VolunteersSection({
  joinedUsers,
  joinedCount,
  targetHeight,
  isDesktop,
}: {
  joinedUsers: Array<{ name: string; email: string; image?: string; organizedCount: number; joinedCount: number }>;
  joinedCount: number;
  targetHeight: number;
  isDesktop: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const needsExpand = isDesktop && joinedUsers.length > 2;

  const visibleVolunteers = isDesktop && joinedUsers.length > 2 ? joinedUsers.slice(0, 2) : joinedUsers;

  const containerStyle = isDesktop ? { height: targetHeight } : {};

  return (
    <div className="rounded-2xl bg-base-100 border border-base-300 shadow-sm overflow-hidden flex flex-col" style={containerStyle}>
      <div className="px-5 py-3 border-b border-base-200 flex items-center justify-between gap-4 flex-shrink-0">
        <h2 className="text-base font-semibold text-base-content">
          Confirmed Volunteers ({joinedCount})
        </h2>
        {needsExpand && (
          <button
            onClick={() => setIsExpanded(true)}
            className="p-1 pr-2 rounded-lg text-base-content/50 hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
            aria-label="Expand volunteers list"
          >
            <FiChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
      <div
        ref={contentRef}
        className={`p-4 flex-1 overflow-hidden ${isExpanded ? "overflow-y-auto max-h-[500px]" : "overflow-hidden"}`}
      >
        {joinedUsers.length > 0 ? (
          <div className="space-y-2.5 relative">
            {visibleVolunteers.map((user, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors"
              >
                <div className="relative h-9 w-9 rounded-full overflow-hidden bg-primary/15 flex-shrink-0 border border-primary/20">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-primary text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-base-content/70 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-base-content/60 truncate">
                    {user.email}
                  </p>
                </div>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0 ${
                  user.organizedCount >= 1 && user.joinedCount >= 1
                    ? "bg-warning/15 text-warning border-warning/30"
                    : "bg-success/15 text-success border-success/30"
                }`} title={user.organizedCount >= 1 && user.joinedCount >= 1 ? "Verified Platform Member" : "New Member"}>
                  {user.organizedCount >= 1 && user.joinedCount >= 1 ? (
                    <FiAward className="w-3 h-3" />
                  ) : (
                    <FaLeaf className="w-3 h-3" />
                  )}
                </span>
              </div>
            ))}
            {isDesktop && joinedUsers.length > 2 && visibleVolunteers.length === 2 && !isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-base-100 via-base-100/80 to-transparent pointer-events-none" />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-base-content/50">
            <p className="text-center">No volunteer yet! Be the first one to take a positive initiative.</p>
          </div>
        )}
      </div>

      <ExpandModal
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        title={`Confirmed Volunteers (${joinedCount})`}
      >
        <div className="space-y-2.5">
          {joinedUsers.length > 0 ? (
            joinedUsers.map((user, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors">
                <div className="relative h-9 w-9 rounded-full overflow-hidden bg-primary/15 flex-shrink-0 border border-primary/20">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-primary text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-base-content/70 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-base-content/60 truncate">
                    {user.email}
                  </p>
                </div>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0 ${
                  user.organizedCount >= 1 && user.joinedCount >= 1
                    ? "bg-warning/15 text-warning border-warning/30"
                    : "bg-success/15 text-success border-success/30"
                }`} title={user.organizedCount >= 1 && user.joinedCount >= 1 ? "Verified Platform Member" : "New Member"}>
                  {user.organizedCount >= 1 && user.joinedCount >= 1 ? (
                    <FiAward className="w-3 h-3" />
                  ) : (
                    <FaLeaf className="w-3 h-3" />
                  )}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-base-content/50 py-8">No volunteer yet! Be the first one to take a positive initiative.</p>
          )}
        </div>
      </ExpandModal>
    </div>
  );
}

export function EventDetailsContent({ event, session }: EventDetailsContentProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const hasValidThumbnail = event.thumbnail && event.thumbnail.trim() !== "";
  const ended = isEventEnded(event.eventDate);
  const tagColors = getEventTypeBadgeClass(event.eventType);

  const joinedUsers = (event.joinedUsers ?? []).filter(
    (user) => user.email !== event.creatorEmail
  );
  const joinedCount = joinedUsers.length;

  const isOrganizer = session?.user?.email === event.creatorEmail;
  const isJoined = session?.user ? joinedUsers.some((u) => u.email === session.user!.email) : false;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleJoin = () => {
    if (!session) {
      router.push(`/login?redirect=/events/${event.id}`);
      return;
    }
    if (isOrganizer) {
      toast("You&apos;re the organizer of this event.", { icon: "🏆" });
      return;
    }
    if (isJoined) {
      toast("You've already joined this event.", { icon: "✅" });
      return;
    }
    if (ended) {
      toast("This event has already concluded.", { icon: "📅" });
      return;
    }
    toast.error("Unable to join at the moment. Please try again later.");
  };

  const [row1Height, setRow1Height] = useState(0);
  const [row2Height, setRow2Height] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const orgRef = useRef<HTMLDivElement>(null);
  const guidelinesRef = useRef<HTMLDivElement>(null);

  // Detect desktop vs mobile
  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setRow1Height(0);
      setRow2Height(0);
      return;
    }

    const measureHeights = () => {
      if (orgRef.current) setRow1Height(orgRef.current.offsetHeight);
      if (guidelinesRef.current) setRow2Height(guidelinesRef.current.offsetHeight);
    };

    requestAnimationFrame(measureHeights);
    window.addEventListener("resize", measureHeights);
    return () => window.removeEventListener("resize", measureHeights);
  }, [isDesktop, event.description, joinedUsers.length]);

  return (
    <Container className="pt-6 md:pt-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-base-content/70 hover:text-primary transition-colors group"
        >
          <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          <span className="hidden sm:inline">Back to Events</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <span className={`badge badge-md gap-2 px-3 py-1.5 font-medium rounded-full ${tagColors} flex-shrink-0`}>
          <FiTag className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{event.eventType}</span>
        </span>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-base-100 border border-base-300 shadow-sm mb-6">
        <div className="relative h-80 sm:h-[480px] md:h-[520px] w-full overflow-hidden bg-base-200">
          {hasValidThumbnail && !imgError ? (
            <Image
              src={event.thumbnail}
              alt={event.title}
              fill
              className="object-cover"
              unoptimized
              priority
              onError={() => setImgError(true)}
            />
          ) : (
            <Image
              src={PLACEHOLDER_SVG}
              alt={event.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-base-300/95 via-base-300/50 to-transparent pointer-events-none" aria-hidden="true" />

          {ended && (
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <span className="badge badge-error badge-lg shadow-lg font-semibold px-4 py-2.5 rounded-full">
                Event Ended
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-col sm:flex-row gap-2">
            <span className="inline-flex items-center gap-2 bg-base-100/90 backdrop-blur-sm px-3.5 py-2 rounded-xl shadow-sm border border-base-200/50 w-fit">
              <FiCalendar className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm sm:text-base font-medium text-base-content/80">{formatEventDate(event.eventDate)}</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-base-100/90 backdrop-blur-sm px-3.5 py-2 rounded-xl shadow-sm border border-base-200/50 w-fit">
              <FiMapPin className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm sm:text-base font-medium text-base-content/80">{event.location}</span>
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-base-content tracking-tight leading-tight drop-shadow-sm">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-base-100 border border-base-300 p-5 sm:p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary flex-shrink-0">
              <FiUsers className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold text-base-content">
                {joinedCount > 0 ? `${joinedCount} Volunteer${joinedCount === 1 ? "" : "s"} Joined` : "Be the first volunteer!"}
              </p>
              <p className="text-sm text-base-content/60">
                {ended ? "This community initiative has concluded." : "Sign up to join hands for this drive"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleShare}
              className="btn btn-square btn-outline border-base-300 hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors h-12 w-12 flex-shrink-0"
              aria-label="Share event"
              title="Share event link"
            >
              <FiShare2 className="w-5 h-5" />
            </button>

            <div className="w-full sm:w-auto flex-1 sm:flex-none">
              {ended ? (
                <button className="btn btn-disabled w-full px-5 h-12 flex-shrink-0">
                  Event Concluded
                </button>
              ) : isOrganizer ? (
                <button className="btn w-full sm:w-auto px-4 h-12 gap-2 text-sm font-semibold bg-base-200 text-base-content/60 border border-base-300 flex-shrink-0" disabled>
                  <FiAward className="w-4 h-4" />
                  <span className="hidden sm:inline">You&apos;re the Organizer</span>
                  <span className="sm:hidden">Organizer</span>
                </button>
              ) : isJoined ? (
                <button className="btn btn-success w-full sm:w-auto px-4 h-12 gap-2 text-sm font-semibold flex-shrink-0" disabled>
                  <FiCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Already Joined</span>
                  <span className="sm:hidden">Joined</span>
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  className="btn btn-primary w-full px-4 h-12 gap-2 text-sm font-semibold shadow-md flex-shrink-0"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Join Event</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <DescriptionSection
            description={event.description}
            targetHeight={row1Height || 220}
            isDesktop={isDesktop}
          />
        </div>

        <div className="lg:col-span-1">
          <OrganizerSection
            event={event}
            isDesktop={isDesktop}
            ref={orgRef}
          />
        </div>

        <div className="lg:col-span-1">
          <GuidelinesSection ref={guidelinesRef} />
        </div>

        <div className="lg:col-span-1">
          <VolunteersSection
            joinedUsers={joinedUsers}
            joinedCount={joinedCount}
            targetHeight={row2Height || 160}
            isDesktop={isDesktop}
          />
        </div>
      </div>
    </Container>
  );
}