import { fetchEvent } from "@/lib/api";
import { notFound } from "next/navigation";
import { EventDetailsContent } from "./EventDetailsContent";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const event = await fetchEvent(id);
    return {
      title: `${event.title} | CivicHands`,
      description: event.description.slice(0, 160),
    };
  } catch {
    return {
      title: "Event Not Found | CivicHands",
    };
  }
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { id } = await params;

  let event;
  try {
    event = await fetchEvent(id);
  } catch (error) {
    if (error instanceof Error && error.message === "Event not found") {
      notFound();
    }
    throw error;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main className="min-h-screen bg-base-200/30 pb-12">
      <EventDetailsContent event={event} session={session} />
    </main>
  );
}