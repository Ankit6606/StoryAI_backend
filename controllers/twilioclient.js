import twilio from 'twilio';

function initializeTwilioClient(accountSid, authToken) {
  return twilio(accountSid, authToken);
}

let initialLang = "none";

function setInitialLang(lang) {
  initialLang = lang;
}

function getInitialLang() {
  return initialLang;
}

export default initializeTwilioClient;

export {setInitialLang, getInitialLang};
