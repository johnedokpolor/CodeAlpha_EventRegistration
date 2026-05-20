import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import EventCard from "../components/events/EventCard";
import EventFilters from "../components/events/EventFilters";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import { useAuth } from "../context/AuthContext";
import { eventStore, registrationStore } from "../lib/store";
import { Event } from "../lib/types";
import { LogIn } from "lucide-react";

export default function AttendeeD() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [confirmEvent, setConfirmEvent] = useState<Event | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const events = eventStore.getAllEvents();
    setAllEvents(events);

    if (isAuthenticated && user) {
      const registrations = registrationStore.getRegistrationsByUser(user.id);
      const registered = registrations
        .map((r) => eventStore.getEventById(r.eventId))
        .filter((e): e is Event => e !== undefined);
      setRegisteredEvents(registered);
    }
  }, [isAuthenticated, user]);

  const handleJoinEvent = (event: Event) => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    setConfirmEvent(event);
    setConfirmOpen(true);
  };

  const handleConfirmJoin = () => {
    if (
      user &&
      confirmEvent &&
      !registrationStore.isRegistered(user.id, confirmEvent.id)
    ) {
      registrationStore.register(user.id, confirmEvent.id);
      const updated = eventStore.getEventById(confirmEvent.id);
      if (updated) {
        setRegisteredEvents([...registeredEvents, updated]);
      }
      setConfirmOpen(false);
      setConfirmEvent(null);
    }
  };

  const handleCancelEvent = (eventId: string) => {
    if (user) {
      registrationStore.unregister(user.id, eventId);
      setRegisteredEvents(registeredEvents.filter((e) => e.id !== eventId));
    }
  };

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(allEvents.map((e) => e.category)));

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LogIn className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Sign In Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access the attendee dashboard
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition font-medium"
            >
              Go Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Discover Events
          </h1>
          <p className="text-muted-foreground">
            Find and join the perfect events for you
          </p>
        </div>

        {/* My Events Section */}
        {registeredEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              My Registered Events ({registeredEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={true}
                  showActions={true}
                  onRemove={() => handleCancelEvent(event.id)}
                />
              ))}
            </div>
            <hr className="my-12 border-border" />
          </div>
        )}

        {/* Filters */}
        <EventFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {/* All Events */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Available Events{" "}
            {filteredEvents.length > 0 && `(${filteredEvents.length})`}
          </h2>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-secondary border border-border rounded-lg">
              <p className="text-muted-foreground text-lg">No events found</p>
              <p className="text-muted-foreground text-sm mt-2">
                Try adjusting your search or category filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const isRegistered = registeredEvents.some(
                  (e) => e.id === event.id,
                );
                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRegistered={isRegistered}
                    showActions={true}
                    onJoin={() => handleJoinEvent(event)}
                    onRemove={() => handleCancelEvent(event.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmOpen}
        title="Join Event?"
        message={`Are you sure you want to join "${confirmEvent?.title}"?`}
        onConfirm={handleConfirmJoin}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmEvent(null);
        }}
        confirmText="Join Event"
        cancelText="Cancel"
      />
    </div>
  );
}
