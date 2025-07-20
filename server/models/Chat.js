const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  isGroupChat: { type: Boolean, default: false },
  name: { type: String, default: '' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);