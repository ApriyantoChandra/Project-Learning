const mongoose = require('mongoose')

const User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
  },
  emailDesc: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confPassword: {
    type: String,
    required: true,
  },
})

module.exports = User
