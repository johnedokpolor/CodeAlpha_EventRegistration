import { Event } from "../../lib/types";
import EventCard from "../events/EventCard";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeaturedEventsProps {
  events: Event[] | null;
}

export default function FeaturedEvents({ events }: FeaturedEventsProps) {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start md:items-center mb-12 flex-col md:flex-row gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Event
            </h2>
            <p className="text-muted-foreground">
              Discover the most popular events happening right now
            </p>
          </div>
          <button
            onClick={() => navigate("/attendee")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition font-medium whitespace-nowrap"
          >
            View All <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {events?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No events available at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.slice(0, 6).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
