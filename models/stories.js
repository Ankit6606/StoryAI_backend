import {mongoose, Schema} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const storySchema = new mongoose.Schema({
    userId : String,
    title : String,
    story: String,
    thumb_img_path : String,
    audiopath : String,
});

const Story = new mongoose.model('Story',storySchema);

export default Story;