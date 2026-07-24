// auto-redirect.js
// Shared single-sign-on helper for all course login.html pages.
// Include this AFTER firebase-config.js and BEFORE the page's own <script> block:
//   <script src="../auto-redirect.js"></script>
//
// It checks whether the student is already signed in (e.g. because they
// logged in once on the main dashboard). If so, it skips the login form
// and sends them straight to the course page.
//
// By default it redirects to "index.html" in the same folder as login.html.
// If a course's content page has a different filename, set window.COURSE_HOME
// before this script runs, e.g.:
//   <script>window.COURSE_HOME = "anger-management-course.html";</script>
//   <script src="../auto-redirect.js"></script>

(function () {
  var target = window.COURSE_HOME || "index.html";
  auth.onAuthStateChanged(function (user) {
    if (user) {
      window.location.href = target;
    }
  });
})();

// Note: pair this with a "back to dashboard" link in each login.html —
// see the HTML snippet shared alongside this file.
