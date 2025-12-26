const mongoose = require('mongoose');// Importing mongoose for MongoDB interactions
const bcrypt = require('bcrypt'); // For password hashing

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,   
        required: true,
        unique: true
    },  
    password: {
        type: String,
        required: true,
        match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

    },
    mobileNumber: {
        type: String,
        required: true, 
        unique: true
    },
    role:{
        type: String,
        enum: ['student', 'authority', 'technician'],
        default: 'student'
    }
}, { timestamps: true });

// Pre-save hook to hash password before saving
// student.js model file
studentSchema.pre('save', async function() { 
    // Yahan se 'next' hata diya hai
    const student = this;

    if (!student.isModified('password')) {
        return; // next() ki jagah sirf return
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(student.password, salt);
        student.password = hashedpassword;
        // return next() ki zaroorat nahi hai async function mein
    } catch (error) {
        throw error; // next(error) ki jagah error throw karein
    }
});

/*------ Method to compare entered password with hashed password----------*/
studentSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
};

const Student = mongoose.model('Student', studentSchema);// Creating Student model
module.exports = Student;// Exporting the Student model
