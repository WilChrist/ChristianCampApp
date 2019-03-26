const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  birthDate: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  numberOfParticipation: {
    type: Number,
    required: true
  },
  actualYearOfStudy: {
    type: Number,
    required: true
  },
  isInLastYearOfStudy: {
    type: Boolean,
    required: false,
    default:false
  },
  hasTotalyPayed: {
    type: Boolean,
    required: false,
    default:false
  },
  amountPayed: {
    type: Number,
    required: false,
    default:275.0
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  church: {
    type: Schema.Types.ObjectId,
    ref: 'Church',
    required: false
  }
});

module.exports = mongoose.model('User', userSchema);
