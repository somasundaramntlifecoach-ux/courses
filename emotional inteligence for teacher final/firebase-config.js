// ============================================================
// FIREBASE CONFIG — fill this in ONCE from your Firebase console
// Firebase Console → Project Settings → General → Your apps → SDK setup
// This same file is reused across ALL your courses (not just Positive Discipline)
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
