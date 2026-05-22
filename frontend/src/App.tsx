import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import AttendeeD from "./pages/AttendeeD";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/event/:slug" element={<EventDetails />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/attendee" element={<AttendeeD />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:slug" element={<CreateEvent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
