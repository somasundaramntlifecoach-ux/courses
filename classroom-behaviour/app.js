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

// ===== Passcode gate (modules 2–10) =====
// Any one of these 20 codes unlocks all gated modules. Case-insensitive.
// Change/add/remove codes here — no need to touch individual module files.
const CBM_VALID_PASSCODES = [
  "CBMD2098","CBMD2526","CBMD3074","CBMD3600","CBMD3886",
  "CBMD4168","CBMD4865","CBMD5270","CBMD5409","CBMD5850",
  "CBMD6658","CBMD8068","CBMD8269","CBMD8288","CBMD8459",
  "CBMD8558","CBMD8606","CBMD8625","CBMD8768","CBMD9797"
];
const CBM_GATE_KEY = "cbm_unlocked";

function cbmCheckPasscode(input){
  const normalized = (input || "").trim().toUpperCase();
  return CBM_VALID_PASSCODES.includes(normalized);
}

function cbmUnlockGate(){
  document.body.classList.remove('gate-locked');
  const gate = document.getElementById('passGate');
  if(gate) gate.style.display = 'none';
}

function cbmSubmitGate(){
  const input = document.getElementById('gateInput');
  const err = document.getElementById('gateError');
  const val = input ? input.value : '';
  if(cbmCheckPasscode(val)){
    localStorage.setItem(CBM_GATE_KEY, '1');
    cbmUnlockGate();
  } else {
    const lang = localStorage.getItem('cbm_lang') || 'en';
    if(err) err.textContent = lang === 'en'
      ? 'Incorrect passcode. Please try again.'
      : 'தவறான குறியீடு. மீண்டும் முயற்சிக்கவும்.';
    logToSheet({type:'passcode_fail', module: document.title});
    if(input){ input.value = ''; input.focus(); }
  }
}

function initGate(){
  if(localStorage.getItem(CBM_GATE_KEY) === '1'){
    cbmUnlockGate();
    return;
  }
  document.body.classList.add('gate-locked');
  const gate = document.getElementById('passGate');
  if(gate) gate.style.display = 'flex';
  const input = document.getElementById('gateInput');
  const btn = document.getElementById('gateSubmit');
  if(btn) btn.addEventListener('click', cbmSubmitGate);
  if(input){
    input.addEventListener('keydown', (e) => { if(e.key === 'Enter') cbmSubmitGate(); });
    setTimeout(() => input.focus(), 200);
  }
}

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
