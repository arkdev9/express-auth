const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
})

UserSchema.pre('save', function (next) {
  const user = this
  // Only hash password if it is changed
  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) throw err
    return isMatch
  })
}

module.exports = mongoose.model('User', UserSchema)

// Reference on user authentication with Mongoose
// https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1

// **Important Note**
// Mongoose middleware is not invoked on update() operations,
// so you must use a save() if you want to update user passwords.
