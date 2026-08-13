function Subjects() {
  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Subject Management</h1>
          <p>Manage subjects by department and semester.</p>
        </div>

        <button className="primary-btn">
          + Add Subject
        </button>
      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Code</th>
              <th>Subject</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Credits</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>CSE501</td>
              <td>Database Management System</td>
              <td>CSE</td>
              <td>5</td>
              <td>4</td>
            </tr>

            <tr>
              <td>CSE502</td>
              <td>Computer Networks</td>
              <td>CSE</td>
              <td>5</td>
              <td>4</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Subjects;