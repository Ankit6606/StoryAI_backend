import {mongoose, Schema} from 'mongoose';
// import session from 'express-session';
import passportLocalMongoose from 'passport-local-mongoose';
import passport  from 'passport';
import findOrCreate from 'mongoose-findorcreate';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
    _id:{
        type: String,
        default: uuidv4,
    },
    username: String,
    password: String,
    googleId: String,
    name: String,
    phoneNumber: String,
    authType : String,
    paymentdetails: [{type:Schema.Types.ObjectId, ref : 'Payment'}],
    stories : [{type:Schema.Types.ObjectId, ref : 'Story'}],
    gems: { type: Number, default: 1 }, // Default value for gems is set to 0
    parrots: { type: Number, default: 1 }, // Default value for parrots is set to 0
});




userSchema.plugin(passportLocalMongoose, { usernameField: 'username' });
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User",userSchema);


// const adminUser = new User({
//     username: "admin@gmail.com",
//     password: "12345678",
//     phoneNumber : "91-9876543210",
//     authType : "email",
//     gems : 100,
//     parrots: 100
// });
// adminUser.save();

export default User;
// export {Payment};
export {passport};
