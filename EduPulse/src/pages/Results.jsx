function Results() {
  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Result Management</h1>
          <p>Manage student academic results.</p>
        </div>

        <button className="primary-btn">
          + Add Result
        </button>
      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Total Marks</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Rahul Kumar</td>
              <td>DBMS</td>
              <td>84</td>
              <td>A</td>
              <td className="pass">Pass</td>
            </tr>

            <tr>
              <td>Priya Singh</td>
              <td>DBMS</td>
              <td>91</td>
              <td>A+</td>
              <td className="pass">Pass</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Results;