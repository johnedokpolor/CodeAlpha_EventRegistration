import { useAuth } from "../context/AuthContext";
import api from "../hooks/axios-instance";
import { Event, User, Registration } from "./types";

export const getAllEvents = async () => {
  const { data } = await api.get("/api/events");
  return data.data;
};

// Event Store
export const eventStore = {
  getAllEvents: async () => {
    const { data } = await api.get("/api/events");
    return data.data;
  },

  getEventById: async (slug: string): Promise<Event> => {
    const { data } = await api.get(`/api/events/public/${slug}`);
    return data.data;
  },

  getEventsByOrganizer: async (): Promise<Event[]> => {
    const { data } = await api.get(`/api/events/me`);
    return data.data;
  },

  createEvent: async (event: Event): Promise<Event> => {
    const { data } = await api.post("/api/events/me", event);
    return data.data;
  },

  updateEvent: async (id: string, updates: Event): Promise<Event> => {
    const { data } = await api.put(`/api/events/${id}`, updates);
    return data.data;
  },

  deleteEvent: async (id: string): Promise<Event> => {
    const { data } = await api.delete(`/api/events/${id}`);
    return data.data;
  },
};

// Registration Store
export const registrationStore = {
  getRegistrationsByUser: async (): Promise<Registration[]> => {
    const { data } = await api.get(`/api/registrations/join`);
    return data;
  },

  register: async (eventId: string): Promise<Registration> => {
    const { data } = await api.post(`/api/registrations/${eventId}`);
    return data;
  },

  unregister: async (eventId: string): Promise<boolean> => {
    const { data } = await api.delete(`/api/registrations/${eventId}`);
    return data;
  },
};

// User Store
export const userStore = {
  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get(`/api/auth/me`);
    return data;
  },

  register: async (user: User): Promise<User> => {
    const { data } = await api.post("/api/auth/register", user);
    return data.user;
  },

  login: async (email: string, password: string) => {
    try {
      console.log("data", email, password);
      const response = await api.post("/api/auth/login", { email, password });
      console.log("Login response:", response); // Debugging line

      localStorage.setItem("token", response.data.token);

      return response.data.user;
    } catch (error: any) {
      console.log("Login error:", error.response.data); // Debugging line
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("token");
  },
};
