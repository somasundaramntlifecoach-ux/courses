// ===== Classroom Behaviour Management & De-escalation — shared app logic =====

// TODO: replace with your deployed Google Apps Script /exec URL (same pattern as your other courses)
const SHEET_LOG_URL = "https://script.google.com/macros/s/AKfycbxwDdji2zQrnUmNFyadueJZmaZKWTpjPbmbI0wz11glvuwzCI-mHshZGjcltVHEKJeHRw/exec";

function logToSheet(params){
  try{
    const url = new URL(SHEET_LOG_URL);
    Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
    const img = new Image();
    img.src = url.toString(); // CORS-safe pixel GET
  }catch(e){ console.log("Logging skipped:", e); }
}

function setLang(lang){
  localStorage.setItem('cbm_lang', lang);
  document.querySelectorAll('[data-en]').forEach(el => el.classList.toggle('hide-en', lang !== 'en'));
  document.querySelectorAll('[data-ta]').forEach(el => el.classList.toggle('hide-ta', lang !== 'ta'));
  document.querySelectorAll('.lang-toggle button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.documentElement.lang = lang;
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('cbm_lang') || 'en';
  setLang(saved);
  document.querySelectorAll('.lang-toggle button').forEach(b=>{
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });

  // reading progress bar
  const bar = document.querySelector('.progress-bar');
  if(bar){
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + '%';
    });
  }
});

// Passcode gate removed — access control now handled by Firebase auth-guard.js
// (see auth-guard.js in the course root folder)

// Quiz handling: each .quiz-q has data-answer index, .quiz-opt buttons with data-idx
function initQuiz(moduleSlug){
  document.querySelectorAll('.quiz-q').forEach((qEl, qIdx) => {
    const correctIdx = parseInt(qEl.dataset.answer, 10);
    qEl.querySelectorAll('.quiz-opt').forEach((opt, oIdx) => {
      opt.addEventListener('click', () => {
        if(qEl.dataset.answered) return;
        qEl.dataset.answered = "true";
        qEl.querySelectorAll('.quiz-opt').forEach((o,i)=>{
          if(i === correctIdx) o.classList.add('correct');
          else if(i === oIdx) o.classList.add('wrong');
        });
        logToSheet({type:'quiz', module: moduleSlug, question: qIdx+1, correct: (oIdx===correctIdx)});
      });
    });
  });
}
