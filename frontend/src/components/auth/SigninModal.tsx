import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { userStore } from "../../lib/store";

interface SigninModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SigninModal({ isOpen, onClose }: SigninModalProps) {
  const { setUser, setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    try {
      const user = await userStore.login(email, password);
      console.log(user);

      // setEmail("");
      // setPassword("");
      // setUser(user);
      // setIsAuthenticated(true);
      // onClose();

      // Navigate to appropriate dashboard
      if (user.role === "organizer") {
        navigate("/organizer");
      } else {
        navigate("/attendee");
      }
    } catch (err) {
      setError("Sign in failed. Please try again.");
    }
  };

  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Sign In</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full border py-2 rounded-lg hover:opacity-90 transition font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
