function Students() {
  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Student Management</h1>
          <p>Manage all college students.</p>
        </div>

        <button className="primary-btn">
          + Add Student
        </button>
      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>ST001</td>
              <td>Rahul Kumar</td>
              <td>CSE</td>
              <td>5</td>
              <td>
                <button className="small-btn">
                  View
                </button>
              </td>
            </tr>

            <tr>
              <td>ST002</td>
              <td>Priya Singh</td>
              <td>CSE</td>
              <td>5</td>
              <td>
                <button className="small-btn">
                  View
                </button>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Students;