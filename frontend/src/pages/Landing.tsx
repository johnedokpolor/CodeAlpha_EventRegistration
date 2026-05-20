import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import Hero from "../components/landing/Hero";
import FeaturedEvents from "../components/landing/FeaturedEvents";
import Testimonials from "../components/landing/Testimonials";
import CTASection from "../components/landing/CTASection";
import { eventStore, getAllEvents } from "../lib/store";
import { useEffect, useState } from "react";

export default function Landing() {
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const events = await eventStore.getAllEvents();
      setAllEvents(events);
    };
    fetchEvents();
  }, []);

  console.log("All Events:", allEvents); // Debugging log

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedEvents events={allEvents} />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
