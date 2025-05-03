const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: false,
    default: null
  },
  passcode: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: null
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  phoneVerificationAttempts: {
    type: Number,
    default: 0
  },
  lastVerificationSent: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true,
  autoIndex: true
});

userSchema.index({ mobileNumber: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: false, sparse: true });

const User = mongoose.model('User', userSchema);

User.createIndexes()
  .then(() => console.log('User indexes created successfully'))
  .catch(err => console.error('Error creating user indexes:', err));

module.exports = User; 