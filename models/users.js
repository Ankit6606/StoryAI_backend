import mongoose from 'mongoose';
import session from 'express-session';
import passportLocalMongoose from 'passport-local-mongoose';
import passport  from 'passport';
import findOrCreate from 'mongoose-findorcreate';

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String,
    name: String,
    phoneNumber: String
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'username' });
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User",userSchema);

export default User;
export {passport};
