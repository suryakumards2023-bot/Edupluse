import Student from "../models/Student.js";
import Department from "../models/Department.js";
import Subject from "../models/Subject.js";
import Result from "../models/Result.js";

// =========================
// DASHBOARD STATISTICS
// GET /api/dashboard/stats
// =========================

export const getDashboardStats = async (req, res) => {
  try {
    // Count students
    const totalStudents = await Student.countDocuments();

    // Count departments
    const totalDepartments =
      await Department.countDocuments();

    // Count subjects
    const totalSubjects =
      await Subject.countDocuments();

    // Count results
    const totalResults =
      await Result.countDocuments();

    // Count passed results
    const passedResults =
      await Result.countDocuments({
        status: "Pass"
      });

    // Count failed results
    const failedResults =
      await Result.countDocuments({
        status: "Fail"
      });

    // Calculate average percentage
    const resultData = await Result.find(
      {},
      "percentage"
    );

    let averagePercentage = 0;

    if (resultData.length > 0) {
      const totalPercentage =
        resultData.reduce(
          (total, result) =>
            total + result.percentage,
          0
        );

      averagePercentage = Number(
        (
          totalPercentage /
          resultData.length
        ).toFixed(2)
      );
    }

    res.status(200).json({
      success: true,

      statistics: {
        totalStudents,
        totalDepartments,
        totalSubjects,
        totalResults,
        passedResults,
        failedResults,
        averagePercentage
      }
    });
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics"
    });
  }
};


// =========================
// DEPARTMENT-WISE PERFORMANCE
// GET /api/dashboard/department-performance
// =========================

export const getDepartmentPerformance = async (req, res) => {
  try {
    const departments = await Department.find();

    const performance = [];

    for (const department of departments) {

      // Find students in this department
      const students = await Student.find({
        department: department._id
      }).select("_id");

      const studentIds = students.map(
        (student) => student._id
      );

      // Find results of those students
      const results = await Result.find({
        student: { $in: studentIds }
      }).select("percentage");

      let averagePercentage = 0;

      if (results.length > 0) {
        const totalPercentage =
          results.reduce(
            (total, result) =>
              total + result.percentage,
            0
          );

        averagePercentage = Number(
          (
            totalPercentage /
            results.length
          ).toFixed(2)
        );
      }

      performance.push({
        departmentId: department._id,
        departmentName: department.name,
        totalStudents: students.length,
        totalResults: results.length,
        averagePercentage
      });
    }

    res.status(200).json({
      success: true,
      performance
    });

  } catch (error) {
    console.error(
      "Department performance error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to load department performance"
    });
  }
};

// =========================
// SEMESTER-WISE PERFORMANCE
// GET /api/dashboard/semester-performance
// =========================

export const getSemesterPerformance = async (req, res) => {
  try {
    const results = await Result.find(
      {},
      "semester percentage"
    );

    const semesterData = {};

    // Group results by semester
    results.forEach((result) => {
      const semester = result.semester;

      if (!semesterData[semester]) {
        semesterData[semester] = {
          semester: Number(semester),
          totalPercentage: 0,
          totalResults: 0
        };
      }

      semesterData[semester].totalPercentage +=
        result.percentage;

      semesterData[semester].totalResults += 1;
    });

    // Calculate average
    const performance = Object.values(
      semesterData
    )
      .map((item) => ({
        semester: item.semester,
        totalResults: item.totalResults,
        averagePercentage: Number(
          (
            item.totalPercentage /
            item.totalResults
          ).toFixed(2)
        )
      }))
      .sort(
        (a, b) => a.semester - b.semester
      );

    res.status(200).json({
      success: true,
      performance
    });

  } catch (error) {
    console.error(
      "Semester performance error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load semester performance"
    });
  }
};

// =========================
// TOP PERFORMING STUDENTS
// GET /api/dashboard/top-students
// =========================

export const getTopStudents = async (req, res) => {
  try {
    // Get all students
    const students = await Student.find();

    const studentPerformance = [];

    for (const student of students) {
      // Find student's results
      const results = await Result.find({
        student: student._id
      }).select("percentage");

      // Skip students without results
      if (results.length === 0) {
        continue;
      }

      // Calculate average percentage
      const totalPercentage = results.reduce(
        (total, result) =>
          total + result.percentage,
        0
      );

      const averagePercentage = Number(
        (
          totalPercentage / results.length
        ).toFixed(2)
      );

      studentPerformance.push({
        studentId: student._id,
        rollNumber: student.studentId,
        name: student.name,
        email: student.email,
        totalResults: results.length,
        averagePercentage
      });
    }

    // Sort highest percentage first
    studentPerformance.sort(
      (a, b) =>
        b.averagePercentage -
        a.averagePercentage
    );

    // Return top 10 students
    const topStudents =
      studentPerformance.slice(0, 10);

    res.status(200).json({
      success: true,
      topStudents
    });

  } catch (error) {
    console.error(
      "Top students error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load top performing students"
    });
  }
};

// =========================
// PASS / FAIL DISTRIBUTION
// GET /api/dashboard/pass-fail
// =========================

export const getPassFailDistribution = async (req, res) => {
  try {
    const passedResults = await Result.countDocuments({
      status: "Pass"
    });

    const failedResults = await Result.countDocuments({
      status: "Fail"
    });

    const totalResults =
      passedResults + failedResults;

    let passPercentage = 0;
    let failPercentage = 0;

    if (totalResults > 0) {
      passPercentage = Number(
        (
          (passedResults / totalResults) *
          100
        ).toFixed(2)
      );

      failPercentage = Number(
        (
          (failedResults / totalResults) *
          100
        ).toFixed(2)
      );
    }

    res.status(200).json({
      success: true,

      distribution: {
        passed: passedResults,
        failed: failedResults,
        total: totalResults,
        passPercentage,
        failPercentage
      }
    });

  } catch (error) {
    console.error(
      "Pass fail distribution error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load pass/fail distribution"
    });
  }
};