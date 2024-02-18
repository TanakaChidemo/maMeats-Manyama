

const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
firstName: {
type: String,
required: [true, 'Your first name is required.']
},
lastName: {
type: String
},
Username: {
type: String,
required: [true, 'Your username is required.']
},
phoneNumber: {
type: Number,
required: [true, 'Your phone number is required.'],
unique: [true, 'This phone number is already registered with another user.']
},
role: {
type: String,
enum: ['admin', 'user'],
default: 'user',
},
password: {
type: String,
required: [true, 'Please proved a password.'],
minlength: 8,
select: false,
},
passwordConfirm: {
type: String,
required: [true, 'Please confirm your password.'],
validate: {
validator: function (el) {
return el === this.password;
},
message: 'The entered passwords are not the same.',
},
},
passwordChangedAt: Date,
passwordResetToken: String,
passwordResetExpires: Date,
active: {
type: Boolean,
default: true,
select: false,
},
createdAt: {
type: Date,
default: Date.now(),
},
});

userSchema.plugin(uniqueValidator);

userSchema.pre('save', async function (next) {
if (!this.isModified('password') || this.isNew) return next();
this.password = await bcrypt.hash(this.password, 12);
this.passwordConfirm = undefined;
next();
});

userSchema.pre('save', function (next) {
if (!this.isModified('password') || this.isNew) return next();
 this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
 this.find({ active: { $ne: false } });
next();
});

userSchema.methods.correctPassword = async function (
candidatePassword,
userPassword
) { return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
if (this.passwordChangedAt) {
     const changedTimestamp = parseInt(
 this.passwordChangedAt.getTime() / 1000, 10);
return JWTTimestamp < changedTimestamp;
 } return false;
};

userSchema.methods.createPasswordResetToken = function () {
const resetToken = crypto.randomBytes(32).toString('hex');
this.passwordResetToken = crypto
.createHash('sha256')
 .update(resetToken)
 .digest('hex');

 console.log({ resetToken }, this.passwordResetToken);

this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
 return resetToken;
};

const User = new mongoose.model('User', userSchema);
module.exports = User;