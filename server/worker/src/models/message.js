const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  time: {type: String, required: false},
  priority: {type: Number, required: false},
  status: {type: String, required: true},
  content: {type: String, required: true},
  to: {type: String, required: true},
  stages: {
    type: Array,
    required: false,
  },
  is_deleted: {type: Boolean, default: false, required: true},
},
{timestamps: true},
);
module.exports = mongoose.model('messages', schema);
