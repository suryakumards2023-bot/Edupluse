function Performance() {
  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Student Performance Analysis</h1>
          <p>
            Analyze academic performance across semesters and subjects.
          </p>
        </div>
      </div>

      <div className="performance-summary">

        <div className="summary-card">
          <p>Average Percentage</p>
          <h2>82.5%</h2>
        </div>

        <div className="summary-card">
          <p>CGPA</p>
          <h2>8.35</h2>
        </div>

        <div className="summary-card">
          <p>Passed Subjects</p>
          <h2>29</h2>
        </div>

        <div className="summary-card">
          <p>Failed Subjects</p>
          <h2>1</h2>
        </div>

      </div>

      <div className="chart-placeholder">
        <h2>Semester Performance</h2>

        <p>
          Recharts graph will be added after connecting the result
          database.
        </p>
      </div>

    </div>
  );
}

export default Performance;