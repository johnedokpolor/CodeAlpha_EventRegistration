import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SigninModal from "../auth/SigninModal";
import SignupModal from "../auth/SignupModal";
import { Menu, X, LogOut, Calendar } from "lucide-react";
import { userStore } from "../../lib/store";

export default function Navbar() {
  const { user, setUser, setIsAuthenticated, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signinOpen, setSigninOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    userStore.logout();
    navigate("/");
  };

  const handleDashboard = () => {
    if (user?.role === "ORGANIZER") {
      navigate("/organizer");
    } else {
      navigate("/attendee");
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Calendar className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground hidden sm:inline">
                EventHub
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate("/")}
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </button>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleDashboard}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Dashboard
                  </button>
                  {user?.role === "ORGANIZER" && (
                    <button
                      onClick={() => navigate("/create-event")}
                      className="bg-primary border px-4 py-2 rounded-lg hover:opacity-90 transition"
                    >
                      Create Event
                    </button>
                  )}
                  <div className="flex items-center gap-3 border-l border-border pl-6">
                    <span className="text-sm text-muted-foreground">
                      {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-secondary rounded-lg transition"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5 text-destructive" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSigninOpen(true)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setSignupOpen(true)}
                    className="bg-primary border px-4 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3">
              <button
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-foreground hover:bg-secondary rounded"
              >
                Home
              </button>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      handleDashboard();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-foreground hover:bg-secondary rounded"
                  >
                    Dashboard
                  </button>
                  {user?.role === "ORGANIZER" && (
                    <button
                      onClick={() => {
                        navigate("/create-event");
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2  rounded hover:opacity-90"
                    >
                      Create Event
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-destructive hover:bg-secondary rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSigninOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-foreground hover:bg-secondary rounded"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setSignupOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 bg-primary rounded hover:opacity-90"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <SigninModal isOpen={signinOpen} onClose={() => setSigninOpen(false)} />
      <SignupModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} />
    </>
  );
}
