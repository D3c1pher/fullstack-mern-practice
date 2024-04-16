const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    set: (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    set: (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(),
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: 'Please enter a valid email address',
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, 
    validate: {
      validator: (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z])\.{6,}$/.test(password),
      message: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character, and be at least 6 characters long',
    },
  },
  mobileNumber:{
    type: String,
    trim: true,
    validate: {
      validator: (mobileNumber) => /^\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}$/.test(mobileNumber),
      message: 'Please enter a phone number format (e.g., 123-456-7890)',
    },
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const saltRounds = 10; 
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);