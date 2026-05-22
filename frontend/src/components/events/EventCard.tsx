import { Event } from "../../lib/types";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  event: Event;
  onClick?: () => void;
  onJoin?: () => void;
  onRemove?: () => void;
  showActions?: boolean;
  isRegistered?: boolean;
  isOrganizerView?: boolean;
}

export default function EventCard({
  event,
  onClick,
  onJoin,
  onRemove,
  showActions = false,
  isRegistered = false,
  isOrganizerView = false,
}: EventCardProps) {
  const navigate = useNavigate();
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/event/${event.slug}`);
    }
  };

  const capacityPercentage = Math.round(
    (event._count?.attendees / event.capacity) * 100,
  );

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div
        className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop"
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3
          className="text-lg font-bold text-foreground mb-2 line-clamp-2 hover:text-primary cursor-pointer transition"
          onClick={handleCardClick}
        >
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {event._count?.attendees} / {event.capacity} attending
            </span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            {isOrganizerView ? (
              <>
                <button
                  onClick={() => navigate(`/edit-event/${event.id}`)}
                  className="flex-1 bg-secondary text-foreground py-2 rounded-lg hover:bg-primary/10 transition text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={onRemove}
                  className="flex-1 bg-destructive text-white py-2 rounded-lg hover:opacity-90 transition text-sm font-medium"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={onJoin}
                className={`flex-1 py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2 ${
                  isRegistered
                    ? "bg-secondary border text-foreground hover:bg-destructive"
                    : "bg-primary border hover:opacity-90"
                }`}
              >
                {isRegistered ? (
                  <div className="flex items-center gap-1">
                    Registered
                    <ArrowRight className="w-4 h-4" />
                  </div>
                ) : (
                  "Join Event"
                )}
              </button>
            )}
          </div>
        )}

        {!showActions && (
          <button
            onClick={handleCardClick}
            className="w-full text-primary hover:text-primary/80 transition font-medium text-sm flex items-center justify-center gap-2"
          >
            View Details <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
