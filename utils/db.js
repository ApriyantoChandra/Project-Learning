const mongoose = require('mongoose')
mongoose.connect(
  'mongodb+srv://eddy535210009:Nathansyah221203@cluster0.ntnptln.mongodb.net/wpu?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  }
)
