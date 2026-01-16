// Mock Firebase objects
export const db = { type: 'firestore' };
export const auth = { type: 'auth' };
export const storage = { type: 'storage' };
export const currentUser = { uid: 'test-user', displayName: 'Test User', email: 'test@example.com' };

// Mock Firestore functions
export const collection = jest.fn(() => 'collection_ref');
export const doc = jest.fn(() => 'doc_ref');
export const addDoc = jest.fn(() => Promise.resolve({ id: 'new_doc_id' }));
export const getDoc = jest.fn(() => Promise.resolve({
    exists: () => true,
    id: 'doc_id',
    data: () => ({ title: 'Test Post' })
}));
export const updateDoc = jest.fn(() => Promise.resolve());
export const deleteDoc = jest.fn(() => Promise.resolve());
export const setDoc = jest.fn(() => Promise.resolve());
export const query = jest.fn(() => 'query_ref');
export const orderBy = jest.fn(() => 'order_by');
export const limit = jest.fn(() => 'limit');
export const where = jest.fn(() => 'where');
export const onSnapshot = jest.fn((q, callback) => {
    // Simulate initial snapshot
    callback({
        docChanges: () => [],
        docs: []
    });
    return jest.fn(); // Unsubscribe function
});
export const serverTimestamp = jest.fn(() => 'timestamp');

// Mock Storage functions
export const ref = jest.fn(() => 'storage_ref');
export const uploadBytes = jest.fn(() => Promise.resolve());
export const getDownloadURL = jest.fn(() => Promise.resolve('https://example.com/image.jpg'));

// Mock Auth functions
export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const updateProfile = jest.fn();

// Mock custom functions
export const requestNotificationPermission = jest.fn();
