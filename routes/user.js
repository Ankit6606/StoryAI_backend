import express from 'express';
import passport from 'passport';
import {rootRender,
        loginRender, 
        registerRender, 
        oauthPage, 
        oauthVerification,
        registerUser,
        storyPage,
        loginUser,
        storyCharacters,
        storyPost,
        createStory1Post} from '../controllers/userReq.js';

const router = express.Router();


router.get("/",rootRender)
router.get("/register",registerRender);
router.get("/login",loginRender);
router.get("/auth/google",oauthPage);
router.get("/auth/google/story",oauthVerification);
router.get("/story",storyPage);
router.get("/createstory1",storyCharacters);

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/story",storyPost);
router.post("/createstory1",createStory1Post);

export { router as userApp };
