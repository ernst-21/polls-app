const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required']
  },
  voters : [{type: ObjectId, ref: 'User'}],
  answers: [{ type: String, trim: true }],
  chosenAnswer: [{ type: String }],
  modified: {type: Boolean, default: false},
  closed: {type: Boolean, default: false},
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Poll', PollSchema);
