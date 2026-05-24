import { useEffect, useState } from "react";
import { Event, FormEvent } from "../../lib/types";

interface EventFormProps {
  event?: Event;
  onSubmit: (data: FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EventForm({
  event,
  onSubmit,
  onCancel,
  isLoading = false,
}: EventFormProps) {
  console.log(event);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date.split("T")[0],
        location: event.location,
        capacity: event.capacity,
      });
    }
  }, [event]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.title && !formData.title.trim())
      newErrors.title = "Event title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location) newErrors.location = "Location is required";

    if (formData.capacity < 1)
      newErrors.capacity = "Capacity must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  console.log("formdata", formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      ...formData,
      capacity: Number(formData.capacity),
      date: new Date(formData.date).toISOString(),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Event Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.title ? "border-destructive" : "border-border"
            }`}
          />
          {errors.title && (
            <p className="text-destructive text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your event"
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
              errors.description ? "border-destructive" : "border-border"
            }`}
          />
          {errors.description && (
            <p className="text-destructive text-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.date ? "border-destructive" : "border-border"
              }`}
            />
            {errors.date && (
              <p className="text-destructive text-sm mt-1">{errors.date}</p>
            )}
          </div>
        </div>

        {/* Capacity and Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.capacity ? "border-destructive" : "border-border"
              }`}
            />
            {errors.capacity && (
              <p className="text-destructive text-sm mt-1">{errors.capacity}</p>
            )}
          </div>
        </div>
        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.location ? "border-destructive" : "border-border"
              }`}
            />
            {errors.location && (
              <p className="text-destructive text-sm mt-1">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-2  text-foreground bg-secondary border hover:bg-secondary/80 rounded-lg transition font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 whitespace-nowrap py-2 border bg-primary hover:opacity-90 rounded-lg transition font-medium disabled:opacity-50"
          >
            {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
