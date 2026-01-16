const fs = require('fs');
const path = require('path');

// Load .env file if it exists (for local development)
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8').split('\n');
    envConfig.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const configContent = `// Firebase Configuration (Auto-generated)
export const firebaseConfig = {
  apiKey: '${process.env.FIREBASE_API_KEY || ""}',
  authDomain: '${process.env.FIREBASE_AUTH_DOMAIN || ""}',
  projectId: '${process.env.FIREBASE_PROJECT_ID || ""}',
  storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET || ""}',
  messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID || ""}',
  appId: '${process.env.FIREBASE_APP_ID || ""}',
  measurementId: '${process.env.FIREBASE_MEASUREMENT_ID || ""}'
};

// FCM VAPID Key
export const vapidKey = '${process.env.FIREBASE_VAPID_KEY || ""}';
`;

const outputPath = path.resolve(__dirname, 'public/js/config.js');
fs.writeFileSync(outputPath, configContent);

console.log('Successfully generated public/js/config.js');
