import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC0SULAG43vAfCmloGXCEw7-JGeEbBl7Gw",
  authDomain: "edumanage-discipline.firebaseapp.com",
  projectId: "edumanage-discipline",
  storageBucket: "edumanage-discipline.firebasestorage.app",
  messagingSenderId: "171709154734",
  appId: "1:171709154734:web:a6abaeefee9256cc87b43f",
  measurementId: "G-PG408D1EZJ"
};

// Initialize Firebase
let app;
let auth;
let db;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  analytics = getAnalytics(app);
  console.log('🔥 Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// Authentication functions
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let message = "Login failed";
    switch(error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = "Invalid email or password";
        break;
      case 'auth/too-many-requests':
        message = "Too many failed attempts. Try again later";
        break;
      default:
        message = error.message;
    }
    return { success: false, error: message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Student CRUD operations
export const addStudent = async (studentData) => {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      incidents: 0
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding student:', error);
    return { success: false, error: error.message };
  }
};

export const getStudents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const students = [];
    querySnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: students };
  } catch (error) {
    console.error('Error getting students:', error);
    return { success: false, error: error.message };
  }
};

export const updateStudent = async (studentId, studentData) => {
  try {
    const studentRef = doc(db, 'students', studentId);
    await updateDoc(studentRef, {
      ...studentData,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating student:', error);
    return { success: false, error: error.message };
  }
};

export const deleteStudent = async (studentId) => {
  try {
    await deleteDoc(doc(db, 'students', studentId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting student:', error);
    return { success: false, error: error.message };
  }
};

// Incident CRUD operations
export const addIncident = async (incidentData) => {
  try {
    const docRef = await addDoc(collection(db, 'incidents'), {
      ...incidentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'open',
      replies: []
    });
    
    // Update student's incident count
    if (incidentData.studentId) {
      const studentRef = doc(db, 'students', incidentData.studentId);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        const currentIncidents = studentSnap.data().incidents || 0;
        await updateDoc(studentRef, {
          incidents: currentIncidents + 1,
          updatedAt: Timestamp.now()
        });
      }
    }
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding incident:', error);
    return { success: false, error: error.message };
  }
};

export const getIncidents = async () => {
  try {
    const q = query(collection(db, 'incidents'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const incidents = [];
    querySnapshot.forEach((doc) => {
      incidents.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: incidents };
  } catch (error) {
    console.error('Error getting incidents:', error);
    return { success: false, error: error.message };
  }
};

export const updateIncident = async (incidentId, incidentData) => {
  try {
    const incidentRef = doc(db, 'incidents', incidentId);
    await updateDoc(incidentRef, {
      ...incidentData,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating incident:', error);
    return { success: false, error: error.message };
  }
};

// Forum post CRUD operations
export const addForumPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, 'forum_posts'), {
      ...postData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      likes: 0,
      replies: [],
      isPinned: false
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding forum post:', error);
    return { success: false, error: error.message };
  }
};

export const getForumPosts = async () => {
  try {
    const q = query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: posts };
  } catch (error) {
    console.error('Error getting forum posts:', error);
    return { success: false, error: error.message };
  }
};

export { auth, db };