"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTag, FiArrowRight, FiMapPin, FiCalendar } from "react-icons/fi";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    eventType: string;
    thumbnail: string;
    location: string;
    eventDate: string;
  };
}

// Theme-consistent tag colors: all use light backgrounds with dark text
// This ensures readability in both light/dark themes without drastic changes
// Color vibes associated with each type, related tags share colors
const EVENT_TYPE_COLORS: Record<string, string> = {
  Cleanup: "bg-primary/15 text-primary border-primary/30",
  Plantation: "bg-success/15 text-success border-success/30",
  Donation: "bg-info/15 text-info border-info/30",
  "Food Distribution": "bg-info/15 text-info border-info/30", // share with Donation
  "Blood Donation": "bg-error/15 text-error border-error/30", // share vibe with Donation
  "Health Camp": "bg-secondary/15 text-secondary border-secondary/30",
  Education: "bg-accent/15 text-accent border-accent/30",
  Other: "bg-base-300/50 text-base-content border-base-300",
};

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getEventTypeBadgeClass(eventType: string) {
  return EVENT_TYPE_COLORS[eventType] ?? EVENT_TYPE_COLORS.Other;
}

// Placeholder image SVG as data URI - professional placeholder
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e8e8e8' width='400' height='300'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='16' fill='%23999'%3ECommunity Event%3C/text%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,sans-serif' font-size='12' fill='%23aaa'%3EIMAGE CURRENTLY UNAVAILABLE%3C/text%3E%3C/svg%3E`;

export function EventCard({ event }: EventCardProps) {
  const eventTypeBadge = getEventTypeBadgeClass(event.eventType);
  const shortDate = formatEventDate(event.eventDate);
  const [imgError, setImgError] = React.useState(false);
  const hasValidThumbnail = event.thumbnail && event.thumbnail.trim() !== "";

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-base-100 border border-base-300 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1" role="listitem">
      {/* Thumbnail - taller */}
      <div className="relative h-56 w-full overflow-hidden">
        {hasValidThumbnail && !imgError ? (
          <Image
            src={event.thumbnail}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
            onError={() => setImgError(true)}
          />
        ) : (
          <Image
            src={PLACEHOLDER_SVG}
            alt={event.title}
            fill
            className="object-cover"
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            aria-hidden="true"
          />
        )}
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-200/90 via-transparent to-transparent pointer-events-none" aria-hidden="true" />

        {/* Date at top left corner of thumbnail */}
        <div className="absolute top-3 left-3 bg-base-100/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-base-200/50">
          <div className="flex items-center gap-1.5 text-sm">
            <FiCalendar className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
            <span className="font-semibold text-base-content whitespace-nowrap">{shortDate}</span>
          </div>
        </div>

        {/* Event type badge at bottom right of thumbnail - theme-consistent colors */}
        <span className={`absolute bottom-3 right-3 badge badge-sm shadow-lg gap-1.5 px-3 py-1.5 ${eventTypeBadge}`}>
          <FiTag className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span className="font-medium text-sm">{event.eventType}</span>
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Title - 1 line truncate */}
        <h3 className="text-lg font-bold text-base-content line-clamp-1 group-hover:text-primary transition-colors duration-200 leading-snug">
          {event.title}
        </h3>

        {/* Location as a pill - icon only indicator */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-base-200/80 border border-base-300/50 text-sm font-medium text-base-content">
            <FiMapPin className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
            <span className="truncate max-w-[200px]">{event.location}</span>
          </span>
        </div>

        {/* Description - fixed height area (2 lines), button stays at bottom */}
        <div className="min-h-[3.5rem] flex items-start">
          <p className="text-sm text-base-content/60 line-clamp-2 leading-relaxed w-full">
            {event.description}
          </p>
        </div>

        {/* Action button - arrow right next to text like login page - always at bottom */}
        <Link
          href={`/events/${event.id}`}
          className="btn btn-primary w-full gap-2 flex items-center justify-center mt-auto"
          style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          <span className="font-medium">View Event</span>
          <FiArrowRight className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}