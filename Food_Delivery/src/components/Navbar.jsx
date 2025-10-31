import { Link, useNavigate } from "react-router-dom";
import { getToken, parseJwt } from "../utils/auth";

export default function Navbar() {
  const nav = useNavigate();
  const token = getToken();
  const user = parseJwt(token);

  function logout() {
    localStorage.removeItem("token");
    nav("/login");
  }

  return (
    <div className="container" style={{display:"flex", alignItems:"center", gap:12, paddingTop:12, paddingBottom:12}}>
      <Link to="/" className="card-title" style={{marginRight:"auto"}}>Food Delivery</Link>
      <Link to="/cart">Cart</Link>
      {token ? (
        <>
          <Link to="/orders">Orders</Link>
          <Link to="/profile">Profile</Link>
        </>
      ) : null}
      {user?.role === "owner" || user?.role === "admin" ? (
        <Link to="/owner">Owner</Link>
      ) : null}
      {!token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
}
