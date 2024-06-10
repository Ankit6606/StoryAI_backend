import { google } from 'googleapis';
import User from '../models/users.js';
import { readFile } from 'fs/promises';

// Load the service account credentials from the JSON file
const keys = JSON.parse(await readFile(new URL('../env/story-app.json', import.meta.url))); // Adjust the path to your JSON key file

// Function to authenticate and get Google Sheets client
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  google.options({ auth: authClient });
  return google.sheets({ version: 'v4', auth: authClient });
}

export const displayAllUsers = async (req, res) => {
  try {
    if(req.isAuthenticated()){
        if(req.users.phoneNumber){
            const users = await User.find({}, 'username name phoneNumber subscriptionPlan');

            const values = users.map(user => Object.values(user.toObject()));

            const sheetsClient = await getSheetsClient();
            const spreadsheetId = '1tMVSfsGpCp9QqNjxhFOmwHIJu6VMKFGeG1wiQWomeTM';
            const range = 'Sheet1!A1';

            await sheetsClient.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'RAW',
            resource: {
                values: [
                Object.keys(users[0].toObject()), // Header row
                ...values // Data rows
                ],
            },
            });

            const htmlContent = `
            <html>
            <head>
                <meta http-equiv="refresh" content="0;URL='https://docs.google.com/spreadsheets/d/1tMVSfsGpCp9QqNjxhFOmwHIJu6VMKFGeG1wiQWomeTM/edit#gid=0'" />
            </head>
            <body>
                Redirecting...
            </body>
            </html>
        `;
            res.send(htmlContent);
        }else{
            res.redirect("/fr/phonenumber");
        }
    }
    else{
        res.redirect("/fr/authenticate2");
    }
    
  } catch (error) {
    console.error('Error writing to Google Sheet:', error);
    res.status(500).json({
      error: 'An error occurred',
    });
  }
};


