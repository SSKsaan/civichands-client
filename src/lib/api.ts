const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorName?: string;
  creatorImage?: string;
  creatorEmail?: string;
  creatorOrganizedCount?: number;
  creatorJoinedCount?: number;
  _count?: {
    joins: number;
  };
  joinedUsers?: Array<{
    name: string;
    email: string;
    image?: string;
    organizedCount: number;
    joinedCount: number;
  }>;
}

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(`${API_URL}/events`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function fetchCompletedCount(): Promise<number> {
  const res = await fetch(`${API_URL}/events/count/completed`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch completed count");
  const data = await res.json();
  return data.count ?? 0;
}

export async function fetchEvent(id: string): Promise<Event> {
  const res = await fetch(`${API_URL}/events/${id}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Event not found");
    throw new Error("Failed to fetch event");
  }
  return res.json();
}