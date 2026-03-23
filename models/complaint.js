const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    hostelname: {
      type: String,
      required: true,
    },
    roomnumber: {
      type: String,
      required: true,
    },
    wardenname: {
      type: String,
      required: true,
    },
    rollnumber: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "assigned", "resolved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authority",
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Technician",
      default: null,
    },
    technicianname: {
      type: String,
      default: "null"
    },
    resolvedAt: {
      type: Date,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
