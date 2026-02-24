const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const DiscussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  category: {
    type: String,
    enum: ['Case Discussion', 'Research', 'Treatment Protocol', 'Emergency', 'General'],
    default: 'General'
  },
  tags: [String],
  replies: [ReplySchema],
  views: { type: Number, default: 0 },
  isAnonymous: { type: Boolean, default: false },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Discussion', DiscussionSchema);