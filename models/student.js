const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        validate: {
            validator: function(v) {
                // ✅ FIXED: Only validate when password is modified
                if (this.isModified('password')) {
                    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$/.test(v);
                }
                return true;
            },
            message: 'Password must be at least 8 characters and contain uppercase, lowercase, number and special character'
        }
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

/*---------- Pre-save hook to hash password ----------*/
studentSchema.pre('save', async function() {
    const student = this;

    // ❌ Don't hash again if not modified
    if (!student.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(student.password, salt);
    } catch (error) {
        throw error;
    }
});

/*---------- Compare password ----------*/
studentSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;