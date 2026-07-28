// ============================================================
// firebase-config.js
// Shared Firebase initialization for the
// "Emotional Intelligence for Teachers" course.
//
// >>> REPLACE the values below with YOUR real Firebase project keys <<<
// Firebase Console → Project settings → General → Your apps → SDK setup
// (Project: lifeskills-bd221, or whichever project you host this course under)
// ============================================================

const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "lifeskills-bd221.firebaseapp.com",
  projectId: "lifeskills-bd221",
  storageBucket: "lifeskills-bd221.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID"
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
