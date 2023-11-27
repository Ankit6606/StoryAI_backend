import {mongoose, Schema} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const storySchema = new mongoose.Schema({
    _id:{
        type: String,
        default: uuidv4,
    },
    title : String,
    story: String,
    thumb_img_path : String,
    backdrop_img : String,
    audiopath : String,
});

const Story = new mongoose.model('Story',storySchema);

export default Story;