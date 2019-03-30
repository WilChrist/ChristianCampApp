const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: {
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
  churches: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Church'
    }
  ]
}, {timestamps:true});

module.exports = mongoose.model('City', citySchema);
