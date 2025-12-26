const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // For password hashing

const technicianSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    // Unique technician identifier used for login (e.g., TECH001)
    email:{
        type: String,   
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,  
    },
    mobileNumber:{
        type: String,
        required: true, 
        unique: true
    },
    activeStatus:{
        type: Boolean,
        default: true   
    },
    role:{
        type: String,
        enum: ['student', 'authority', 'technician'],
        default: 'technician'
    },
    
}, { timestamps: true });


// Pre-save hook to hash password before saving
technicianSchema.pre('save', async function() {
    const technician = this;

    // Skip re-hashing if password hasn't changed
    if (!technician.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(technician.password, salt);
        technician.password = hashedpassword;
       
    } catch (error) {
        throw error;
    }
});

/*------ Method to compare entered password with hashed password----------*/
technicianSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};
module.exports = mongoose.model('Technician', technicianSchema);// Exporting the Technician model