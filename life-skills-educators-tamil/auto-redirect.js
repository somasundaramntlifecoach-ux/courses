// ============================================================
// auto-redirect.js
// Include on login.html AFTER firebase-config.js.
//
// Firebase Auth sessions persist across every page on this domain
// (dashboard.html, admin.html, and every course folder all share the
// same Firebase project). So if someone is already signed in — e.g.
// they logged in once from dashboard.html and then clicked through to
// this course — login.html should NOT show the form again. It should
// just send them straight to the course.
//
// Without this file, login.html always shows the email/password form,
// which looks like "it's asking for my password again" even though
// the person is already authenticated.
// ============================================================
(function () {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // Already signed in — skip the form entirely.
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || 'course-home.html';
      sessionStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectTo;
    } else {
      // Confirmed signed OUT — now it's safe to show the login form.
      if (typeof window.showLoginForm === 'function') {
        window.showLoginForm();
      }
    }
  });
})();
