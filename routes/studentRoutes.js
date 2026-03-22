const express = require("express");
const router = express.Router();

const { authenticateJWT, generateToken } = require("../jwt");
const Student = require("../models/student");
const Complaint = require("../models/complaint");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

/*---------------- Student Registration Route ----------------------------*/
router.post("/signup", async (req, res) => {
  try {
    console.log("🔥 Signup API hit");
    const { name, email, password, mobileNumber } = req.body;

    if (!name || !email || !password || !mobileNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing student
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        message: "Student with this email already exists",
      });
    }

    // Create student
    const newStudent = new Student({
      name,
      email,
      password,
      mobileNumber,
    });

    const savedStudent = await newStudent.save();

    // Generate token
    const token = generateToken({
      studentId: savedStudent._id,
      role: savedStudent.role,
    });

    // ❌ COOKIE REMOVED (CORS issue avoid karne ke liye)
    // res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" });

    return res.status(201).json({
      message: "✅ Student registered successfully",
      token,
      studentId: savedStudent._id,
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

/*---------------- Student Login Route ----------------------------*/
router.post("/login", async (req, res) => {
  try {
    console.log("🔥 Login API hit");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken({
      studentId: student._id,
      role: student.role,
    });

    // ❌ COOKIE REMOVED
    // res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" });

    return res.status(200).json({
      message: "✅ Login successful",
      token,
      name: student.name,
      role: student.role,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

/*---------------- Protected Dashboard ----------------------------*/
router.get("/dashboard", authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({
      message: "Dashboard data",
      student,
    });
  } catch (error) {
    console.error("❌ Dashboard Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

/*---------------- Submit Complaint ----------------------------*/
router.post("/complaint", authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const {
      hostelname,
      roomnumber,
      wardenname,
      rollnumber,
      branch,
      description,
      category,
    } = req.body;

    const existingComplaint = await Complaint.findOne({
      rollnumber,
      category,
      description,
      approvalStatus: "pending",
    });

    if (existingComplaint) {
      return res.status(409).json({
        message: "Complaint already raised and pending",
      });
    }

    const newComplaint = new Complaint({
      studentId,
      hostelname,
      roomnumber,
      wardenname,
      rollnumber,
      branch,
      description,
      category,
    });

    const savedComplaint = await newComplaint.save();

    return res.status(201).json({
      message: "✅ Complaint submitted successfully",
      complaintId: savedComplaint._id,
    });
  } catch (error) {
    console.error("❌ Complaint Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

/*---------------- Get Student Complaints ----------------------------*/
router.get("/complaints", authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const complaints = await Complaint.find({ studentId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Complaints fetched successfully",
      complaints,
    });
  } catch (error) {
    console.error("❌ Fetch Complaints Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

/*---------- Reset Password Route ---------*/
router.post("/reset-password", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await verifyFirebaseToken(token);
    const studentId = decodedToken.uid;

    const { newPassword } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.password = newPassword;
    await student.save();

    return res.status(200).json({
      message: "✅ Password reset successful",
    });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;