import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import SignupModal from "../auth/SignupModal";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [signupOpen, setSignupOpen] = useState(false);

  const handleCTA = () => {
    if (isAuthenticated) {
      if (user?.role === "organizer") {
        navigate("/create-event");
      } else {
        navigate("/attendee");
      }
    } else {
      setSignupOpen(true);
    }
  };

  return (
    <>
      <section className="bg-linear-to-b from-primary/5 to-transparent py-16 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  The future of event management
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Discover & Create Amazing Events
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Connect with thousands of attendees, organize unforgettable
                experiences, and grow your event business with EventHub.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCTA}
                  className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/attendee")}
                  className="flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/5 transition font-medium"
                >
                  Browse Events
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    10K+
                  </div>
                  <p className="text-sm text-muted-foreground">Active Events</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    50K+
                  </div>
                  <p className="text-sm text-muted-foreground">Attendees</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    500+
                  </div>
                  <p className="text-sm text-muted-foreground">Organizers</p>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/20">
                  <div className="space-y-4">
                    <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <div className="text-4xl font-bold text-primary mb-2">
                          📅
                        </div>
                        <p className="text-sm">Featured Event Visuals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SignupModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} />
    </>
  );
}
