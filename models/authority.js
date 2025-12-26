const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const authoritySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    authorityId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    },

    mobileNumber: {
      type: String,        // ✅ FIXED
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ["student", "authority", "technician"],
      default: "authority"
    }
  },
  {
    timestamps: true      // ✅ handles createdAt & updatedAt
  }
);

/* --------- Pre-save hook (HASH PASSWORD) ---------- */
authoritySchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) {
      return ;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    

  } catch (error) {
    throw(error);
  }
});

/* --------- Compare password method ---------- */
authoritySchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Authority", authoritySchema);
