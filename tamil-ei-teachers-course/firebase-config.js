// ============================================================
// firebase-config.js
// Shared Firebase initialization for the
// "Emotional Intelligence for Teachers" course (Tamil).
// Firebase project: lifeskills-bd221
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

// Course + admin identifiers shared across guard/login/dashboard/admin pages.
const COURSE_ID = "emotional-intelligence-teachers";
const COURSE_TITLE = "Emotional Intelligence for Teachers";
const ADMIN_UIDS = [
  "EjJbYfE9XCZLrMMLKdz0jbWlJgB2",
  "szoi1mLsa7ZgheWYLQMxhiPAlvX2"
];
