import mongoose from 'mongoose';

async function connectDatabase(url){
    return mongoose.connect(url);
};

export {connectDatabase};

// <!-- <a href="/scenario" style="text-decoration: none;"><div class="next-button">Next Scenerio</div></a> -->