import express from 'express';
// import passport from 'passport';
import {rootRender,
        authenticateRender,
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
        editProfile,
        selectSubscription,
        renderEmotions,
        renderScenario,
        renderValues,
        renderlandingPage,
        postScenario,
        postEmotions,
        postValues,
        getStoryOutput
        } from '../controllers/userReq.js';

import {renderBuyPage,success,failure, handlePayment} from '../controllers/paymentController.js';

const router = express.Router();


router.get("/",rootRender);
router.get("/landingpage",renderlandingPage);
router.get("/authenticate",authenticateRender);
router.get("/register",registerRender);
router.get("/login",loginRender);
router.get("/auth/google",oauthPage);
router.get("/auth/google/story",oauthVerification);
router.get("/story",storyPage);
router.get("/scenario",renderScenario);
router.get("/emotions",renderEmotions);
router.get("/values",renderValues);
router.get("/createstory1",storyCharacters);
router.get("/charge",renderBuyPage);
router.get("/storyoutput",getStoryOutput);

// router.get("/paymentDashboard",userPay);
router.get("/success",success);
router.get("/failure",failure);
router.get("/profile",profileManage);
router.get("/subscribe",selectSubscription);


router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/story",storyPost);
router.post("/scenario",postScenario);
router.post("/emotions",postEmotions);
router.post("/values",postValues);
router.post("/createstory1",createStory1Post);
router.post("/charge",handlePayment);
router.post("/profile",editProfile);

export { router as userApp };
