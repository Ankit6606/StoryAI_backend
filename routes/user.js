import express from 'express';
import passport from 'passport';
import {rootRender,
        loginRender, 
        registerRender, 
        oauthPage, 
        oauthVerification,
        registerUser,
        storyPage,
        loginUser} from '../controllers/userReq.js';

const router = express.Router();


router.get("/",rootRender)
router.get("/register",registerRender);
router.get("/login",loginRender);
router.get("/auth/google",oauthPage);
router.get("/auth/google/story",oauthVerification);
router.get("/story",storyPage);

router.post("/register",registerUser);
router.post("/login",loginUser);

export { router as userApp };
