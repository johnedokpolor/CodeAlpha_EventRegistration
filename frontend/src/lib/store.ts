import api from "../hooks/axios-instance";
import { Event, User } from "./types";

const token = localStorage.getItem("token");
if (!token) {
  console.log("No token found");
}

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
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

  getEventsByOrganizer: async () => {
    const { data } = await api.get(`/api/events/me`, config);
    return data.data;
  },

  createEvent: async (event: Event) => {
    try {
      const { data } = await api.post("/api/events/me", event, config);
      console.log("Create event response:", data); // Debugging line
      return data.data;
    } catch (error: any) {
      console.error("Error creating event:", error.message); // Debugging line
      return error.message;
    }
  },

  updateEvent: async (id: string, updates: Event) => {
    try {
      const { data } = await api.put(`/api/events/me${id}`, updates, config);
      console.log("update event response", data);

      return data.data;
    } catch (error: any) {
      console.error("Error updating event:", error.message); // Debugging line
      return error.message;
    }
  },

  deleteEvent: async (id: string): Promise<Event> => {
    try {
      const { data } = await api.delete(`/api/events/me${id}`, config);
      console.log("delete event response", data);
      return data.data;
    } catch (error: any) {
      console.log("delete event error", error.message);
      return error.message;
    }
  },
};

// Registration Store
export const registrationStore = {
  getRegistrationsByUser: async () => {
    try {
      const { data } = await api.get(`/api/registrations/join`, config);
      console.log(data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  },

  register: async (eventId: string) => {
    try {
      const { data } = await api.post(
        `/api/registrations/join/`,
        { eventId },
        config,
      );
      console.log("Registration response:", data); // Debugging line
      return data;
    } catch (error: any) {
      console.log("Error registering for event:", error.message);
      return Promise.reject(error.response);
    }
  },

  unregister: async (eventId: string): Promise<boolean> => {
    const { data } = await api.delete(
      `/api/registrations/join/${eventId}`,
      config,
    );
    console.log(data);
    return data;
  },
};

// User Store
export const userStore = {
  getCurrentUser: async () => {
    try {
      const { data } = await api.get(`/api/auth/me`, config);
      console.log("Current user:", data); // Debugging line
      return data.user;
    } catch (error: any) {
      console.log("Error fetching current user:", error.message); // Debugging line

      return Promise.reject(error.message);
    }
  },

  register: async (
    name: string,
    email: string,
    password: string,
  ): Promise<User> => {
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      console.log(data.user);
      return data.user;
    } catch (error: any) {
      console.log("Registration error:", error.message);
      return Promise.reject(error.message);
    }
  },

  login: async (email: string, password: string) => {
    try {
      console.log("data", email, password);
      const response = await api.post("/api/auth/login", { email, password });
      console.log(response.data.user); // Debugging line

      localStorage.setItem("token", response.data.token);

      return response.data.user;
    } catch (error: any) {
      console.log("Login error:", error.message); // Debugging line
      return Promise.reject(error.message);
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("token");
  },
};
