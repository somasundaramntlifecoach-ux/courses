// ============================================================
// auth-guard.js
// Include on every page that should be locked to enrolled students.
// Requires firebase-config.js to be loaded first (defines auth, db,
// COURSE_ID, ADMIN_UIDS).
// ============================================================

function eiGuardCurrentFile(){
  const p = window.location.pathname.split("/").pop();
  return p || "index.html";
}

function eiGuardReveal(user){
  document.documentElement.classList.remove("auth-loading");
  const emailSlot = document.getElementById("user-email-slot");
  if(emailSlot) emailSlot.textContent = user.email || "";
  const signOutBtn = document.getElementById("sign-out-btn");
  if(signOutBtn){
    signOutBtn.style.display = "inline-flex";
    signOutBtn.addEventListener("click", function(){
      auth.signOut().then(function(){ window.location.href = "login.html"; });
    });
  }
  const adminLink = document.getElementById("admin-link");
  if(adminLink && ADMIN_UIDS.includes(user.uid)){
    adminLink.style.display = "inline";
  }
}

function eiGuardDeny(reason){
  document.documentElement.classList.remove("auth-loading");
  document.body.innerHTML =
    '<div style="max-width:480px;margin:15vh auto;text-align:center;font-family:\'Noto Sans Tamil\',\'Poppins\',sans-serif;padding:0 20px;">' +
    '<h2 style="color:#0b1f3a;">Something went wrong</h2>' +
    '<p style="color:#5b6577;">' + reason + '</p>' +
    '<a href="login.html" style="color:#0b1f3a;font-weight:700;">← Back to Login</a>' +
    '</div>';
}

auth.onAuthStateChanged(function(user){
  if(!user){
    window.location.href = "login.html?redirect=" + encodeURIComponent(eiGuardCurrentFile());
    return;
  }
  if(ADMIN_UIDS.includes(user.uid)){
    eiGuardReveal(user);
    return;
  }
  db.collection("students").doc(user.uid).get().then(function(doc){
    const courses = doc.exists ? (doc.data().courses || []) : [];
    if(courses.includes(COURSE_ID)){
      eiGuardReveal(user);
    }else{
      window.location.href = "not-enrolled.html";
    }
  }).catch(function(err){
    console.error("Enrollment check failed:", err);
    eiGuardDeny("We could not verify your enrollment right now. Please refresh, or contact support if this continues.");
  });
});
