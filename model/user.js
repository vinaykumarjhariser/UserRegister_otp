const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/User', {

    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(function () {
    console.log("Connection connected Successfully");
}).catch(function () {
    console.log("Connection Fail");
})


//Schema
const UserSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required:true,
        index:{
            unique:true
        }
        
    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true
        },
        match:/^("(?:[!#-\[\]-\u{10FFFF}]|\\[\t -\u{10FFFF}])*"|[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*)@([!#-'*+\-/-9=?A-Z\^-\u{10FFFF}](?:\.?[!#-'*+\-/-9=?A-Z\^-\u{10FFFF}])*|\[[!-Z\^-\u{10FFFF}]*\])$/u


    },
    password:{
        type:String,
        required:true
        
    },
    otp:{
        type:String,
        required:true
    },

    date:{
        type:Date,
        default:Date.now
    }
});
//Model
const userApi = mongoose.model('userApi', UserSchema);
module.exports =userApi