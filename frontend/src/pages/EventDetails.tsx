import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import EventCard from "../components/events/EventCard";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import { useAuth } from "../context/AuthContext";
import { eventStore, registrationStore } from "../lib/store";
import { Event } from "../lib/types";
import { Calendar, MapPin, Users, Share2, ArrowLeft } from "lucide-react";

export default function EventDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (slug) {
      const fetchEvent = async () => {
        const foundEvent = await eventStore.getEventById(slug);
        setEvent(foundEvent || null);
      };

      const fetchRelatedEvents = async () => {
        const events = await eventStore.getAllEvents();
        setRelatedEvents(events);
      };

      // if (isAuthenticated && user && foundEvent) {
      //   setIsRegistered(registrationStore.isRegistered(user.id, id));
      // }

      fetchEvent();
      fetchRelatedEvents();
    }
  }, [slug, isAuthenticated, user]);

  const handleJoinEvent = () => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmJoin = () => {
    if (user && event && !isRegistered) {
      setIsLoading(true);
      registrationStore.register(event.id);
      // const updated = eventStore.getEventById(event.id);
      // setEvent(updated || null);
      setIsRegistered(true);
      setConfirmOpen(false);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user && event && isRegistered) {
      registrationStore.unregister(event.id);
      // const updated = eventStore.getEventById(event.id);
      // setEvent(updated || null);
      setIsRegistered(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Event not found</p>
            <button
              onClick={() => navigate("/")}
              className="text-primary hover:text-primary/80 transition font-medium flex items-center gap-2 justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const capacityPercentage = Math.round(
    (event._count?.attendees / event.capacity) * 100,
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-secondary border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="rounded-lg overflow-hidden h-80 bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div>
                <div className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1 rounded-full mb-4">
                  {event.category}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {event.title}
                </h1>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                    <span className="text-foreground">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <span className="text-foreground font-medium">Time:</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                    <span className="text-foreground">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <Users className="w-6 h-6 text-primary" />
                    <span className="text-foreground">
                      {event._count?.attendees} / {event.capacity} attending
                    </span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Capacity
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {capacityPercentage}% full
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isAuthenticated && user?.role === "attendee" ? (
                  <div className="space-y-3">
                    {isRegistered ? (
                      <>
                        <button
                          onClick={handleCancel}
                          className="w-full bg-destructive text-white px-6 py-3 rounded-lg hover:opacity-90 transition font-medium"
                        >
                          Cancel Registration
                        </button>
                        <p className="text-sm text-center text-muted-foreground">
                          You are registered for this event
                        </p>
                      </>
                    ) : (
                      <button
                        onClick={handleJoinEvent}
                        disabled={event._count?.attendees >= event.capacity}
                        className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {event._count?.attendees >= event.capacity
                          ? "Event Full"
                          : "Join Event"}
                      </button>
                    )}
                  </div>
                ) : !isAuthenticated ? (
                  <button
                    onClick={() => navigate("/")}
                    className="w-full bg-primary  px-6 py-3 rounded-lg hover:opacity-90 transition font-medium border"
                  >
                    Sign In to Join
                  </button>
                ) : null}

                <button className="w-full mt-3 flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg hover:bg-secondary transition font-medium">
                  <Share2 className="w-5 h-5" />
                  Share Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                About This Event
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>

              <div className="mt-12">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Organizer
                </h3>
                <div className="bg-secondary border border-border rounded-lg p-6">
                  <p className="text-lg font-semibold text-foreground mb-2">
                    {event.organizer?.name || "Event Organizer"}
                  </p>
                  <p className="text-muted-foreground">
                    {event.organizer?.email || "contact@organizer.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-secondary border border-border rounded-lg p-6 sticky top-20">
                <h3 className="font-bold text-foreground mb-4">
                  Event Details
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Date</p>
                    <p className="font-medium text-foreground">
                      {formatDate(event.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Time</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Location</p>
                    <p className="font-medium text-foreground">
                      {event.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Category</p>
                    <p className="font-medium text-foreground">
                      {event.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Capacity</p>
                    <p className="font-medium text-foreground">
                      {event._count?.attendees} / {event.capacity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="bg-secondary border-y border-border py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Similar Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedEvents.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmOpen}
        title="Join Event?"
        message={`Are you sure you want to join "${event.title}"?`}
        onConfirm={handleConfirmJoin}
        onCancel={() => setConfirmOpen(false)}
        confirmText="Join Event"
        cancelText="Cancel"
      />
    </div>
  );
}
