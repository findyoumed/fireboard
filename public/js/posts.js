import { db, storage, currentUser } from './firebase-init.js';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  where
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Subscribe to posts with real-time updates
export function subscribeToPosts(callback) {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const data = { id: change.doc.id, ...change.doc.data() };
      callback(change.type, data);
    });
  });
}

// Get single post
export async function getPost(postId) {
  const docRef = doc(db, 'posts', postId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  throw new Error('Post not found');
}

// Create new post
export async function createPost(postData, imageFiles) {
  if (!currentUser) throw new Error('Not authenticated');

  const imageUrls = [];

  // Upload images
  for (const file of imageFiles) {
    const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    imageUrls.push(url);
  }

  // Extract keywords from title
  const keywords = extractKeywords(postData.title);

  const post = {
    title: postData.title,
    content: postData.content,
    price: parseInt(postData.price) || 0,
    category: postData.category || '기타',
    images: imageUrls,
    author: {
      uid: currentUser.uid,
      name: currentUser.displayName || currentUser.email,
      photoURL: currentUser.photoURL || ''
    },
    status: '판매중',
    keywords,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, 'posts'), post);
  return docRef.id;
}

// Update post
export async function updatePost(postId, updates) {
  if (!currentUser) throw new Error('Not authenticated');

  const docRef = doc(db, 'posts', postId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

// Delete post
export async function deletePost(postId) {
  if (!currentUser) throw new Error('Not authenticated');

  const docRef = doc(db, 'posts', postId);
  await deleteDoc(docRef);
}

// Search posts by keyword
export function searchPosts(keyword, callback) {
  const q = query(
    collection(db, 'posts'),
    where('keywords', 'array-contains', keyword.toLowerCase())
  );

  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(posts);
  });
}

// Extract keywords from text
function extractKeywords(text) {
  const keywords = text.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 1)
    .slice(0, 10);  // Limit to 10 keywords
  return [...new Set(keywords)];  // Remove duplicates
}

// Format price
export function formatPrice(price) {
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
}

// Format timestamp
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // Less than 1 minute
  if (diff < 60000) return '방금 전';
  // Less than 1 hour
  if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
  // Less than 24 hours
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
  // Less than 7 days
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}일 전`;

  return date.toLocaleDateString('ko-KR');
}

// --- Comment System ---

// Get comments for a post
export async function getComments(postId) {
  const q = query(
    collection(db, 'posts', postId, 'comments'),
    orderBy('createdAt', 'asc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add a comment
export async function addComment(postId, content) {
  if (!currentUser) throw new Error('Not authenticated');

  const comment = {
    content,
    author: {
      uid: currentUser.uid,
      name: currentUser.displayName || currentUser.email,
      photoURL: currentUser.photoURL || ''
    },
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), comment);
  return { id: docRef.id, ...comment };
}

// Delete a comment
export async function deleteComment(postId, commentId) {
  if (!currentUser) throw new Error('Not authenticated');

  // Note: In a real app, you should verify ownership on server side (Security Rules)
  // Here we just delete it from client side
  const docRef = doc(db, 'posts', postId, 'comments', commentId);
  await deleteDoc(docRef);
}
