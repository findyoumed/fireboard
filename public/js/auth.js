import { auth, db, currentUser } from './firebase-init.js';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { requestNotificationPermission } from './firebase-init.js';

// Register new user
export async function register(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile
    await updateProfile(user, { displayName });
    
    // Get FCM token
    const fcmToken = await requestNotificationPermission();
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL || '',
      keywords: [],
      fcmToken: fcmToken || '',
      createdAt: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}

// Login existing user
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update FCM token on login
    const fcmToken = await requestNotificationPermission();
    if (fcmToken) {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fcmToken
      }, { merge: true });
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Logout
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Check if user is authenticated
export function requireAuth() {
  if (!currentUser) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}
