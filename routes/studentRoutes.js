const express = require("express");
const router = express.Router(); // Creating router instance
const { authenticateJWT, generateToken } = require("../jwt");
const Student = require("../models/student");
const Complaint = require("../models/complaint");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");


/*---------------- Student Registration Route ----------------------------*/
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;
    console.log(req.body);
    // Check if student with the same email already exists
    const StudentExists = await Student.findOne({ email });
    if (StudentExists) {
      return res
        .status(400)
        .json({ message: "Student with this email already exists" });
    }

    /*------- Creating new student-------*/
    const newStudent = new Student({
      name,
      email,
      password,
      mobileNumber,
    });

    const response = await newStudent.save();

    const payload = {
      message: "Student registered successfully",
      studentId: response._id,
      role: response.role
    };

    const token = generateToken(payload);
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "Student registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/*---------------- Student Login Route ----------------------------*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const payload = { message: "Login successful", studentId: student._id, role: student.role };
    const token = generateToken(payload);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful", token, name: student.name, role: student.role });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/*---------------- Protected Route Example ----------------------------*/
router.get("/dashboard", authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.studentId;
    console.log("ID:", studentId);
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Dashboard data", student });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}); 

/*---------------- Student Complaint Submission Route ----------------------------*/
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

    console.log(req.body);

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
      hostelname,
      roomnumber,
      wardenname,
      rollnumber,
      branch,
      description,
      category,
    });

    const response = await newComplaint.save();
    res.status(201).json({
        message: "Complaint submitted successfully",
        complaintId: response._id,
      });
  }
  catch (error)
   {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/*-----------Student View Their Complaints Route ------------------*/
router.get("/complaints", authenticateJWT, async (req, res) => {
  try {
    // ✅ token se student id
    const studentId = req.user.studentId;

    // ✅ sirf studentId se complaints
    const complaints = await Complaint.find({ studentId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Complaints fetched successfully",
      complaints,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

/*----------Reset Password Route---------*/
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

    res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;