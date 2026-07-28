// Auth + enrollment guard for gated course pages
// Include AFTER firebase-config.js on every protected page.
// Listen for the "auth-ready" event to know when it's safe to render gated content.
(function () {
  auth.onAuthStateChanged(async function (user) {
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname.split("/").pop());
      window.location.href = "login.html";
      return;
    }

    if (ADMIN_UIDS.includes(user.uid)) {
      document.dispatchEvent(new CustomEvent("auth-ready", { detail: { user: user, isAdmin: true } }));
      return;
    }

    try {
      const snap = await db.collection("students").doc(user.uid).get();
      const courses = snap.exists ? (snap.data().courses || []) : [];

      if (courses.indexOf(COURSE_ID) !== -1) {
        document.dispatchEvent(new CustomEvent("auth-ready", { detail: { user: user, isAdmin: false } }));
      } else {
        window.location.href = "not-enrolled.html";
      }
    } catch (err) {
      console.error("Enrollment check failed:", err);
      window.location.href = "not-enrolled.html";
    }
  });
})();
