const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description'],
    maxlength: [5000, 'Job description cannot be more than 5000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify a job category'],
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX Design',
      'Graphic Design',
      'Content Writing',
      'Digital Marketing',
      'Data Entry',
      'Virtual Assistant',
      'Customer Service',
      'Other'
    ]
  },
  paymentType: {
    type: String,
    required: [true, 'Please specify a payment type'],
    enum: ['Fixed Price', 'Hourly Rate', 'Project Based']
  },
  budget: {
    type: Number,
    required: [true, 'Please specify a budget']
  },
  duration: {
    type: String,
    required: [true, 'Please specify an estimated duration']
  },
  skills: {
    type: [String],
    required: [true, 'Please specify required skills']
  },
  employer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  applicants: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      proposal: String,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
      appliedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  hiredFreelancer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  escrowFunded: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for search functionality
JobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', JobSchema);
