import { Link } from "react-router-dom";
import {
  GraduationCap,
  BarChart3,
  Users,
  FileText,
} from "lucide-react";

function Home() {
  return (
    <div className="home">

      <section className="hero">
        <div className="hero-content">

          <span className="hero-badge">
            College Academic Analytics
          </span>

          <h1>
            Smart Result Management &
            <span> Performance Analysis</span>
          </h1>

          <p>
            EduPulse helps colleges manage student results,
            analyze academic performance, and generate meaningful
            performance insights.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="primary-btn">
              Get Started
            </Link>

            <Link to="/dashboard" className="secondary-btn">
              View Dashboard
            </Link>
          </div>

        </div>

        <div className="hero-icon">
          <GraduationCap size={180} strokeWidth={1} />
        </div>
      </section>

      <section className="features">

        <div className="section-heading">
          <h2>EduPulse Features</h2>
          <p>
            Everything required to manage and analyze college results.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <Users size={40} />
            <h3>Student Management</h3>
            <p>
              Manage student records, departments, semesters,
              and academic information.
            </p>
          </div>

          <div className="feature-card">
            <FileText size={40} />
            <h3>Result Management</h3>
            <p>
              Enter, manage, upload, and generate student results.
            </p>
          </div>

          <div className="feature-card">
            <BarChart3 size={40} />
            <h3>Performance Analysis</h3>
            <p>
              Analyze semester, subject, and overall student
              performance using charts.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;