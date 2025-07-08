const mongoose = require('mongoose')
const { type } = require('os')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
   
   fullname:{
    firstname: {
    type: String,
    required: true,
    minlength: [5, 'First name must be at least 5 characters long']
},
lastname: {
    type: String,
    minlength: [5, 'Last name must be at least 5 characters long']
}

},
email:{
    type: String,
    required: true,
    unique: true,
    minlength: [5 , 'Email should be 5 characters with integer required'],
},
password:{
    type: String,
    required: true,
    // unique: true,
    // minlength: 
    select:false,

},
socketId:{
    type: String,
},

})

userSchema.methods.generateAuthToken = () =>{
const token = jwt.sign({_id: this.id}, process.env.JWT_SECRET)
return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password)
    
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}


const userModel = mongoose.model('user',userSchema);
module.exports = userModel;