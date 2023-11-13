import mongoose from 'mongoose';
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
    username: String, //email
    password: String,
    googleId: String,
    name: String,
    phoneNumber: String,
    authType : String
    // story : {
    //     storyId : String,
    //     titile : String
    // }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'username' });
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User",userSchema);

export default User;
export {passport};
