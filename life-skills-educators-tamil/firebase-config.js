// ============================================================
// FIREBASE CONFIG — shared across ALL courses (Firebase project: lifeskills-bd221)
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyABtQjYCN-os9t_pqo8Siqfjod-RSO9kzA",
  authDomain: "lifeskills-bd221.firebaseapp.com",
  projectId: "lifeskills-bd221",
  storageBucket: "lifeskills-bd221.firebasestorage.app",
  messagingSenderId: "180809708949",
  appId: "1:180809708949:web:5ca1542bb7a51ba5cc329c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Unique course id for THIS course — stored in students/{uid}.courses array on enrollment
const COURSE_ID = "life-skills-educators-tamil";

const ADMIN_UIDS = ["EjJbYfE9XCZLrMMLKdz0jbWlJgB2", "szoi1mLsa7ZgheWYLQMxhiPAlvX2"];
