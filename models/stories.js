import {mongoose, Schema} from 'mongoose';

const storySchema = new mongoose.Schema({
    userId : String,
    title : String,
    story: String,
    thumb_img_path : String,
    audiopath : String,
});

const Story = new mongoose.model('Story',storySchema);

export default Story;