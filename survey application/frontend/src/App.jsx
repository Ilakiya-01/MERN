import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css"; // ← Tailwind CSS import

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import SubmitSuccess from "./pages/SubmitSuccess";

// Component to conditionally render Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  // Hide Navbar on login/register pages
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideNavbar && <Navbar />}
      <main className="p-4">{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/success" element={<SubmitSuccess />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
