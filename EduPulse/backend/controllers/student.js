import Student from "../models/Student.js";

// =========================
// CREATE STUDENT
// POST /api/students
// =========================
export const createStudent = async (req, res) => {
  try {
    const {
      studentId,
      name,
      email,
      phone,
      gender,
      dateOfBirth,
      department,
      course,
      semester,
      admissionYear,
      address,
      status
    } = req.body;

    // Required fields
    if (
      !studentId ||
      !name ||
      !email ||
      !department ||
      !course ||
      !semester ||
      !admissionYear
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, name, email, department, course, semester and admissionYear are required"
      });
    }

    // Check duplicate student ID
    const existingStudentId = await Student.findOne({ studentId });

    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID already exists"
      });
    }

    // Check duplicate email
    const existingEmail = await Student.findOne({
      email: email.toLowerCase()
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Student email already exists"
      });
    }

    // Create student
    const student = await Student.create({
      studentId,
      name,
      email: email.toLowerCase(),
      phone,
      gender,
      dateOfBirth,
      department,
      course,
      semester,
      admissionYear,
      address,
      status
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student
    });
  } catch (error) {
    console.error("Create student error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// GET ALL STUDENTS
// GET /api/students
// =========================
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    console.error("Get students error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// GET STUDENT BY ID
// GET /api/students/:id
// =========================
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      student
    });
  } catch (error) {
    console.error("Get student error:", error.message);

    res.status(500).json({
      success: false,
      message: "Invalid student ID"
    });
  }
};


// =========================
// UPDATE STUDENT
// PUT /api/students/:id
// =========================
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Update allowed fields
    const fields = [
      "studentId",
      "name",
      "email",
      "phone",
      "gender",
      "dateOfBirth",
      "department",
      "course",
      "semester",
      "admissionYear",
      "address",
      "status"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] =
          field === "email"
            ? req.body[field].toLowerCase()
            : req.body[field];
      }
    });

    const updatedStudent = await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent
    });
  } catch (error) {
    console.error("Update student error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// =========================
// DELETE STUDENT
// DELETE /api/students/:id
// =========================
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.error("Delete student error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};