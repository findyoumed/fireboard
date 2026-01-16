import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js';
import { firebaseConfig, vapidKey } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Messaging (FCM) - with error handling
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (err) {
  console.warn('FCM not supported in this environment:', err);
}
export { messaging };

// Current user state
export let currentUser = null;

// Auth state listener
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  updateAuthUI(user);
});

// Update UI based on auth state
function updateAuthUI(user) {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  
  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (userInfo) userInfo.textContent = user.displayName || user.email;
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userInfo) userInfo.textContent = '';
  }
}

// Request FCM permission and get token
export async function requestNotificationPermission() {
  if (!messaging) {
    console.warn('Messaging not available');
    return null;
  }
  if (!vapidKey) {
    console.warn('FCM VAPID key missing; skipping token request.');
    return null;
  }
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (err) {
    console.error('FCM token error:', err);
  }
  return null;
}

// Listen for foreground messages
if (messaging) {
  onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    const { title, body } = payload.notification;
    new Notification(title, { body });
  });
}
