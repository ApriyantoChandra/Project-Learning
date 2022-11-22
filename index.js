require('dotenv').config({ path: './.env' })

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')

const methodOverride = require('method-override')
// const multer = require('multer')

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const { body, validationResult, check } = require('express-validator')

const app = express()
const port = 9000

// Set Database
require('./utils/db')

// Masukin Collection nya disini
const Class = require('./model/class')
// const User = require('./model/user')

// Set Multer
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'classImage')
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toString() + '-' + file.originalname)
//   },
// })

// const fileFilter = () => {
//   if (
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/jpeg'
//   ) {
//     cb(null, true)
//   } else {
//     cb(null, false)
//   }
// }

// Set Middleware
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single('classImage')
// )

app.use(expressLayouts)
app.use(cookieParser('secret'))
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)
app.use(flash())

// Route
// Halaman Index
app.get('/', (req, res) => {
  res.render('index', {
    title: 'W-Learning',
    layout: 'index',
    style: 'css/styleIndex.css',
  })
})

// POST Login Index
app.post('/', (req, res) => {})

// GET CreateAccount Page
app.get('/createAccount', (req, res) => {
  res.render('createacc', {
    title: 'W-Learning',
    layout: 'createacc',
    style: 'css/styleCreateAcc.css',
  })
})

// POST CreateAccount Page
app.post(
  '/createAccount',
  [
    body('email').custom(async (value) => {
      const duplikat = await User.findOne({ email: value })
      if (duplikat) {
        throw new Error('Username Exist')
      }
      return true
    }),
  ],
  check('email').isEmail(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('createacc', {
        title: 'Create Account',
        layout: 'createacc',
        style: 'css/styleCreateAcc.css',
        errors: errors.array(),
      })
    } else {
      User.insertMany(req.body, (error, result) => {
        req.redirect('/home')
      })
    }
  }
)

// GET Home Page
app.get('/home', async (req, res) => {
  const classes = await Class.find()

  res.render('home', {
    title: 'Home',
    layout: 'home',
    style: 'css/styleHome.css',
    script: 'js/scriptHome.js',
    msg: req.flash('msg'),
    classes,
  })
})

// POST Home Page
app.post(
  '/home',
  [
    body('classCode').isLength({ min: 4 }),
    body('classCode').custom(async (value) => {
      const duplicateClass = await Class.findOne({ classCode: value })
      if (duplicateClass) {
        throw new Error('Class sudah ada!')
      }
      return true
    }),
    // Validasi code
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty) {
      res.render('/home', {
        title: 'Home',
        layout: 'home',
        style: 'css/styleHome.css',
        script: 'js/scriptHome.js',
        errors: errors.array(),
      })
    } else {
      Class.insertMany(req.body, (error, result) => {
        if (error) {
          req.flash('msg', 'Class tidak sesuai kriteria')
        }
        res.redirect('/home')
      })
    }
  }
)

// GET Assignment Page
app.get('/assignment', (req, res) => {
  res.render('assignment', {
    title: 'Assignment',
    layout: 'assignment',
    style: 'css/styleAssignment.css',
    script: 'js/scriptAssignment.js',
  })
})

// GET Calendar Page
app.get('/calendar', (req, res) => {
  res.render('calendar', {
    title: 'Calendar',
    layout: 'calendar',
    style: 'css/styleCalendar.css',
    script: 'js/scriptCalendar.js',
  })
})

// GET Setting Page
app.get('/settings', (req, res) => {
  res.render('setting', {
    title: 'Settings',
    layout: 'setting',
    style: 'css/styleSetting.css',
    script: 'js/scriptSetting.js',
  })
})

// GET ClassName Page
app.get('/:className', async (req, res) => {
  const classes = await Class.findOne({ className: req.params.className })

  res.render('class', {
    title: req.params.className,
    style: 'css/styleClass.css',
    classCode: req.params.classCode,
    layout: 'class',
    classes,
  })
})

app.listen(process.env.PORT || 9000, () => {
  console.log("It's Worked")
})
