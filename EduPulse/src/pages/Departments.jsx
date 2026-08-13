function Departments() {
  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Department Management</h1>
          <p>Manage college departments.</p>
        </div>

        <button className="primary-btn">
          + Add Department
        </button>
      </div>

      <div className="simple-grid">

        <div className="management-card">
          <h2>CSE</h2>
          <p>Computer Science & Engineering</p>
          <button className="small-btn">Manage</button>
        </div>

        <div className="management-card">
          <h2>ECE</h2>
          <p>Electronics & Communication</p>
          <button className="small-btn">Manage</button>
        </div>

        <div className="management-card">
          <h2>ME</h2>
          <p>Mechanical Engineering</p>
          <button className="small-btn">Manage</button>
        </div>

      </div>

    </div>
  );
}

export default Departments;