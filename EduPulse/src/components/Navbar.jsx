import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          <GraduationCap size={30} />
          <span>EduPulse</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/students">Students</Link>
          <Link to="/results">Results</Link>
          <Link to="/performance">Performance</Link>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;