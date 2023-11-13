import express from 'express';
// import passport from 'passport';
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
        createStory1Post,
        profileManage,
        editProfile} from '../controllers/userReq.js';

import {renderBuyPage,payment,success,failure} from '../controllers/paymentController.js';

const router = express.Router();


router.get("/",rootRender);
router.get("/register",registerRender);
router.get("/login",loginRender);
router.get("/auth/google",oauthPage);
router.get("/auth/google/story",oauthVerification);
router.get("/story",storyPage);
router.get("/createstory1",storyCharacters);
router.get("/payment",renderBuyPage);
router.get("/success",success);
router.get("/failure",failure);
router.get("/profile",profileManage);

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/story",storyPost);
router.post("/createstory1",createStory1Post);
router.post("/payment",payment);
router.post("/profile",editProfile);

export { router as userApp };
