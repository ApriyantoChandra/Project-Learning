require('dotenv').config({ path: './.env' })

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')

const methodOverride = require('method-override')
const multer = require('multer')

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
const { get } = require('mongoose')

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

app.get('/createAccount', (req, res) => {
  res.render('createacc', {
    title: 'W-Learning',
    layout: 'createacc',
    style: 'css/styleCreateAcc.css',
  })
})

app.post('/createAccount', (req, res) => {})

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

app.post(
  '/home',
  [
    body('classCode').custom(async (value) => {
      const duplicateClass = await Class.findOne({ classCode: value })
      if (duplicateClass) {
        throw new Error('Class sudah ada!')
      }
      return true
    }),
    // Validasi code
    check('classCode', 'Code harus dengan angka').isInt(),
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

app.get('/assignment', (req, res) => {
  res.render('assignment', {
    title: 'Assignment',
    layout: 'assignment',
    style: 'css/styleAssignment',
    script: 'js/scriptAssignment',
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${process.env.PORT || 9000}`)
})
