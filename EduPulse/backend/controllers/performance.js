import Result from "../models/Result.js";
import Student from "../models/Student.js";

// =========================
// GET STUDENT PERFORMANCE
// GET /api/performance/student/:studentId
// =========================
export const getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Find student's results
    const results = await Result.find({
      student: studentId
    })
      .populate(
        "subject",
        "subjectId name code credits"
      )
      .sort({
        semester: 1,
        createdAt: 1
      });

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No results found for this student"
      });
    }

    // Total marks
    const totalMarks = results.reduce(
      (total, result) => total + result.marksObtained,
      0
    );

    // Maximum marks
    const totalMaxMarks = results.reduce(
      (total, result) => total + result.maxMarks,
      0
    );

    // Overall percentage
    const overallPercentage =
      totalMaxMarks > 0
        ? Number(
            ((totalMarks / totalMaxMarks) * 100).toFixed(2)
          )
        : 0;

    // Average percentage
    const averagePercentage = Number(
      (
        results.reduce(
          (total, result) => total + result.percentage,
          0
        ) / results.length
      ).toFixed(2)
    );

    // Pass/fail count
    const passedSubjects = results.filter(
      (result) => result.status === "Pass"
    ).length;

    const failedSubjects = results.filter(
      (result) => result.status === "Fail"
    ).length;

    // Highest and lowest
    const highestPercentage = Math.max(
      ...results.map((result) => result.percentage)
    );

    const lowestPercentage = Math.min(
      ...results.map((result) => result.percentage)
    );

    // Grade distribution
    const gradeDistribution = {};

    results.forEach((result) => {
      if (!gradeDistribution[result.grade]) {
        gradeDistribution[result.grade] = 0;
      }

      gradeDistribution[result.grade]++;
    });

    // Semester-wise performance
    const semesterMap = {};

    results.forEach((result) => {
      if (!semesterMap[result.semester]) {
        semesterMap[result.semester] = {
          semester: result.semester,
          totalMarks: 0,
          maxMarks: 0,
          subjects: 0
        };
      }

      semesterMap[result.semester].totalMarks +=
        result.marksObtained;

      semesterMap[result.semester].maxMarks +=
        result.maxMarks;

      semesterMap[result.semester].subjects++;
    });

    const semesterPerformance = Object.values(
      semesterMap
    ).map((semester) => ({
      ...semester,
      percentage:
        semester.maxMarks > 0
          ? Number(
              (
                (semester.totalMarks /
                  semester.maxMarks) *
                100
              ).toFixed(2)
            )
          : 0
    }));

    res.status(200).json({
      success: true,

      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        department: student.department,
        course: student.course
      },

      performance: {
        totalSubjects: results.length,
        totalMarks,
        totalMaxMarks,
        overallPercentage,
        averagePercentage,
        passedSubjects,
        failedSubjects,
        highestPercentage,
        lowestPercentage,
        passPercentage: Number(
          ((passedSubjects / results.length) * 100).toFixed(2)
        ),
        gradeDistribution,
        semesterPerformance
      },

      results
    });
  } catch (error) {
    console.error(
      "Get student performance error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};