import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import EventForm from "../components/events/EventForm";
import { useAuth } from "../context/AuthContext";
import { eventStore } from "../lib/store";
import { Event } from "../lib/types";
import { ArrowLeft, LogIn } from "lucide-react";

export default function CreateEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundEvent = eventStore.getEventById(id);
      setEvent(foundEvent || null);
    }
  }, [id]);

  const handleSubmit = (
    formData: Omit<
      Event,
      "id" | "createdAt" | "updatedAt" | "attendeeCount" | "organizer"
    >,
  ) => {
    setIsLoading(true);

    if (event) {
      // Update existing event
      eventStore.updateEvent(event.id, formData);
      setIsLoading(false);
      navigate("/organizer");
    } else {
      // Create new event
      const newEvent = eventStore.createEvent({
        ...formData,
        organizerId: user?.id || "",
      });
      setIsLoading(false);
      navigate("/organizer");
    }
  };

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
              Please sign in as an organizer to create events
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
            <LogIn className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Organizer Access Only
            </h2>
            <p className="text-muted-foreground mb-6">
              Only organizers can create events
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
        {/* Back Button */}
        <button
          onClick={() => navigate("/organizer")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition font-medium mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {event ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="text-muted-foreground">
            {event
              ? "Update your event details"
              : "Fill in the details to create a new event"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-border rounded-lg p-6 md:p-8">
          <EventForm
            event={event || undefined}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/organizer")}
            isLoading={isLoading}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
