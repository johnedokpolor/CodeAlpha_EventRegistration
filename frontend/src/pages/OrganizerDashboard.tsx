import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import EventCard from "../components/events/EventCard";
import ConfirmationModal from "../components/shared/ConfirmationModal";
import { useAuth } from "../context/AuthContext";
import { eventStore } from "../lib/store";
import { Event } from "../lib/types";
import { Plus, LogIn, BarChart3 } from "lucide-react";

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [confirmEvent, setConfirmEvent] = useState<Event | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userEvents = eventStore.getEventsByOrganizer(user.id);
      setEvents(userEvents);
    }
  }, [isAuthenticated, user]);

  const handleDeleteEvent = (event: Event) => {
    setConfirmEvent(event);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (confirmEvent) {
      eventStore.deleteEvent(confirmEvent.id);
      setEvents(events.filter((e) => e.id !== confirmEvent.id));
      setConfirmOpen(false);
      setConfirmEvent(null);
    }
  };

  const totalAttendees = events.reduce((sum, e) => sum + e.attendeeCount, 0);
  const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);

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
              Please sign in as an organizer to access this dashboard
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

  if (user?.role !== "organizer") {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Organizer Access Only
            </h2>
            <p className="text-muted-foreground mb-6">
              This dashboard is for event organizers only
            </p>
            <button
              onClick={() => navigate("/attendee")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition font-medium"
            >
              View as Attendee
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
        <div className="flex justify-between items-start md:items-center mb-12 flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Event Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage and create your events
            </p>
          </div>
          <button
            onClick={() => navigate("/create-event")}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create New Event
          </button>
        </div>

        {/* Stats */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">Total Events</p>
              <p className="text-3xl font-bold text-primary">{events.length}</p>
            </div>
            <div className="bg-white border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">
                Total Attendees
              </p>
              <p className="text-3xl font-bold text-primary">
                {totalAttendees}
              </p>
            </div>
            <div className="bg-white border border-border rounded-lg p-6">
              <p className="text-muted-foreground text-sm mb-2">
                Total Capacity
              </p>
              <p className="text-3xl font-bold text-primary">{totalCapacity}</p>
            </div>
          </div>
        )}

        {/* Events List */}
        <div>
          {events.length === 0 ? (
            <div className="text-center py-16 bg-secondary border-2 border-dashed border-border rounded-lg">
              <Plus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No Events Yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Create your first event to get started
              </p>
              <button
                onClick={() => navigate("/create-event")}
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Create First Event
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Your Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isOrganizerView={true}
                    showActions={true}
                    onRemove={() => handleDeleteEvent(event)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmOpen}
        title="Delete Event?"
        message={`Are you sure you want to delete "${confirmEvent?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setConfirmEvent(null);
        }}
        confirmText="Delete Event"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}
