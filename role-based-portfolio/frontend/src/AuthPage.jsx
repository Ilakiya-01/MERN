import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage({ setUser }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {showLogin ? <Login setUser={setUser} /> : <Signup setUser={setUser} />}
      <button
        onClick={() => setShowLogin(!showLogin)}
        className="mt-4 underline text-blue-600"
      >
        {showLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}
