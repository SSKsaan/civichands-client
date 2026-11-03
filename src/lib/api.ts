const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
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