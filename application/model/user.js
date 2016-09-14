var mongoose = require("mongoose");
var crypto = require("crypto");
const secretKey = "@secret@123";

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  salt: String,
  date_create: {type:Date, default: Date.now}
});

userSchema.methods.generateSalt = function(){
  return crypto.randomBytes(16).toString('hex');
}

userSchema.methods.generateHash = function(password,salt) {
  return crypto.createHmac('sha256', secretKey)
                   .update(password+salt)
                   .digest('hex');
}

userSchema.methods.validPassword = function(password) {
  return this.password==this.generateHash(password,this.salt);
}

var User = mongoose.model('User',userSchema);

module.exports = User;
