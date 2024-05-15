import express from 'express';
// import cors from 'cors';
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
        userLogoutFr,
        rendertncPageFr,
        renderppPageFr,
        getOTPForPasswordFr,
        changePasswordFr,
        changePassword2Fr
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
        userLogout,
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
        rendertncPage,
        renderppPage,
        getOTPForPassword,
        changePassword,
        changePassword2
        } from '../controllers/userReq.js';

import {success,failure, selectSubscription, makepayment, manageInvoice, selectSubscriptionFr, manageInvoiceFr, cancelSubscription} from '../controllers/paymentController.js';

// import pkg from 'express/lib/response.js';
// const { render } = pkg;

const router = express.Router();


//CORS middleware for all routes
// router.use(cors({
//         origin : "*",
//         }
// ))


//Get requests
//French
router.get("/fr/publishers", renderpublishPageFr);
router.get("/fr/aiact", renderaiPageFr);
router.get("/fr/T&C", rendertncPageFr);
router.get("/fr/PrivacyPolicy", renderppPageFr);
router.get("/fr/home",rootRenderFr);
router.get("/fr/",renderlandingPageFr);
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
router.get("/logout",userLogoutFr);
router.get("/fr/passwordotp",getOTPForPasswordFr);
router.get("/fr/recoverPassword", changePasswordFr);
router.get("/fr/changePassword", changePassword2Fr);
router.get("/fr/success",success);
router.get("/fr/failure",failure);
router.get("/fr/profile",profileManageFr);
router.get("/fr/subscribe",selectSubscriptionFr);
router.get("/fr/cancelPlan",cancelSubscription);

//Post requests

router.post("/fr/home",rootPostFr);
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
router.post("/fr/webhook",manageInvoiceFr);
router.post("/fr/passwordotp", verifyEmailAndNumberFr);
router.post("/fr/recoverPassword", otpVerificationForPasswordChangeFr);
router.post("/fr/changePassword", passwordChangeFromProfileFr);


//English
router.get("/T&C", rendertncPage);
router.get("/PrivacyPolicy", renderppPage);
router.get("/home",rootRender);
router.get("/",renderlandingPage);
router.get("/authenticate",authenticateRender);
router.get("/authenticate2",authenticateRender2);
router.get("/register",registerRender);
router.get("/login",loginRender);
router.get("/logout",userLogout);
router.get("/auth/google",oauthPage);
router.get("/auth/google/story",oauthVerification);
router.get("/phonenumber",getphoneNumber);
router.get("/story",storyPage);
router.get("/scenario",renderScenario);
router.get("/emotions",renderEmotions);
router.get("/values",renderValues);
router.get("/storyhistory", rendershp);
router.get("/storyoutput",showStories);
//recoverpass1 -moy
router.get("/passwordotp",getOTPForPassword);
//recoverpass2 -moy
router.get("/recoverPassword", changePassword);
//changepass -moy
router.get("/changePassword", changePassword2);

// router.get("/storyoutput",getStoryOutput);
router.get("/success",success);
router.get("/failure",failure);
router.get("/profile",profileManage);
router.get("/subscribe",selectSubscription);
router.get("/cancelPlan",cancelSubscription);

//Post requests

router.post("/home",rootPost);
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
router.post("/passwordotp", verifyEmailAndNumber);
router.post("/recoverPassword", otpVerificationForPasswordChange);
router.post("/changePassword", passwordChangeFromProfile);

export { router as userApp };