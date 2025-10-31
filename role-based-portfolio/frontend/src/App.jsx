import { useState } from "react";
import AuthPage from "./AuthPage";
import PortfolioPage from "./PortfolioPage";

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  if (!user) return <AuthPage setUser={setUser} />;

  return <PortfolioPage user={user} handleLogout={handleLogout} />;
}
