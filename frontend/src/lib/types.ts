export interface User {
  id: string;
  name: string;
  email: string;
  role: "organizer" | "attendee";
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  slug: string;
  organizerId: string;
  organizer?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  _count: {
    attendees: number;
  };
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  allEvents: Event[] | null;
  setAllEvents: (events: Event[] | null) => void;
}
