import twilio from 'twilio';

function initializeTwilioClient(accountSid, authToken) {
  return twilio(accountSid, authToken);
}

let initialLang = "none";

export default initializeTwilioClient;

export {initialLang};
