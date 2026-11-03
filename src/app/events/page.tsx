import { fetchEvents, fetchCompletedCount } from "@/lib/api";
import { EventCard } from "./EventCard";
import Container from "@/components/Container";
import { FiCheckCircle, FiClock } from "react-icons/fi";

export const metadata = {
  title: "Upcoming Events | CivicHands",
  description: "Browse upcoming community service events in your area",
};

async function EventsPageContent() {
  const [allEvents, completedCount] = await Promise.all([
    fetchEvents(),
    fetchCompletedCount(),
  ]);
  const now = new Date();
  const upcomingEvents = allEvents.filter((e) => new Date(e.eventDate) >= now);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Using Container for consistent padding with navbar */}
      <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        </div>

        {/* Accent gradient blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <Container className="relative">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4 relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-primary before:via-accent before:to-primary/60 before:rounded-full text-base-content">
              Discover Community Events
            </h1>
            <p className="text-base md:text-lg text-base-content/70 leading-relaxed max-w-xl">
              Find meaningful volunteer opportunities near you. Every event is verified and ready for your participation.
            </p>

            {/* Stats row - 2 cards: Upcoming & Completed */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 md:gap-6 justify-start">
              {/* Upcoming Events */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-base-100/80 border border-base-300/50 hover:border-primary/30 transition-colors w-fit">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                  <FiClock className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-base-content leading-none">{upcomingEvents.length}</p>
                  <p className="text-sm text-base-content/60 leading-tight mt-0.5">Upcoming Events</p>
                </div>
              </div>

              {/* Completed Events */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-base-100/80 border border-base-300/50 hover:border-success/30 transition-colors w-fit">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 flex-shrink-0">
                  <FiCheckCircle className="w-6 h-6 text-success" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-base-content leading-none">{completedCount}</p>
                  <p className="text-sm text-base-content/60 leading-tight mt-0.5">Completed Events</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Events Grid Section */}
      <section className="pb-10 md:pb-16 lg:pb-20">
        <Container>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 md:py-20" aria-labelledby="empty-state">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 mb-4 mx-auto">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 id="empty-state" className="text-xl font-semibold text-base-content mb-2">No upcoming events</h2>
              <p className="text-base-content/60 max-w-md mx-auto">
                There are no events scheduled at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto" role="list">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export default EventsPageContent;