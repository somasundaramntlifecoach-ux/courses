// ============================================================
// AUTH GUARD — include on every page you want to protect.
// COURSE_ID must match what you enroll students with (admin panel / Firestore).
// Requires firebase-config.js to be loaded first.
// ============================================================
const COURSE_ID = "life-skills-educators";

// This course's files are all in one flat folder (no subfolder), so no prefix needed.
const PATH_PREFIX = "";
const LOGIN_PATH = PATH_PREFIX + "login.html";
const NOT_ENROLLED_PATH = PATH_PREFIX + "not-enrolled.html";

(function () {
  document.documentElement.style.visibility = "hidden";

  auth.onAuthStateChanged(async function (user) {
    if (!user) {
      window.location.href = LOGIN_PATH;
      return;
    }

    try {
      const doc = await db.collection("students").doc(user.uid).get();
      const data = doc.exists ? doc.data() : null;
      const enrolledCourses = (data && data.courses) || [];

      if (enrolledCourses.includes(COURSE_ID)) {
        document.documentElement.style.visibility = "visible";
        const nameEl = document.getElementById("learnerNameDisplay");
        if (nameEl && data && data.name) nameEl.textContent = data.name;
      } else {
        window.location.href = NOT_ENROLLED_PATH;
      }
    } catch (err) {
      console.error("Access check failed:", err);
      window.location.href = LOGIN_PATH;
    }
  });
})();

function logout() {
  auth.signOut().then(function () {
    window.location.href = LOGIN_PATH;
  });
}
