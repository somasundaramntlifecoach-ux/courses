// ============================================================
// AUTH GUARD — include on every page you want to protect.
// Set COURSE_ID to match the course this page belongs to.
// Requires firebase-config.js to be loaded first.
// ============================================================
const COURSE_ID = "positive-discipline-teachers"; // change per course if reused elsewhere

// If this page lives in a subfolder (e.g. modules/module-02.html), set PATH_PREFIX to "../"
// so redirects find login.html and not-enrolled.html at the course root. Leave as "" for root-level pages.
const PATH_PREFIX = "../";
const LOGIN_PATH = PATH_PREFIX + "login.html";
const NOT_ENROLLED_PATH = PATH_PREFIX + "not-enrolled.html";

(function () {
  // Hide content immediately until we confirm access, avoids flash of content
  document.documentElement.style.visibility = "hidden";

  auth.onAuthStateChanged(async function (user) {
    if (!user) {
      // Not logged in at all
      window.location.href = LOGIN_PATH;
      return;
    }

    try {
      const doc = await db.collection("students").doc(user.uid).get();
      const data = doc.exists ? doc.data() : null;
      const enrolledCourses = (data && data.courses) || [];

      if (enrolledCourses.includes(COURSE_ID)) {
        // Access granted
        document.documentElement.style.visibility = "visible";
        // Optional: show learner's name if you have a #learnerName element
        const nameEl = document.getElementById("learnerName");
        if (nameEl && data && data.name) nameEl.textContent = data.name;
      } else {
        // Logged in, but not enrolled in THIS course
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
