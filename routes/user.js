import express from 'express';
// import passport from 'passport';
import {rootRenderFr,
        rootPostFr,
        authenticateRenderFr,
        authenticateRender2Fr,
        loginRenderFr, 
        registerRenderFr, 
        oauthPageFr, 
        oauthVerificationFr,
        registerUserFr,
        storyPageFr,
        loginUserFr,
        storyPostFr,
        profileManageFr,
        editProfileFr,
        renderEmotionsFr,
        renderScenarioFr,
        renderValuesFr,
        rendershpFr,
        renderlandingPageFr,
        postScenarioFr,
        postEmotionsFr,
        postValuesFr,
        showStoriesFr,
        getphoneNumberFr,
        postPhonenumberFr,
        otpVerificationFr,
        clickStoriesFr,
        
        } from '../controllers/userReqFr.js';
import {rootRender,
        rootPost,
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
        rendershp,
        renderlandingPage,
        postScenario,
        postEmotions,
        postValues,
        showStories,
        getphoneNumber,
        postPhonenumber,
        otpVerification,
        clickStories,
        
        } from '../controllers/userReq.js';

import {success,failure, selectSubscription, makepayment, manageInvoice} from '../controllers/paymentController.js';

// import pkg from 'express/lib/response.js';
// const { render } = pkg;

const router = express.Router();

//Get requests
//French
router.get("/fr/",rootRenderFr);
router.get("/fr/landingpage",renderlandingPageFr);
router.get("/fr/authenticate",authenticateRenderFr);
router.get("/fr/authenticate2",authenticateRender2Fr);
router.get("/fr/register",registerRenderFr);
router.get("/fr/login",loginRenderFr);
router.get("/fr/auth/google",oauthPageFr);
router.get("/fr/auth/google/story",oauthVerificationFr);
router.get("/fr/phonenumber",getphoneNumberFr);
router.get("/fr/story",storyPageFr);
router.get("/fr/scenario",renderScenarioFr);
router.get("/fr/emotions",renderEmotionsFr);
router.get("/fr/values",renderValuesFr);
router.get("/fr/storyhistory", rendershpFr);
router.get("/fr/storyoutput",showStoriesFr);

// router.get("/storyoutput",getStoryOutput);
router.get("/fr/success",success);
router.get("/fr/failure",failure);
router.get("/fr/profile",profileManage);
router.get("/fr/subscribe",selectSubscription);

//Post requests

router.post("/fr/",rootPostFr);
router.post("/fr/register",registerUserFr);
router.post("/fr/login",loginUserFr);
router.post("/fr/phonenumber",postPhonenumberFr);
router.post("/fr/verifyotp",otpVerificationFr);
router.post("/fr/story",storyPostFr);
router.post("/fr/scenario",postScenarioFr);
router.post("/fr/emotions",postEmotionsFr);
router.post("/fr/values",postValuesFr);
router.post("/fr/profile",editProfileFr);
router.post("/fr/subscribe",makepayment);
router.post("/fr/storyhistory",clickStoriesFr);
router.post("/fr/webhook",manageInvoice);

//English

router.get("/",rootRender);
router.get("/landingpage",renderlandingPage);
router.get("/authenticate",authenticateRender);
router.get("/authenticate2",authenticateRender2);
router.get("/register",registerRender);
router.get("/login",loginRender);
router.get("/auth/google",oauthPage);
router.get("/auth/google/story",oauthVerification);
router.get("/phonenumber",getphoneNumber);
router.get("/story",storyPage);
router.get("/scenario",renderScenario);
router.get("/emotions",renderEmotions);
router.get("/values",renderValues);
router.get("/storyhistory", rendershp);
router.get("/storyoutput",showStories);

// router.get("/storyoutput",getStoryOutput);
router.get("/success",success);
router.get("/failure",failure);
router.get("/profile",profileManage);
router.get("/subscribe",selectSubscription);

//Post requests

router.post("/",rootPost);
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/phonenumber",postPhonenumber);
router.post("/verifyotp",otpVerification);
router.post("/story",storyPost);
router.post("/scenario",postScenario);
router.post("/emotions",postEmotions);
router.post("/values",postValues);
router.post("/profile",editProfile);
router.post("/subscribe",makepayment);
router.post("/storyhistory",clickStories);
router.post("/webhook",manageInvoice);

export { router as userApp };


// MY TRY       __________________________-----------------------_______________________________------------------------------


