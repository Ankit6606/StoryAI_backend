import express from 'express';
// import passport from 'passport';
import {rootRender,
        authenticateRender,
        authenticateRender2,
        loginRender, 
        registerRender, 
        oauthPage, 
        oauthVerification,
        registerUser,
        storyPage,
        loginUser,
        storyPost,
        profileManage,
        editProfile,
        renderEmotions,
        renderScenario,
        renderValues,
        renderlandingPage,
        postScenario,
        postEmotions,
        postValues,
        getStoryOutput
        } from '../controllers/userReq.js';

import {success,failure, selectSubscription, makepayment} from '../controllers/paymentController.js';

const router = express.Router();

//Get requests

router.get("/",rootRender);
router.get("/landingpage",renderlandingPage);
router.get("/authenticate",authenticateRender);
router.get("/authenticate2",authenticateRender2);
router.get("/register",registerRender);
router.get("/login",loginRender);
router.get("/auth/google",oauthPage);
router.get("/auth/google/story",oauthVerification);
router.get("/story",storyPage);
router.get("/scenario",renderScenario);
router.get("/emotions",renderEmotions);
router.get("/values",renderValues);
router.get("/storyoutput",getStoryOutput);
router.get("/success",success);
router.get("/failure",failure);
router.get("/profile",profileManage);
router.get("/subscribe",selectSubscription);

//Post requests

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/story",storyPost);
router.post("/scenario",postScenario);
router.post("/emotions",postEmotions);
router.post("/values",postValues);
router.post("/profile",editProfile);
router.post("/subscribe",makepayment);

export { router as userApp };
