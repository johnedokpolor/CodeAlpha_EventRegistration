import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SignupModal from "../auth/SignupModal";
import { ArrowRight, Zap } from "lucide-react";

export default function CTASection() {
  const navigate = useNavigate();
  const [signupOpen, setSignupOpen] = useState(false);

  return (
    <>
      <section className="py-16 md:py-24 bg-linear-to-r from-blue-700/30 to-blue-700/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl text-blue-500 md:text-4xl font-bold text-foreground mb-6">
                Ready to start your event journey?
              </h2>

              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of organizers and attendees. Create your first
                event or find your next adventure today.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Easy Setup
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Create an account and start organizing or discovering
                      events in minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Powerful Tools
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Everything you need to manage registrations, send updates,
                      and engage attendees
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Global Community
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Connect with passionate attendees and organizers from
                      around the world
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSignupOpen(true)}
                className="mt-8 flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:opacity-90 transition font-medium"
              >
                <Zap className="w-5 h-5" />
                Get Started Today
              </button>
            </div>

            {/* Visual */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-primary/20 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-secondary rounded w-full"></div>
                      </div>
                    </div>
                  ))}
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
