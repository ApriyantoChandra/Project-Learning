const mongoose = require('mongoose')

const Class = mongoose.model('Class', {
  classImg: {
    contentType: String,
    data: Buffer,
  },
  className: {
    type: String,
    required: true,
  },
  classDesc: {
    type: String,
  },
  classCode: {
    type: Number,
    required: true,
  },
})

module.exports = Class
