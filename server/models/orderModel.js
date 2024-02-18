orderModel
const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
admin: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
deliveryDate: {
type: Date,
required: [true, 'An order must have a delivery date.'],
},
closingDate: {
type: Date,
required: [true, 'An order must have a closing date.'],
},
closingTime: {
type: Time,
required: [true, 'An order must have a closing time.'],
},
paymentDeadline: {
type: Date,
required: [true, 'An order must have a payment deadline.'],
},
paymentDeadlineTime: {
type: Time,
required: [true, 'An order must have a closing time.'],
},
paymentDetails: {
type: String,
},
});

orderSchema.pre(/^find/, function (next) {
this.populate({
path: 'admin',
select: 'username',
});
next();
});

