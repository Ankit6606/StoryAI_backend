import mongoose from 'mongoose';

async function connectDatabase(url){
    return mongoose.connect(url);
};

export {connectDatabase};