const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const churchSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true
  }
}, {timestamps:true});

module.exports = mongoose.model('Church', churchSchema);
