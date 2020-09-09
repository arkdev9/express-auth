require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const debug = require('debug')('shree-express:server')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const app = express()

// DB Setup
mongoose
  .connect(
    process.env.DB_CONECTION,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(val => console.log('Connected to DB'))
  .catch(err => {
    if (err) {
      console.log(`Fuck, didn't connect to DB: ${err}`)
    }
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Respond with error message
  res.status(err.status || 500)
  res.json({ error: res.locals.error, message: res.locals.message })
})

app.use('/peerjs', require('peer').ExpressPeerServer(srv, {
	debug: true
}))

module.exports = app
