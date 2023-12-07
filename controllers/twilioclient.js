import twilio from 'twilio';

function initializeTwilioClient(accountSid, authToken) {
  return twilio(accountSid, authToken);
}

export default initializeTwilioClient;
