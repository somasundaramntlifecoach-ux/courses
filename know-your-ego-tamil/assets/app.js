/* ============================================================
   Know Your Ego - LMS shared logic
   ============================================================ */

const STRUCTURE = [{"id": 1, "title": "What Is Ego? Understanding the Concept", "lessons": [{"id": "m1l1", "heading": "The Two Faces of Ego: Protector and Prisoner", "file": "m1-l1.html"}, {"id": "m1l2", "heading": "Why the Ego Exists: Its Evolutionary Purpose", "file": "m1-l2.html"}]}, {"id": 2, "title": "The Three Ego States: Parent, Adult, Child", "lessons": [{"id": "m2l1", "heading": "The Parent Ego State: Rules and Judgment", "file": "m2-l1.html"}, {"id": "m2l2", "heading": "The Adult Ego State: Reason and Balance", "file": "m2-l2.html"}]}, {"id": 3, "title": "Healthy Ego vs. Inflated Ego vs. Low Self-Worth", "lessons": [{"id": "m3l1", "heading": "Recognising the Middle Ground: Healthy Ego", "file": "m3-l1.html"}, {"id": "m3l2", "heading": "The Two Extremes: Inflated Ego and Low Self-Worth", "file": "m3-l2.html"}]}, {"id": 4, "title": "Ego in Relationships", "lessons": [{"id": "m4l1", "heading": "Winning the Argument, Losing the Relationship", "file": "m4-l1.html"}]}, {"id": 5, "title": "Ego at the Workplace", "lessons": [{"id": "m5l1", "heading": "Ego and Credit: The Silent Team Killer", "file": "m5-l1.html"}]}, {"id": 6, "title": "Ego and Communication Patterns", "lessons": [{"id": "m6l1", "heading": "Listening to Respond vs. Listening to Understand", "file": "m6-l1.html"}]}, {"id": 7, "title": "Recognizing Your Ego Triggers", "lessons": [{"id": "m7l1", "heading": "Common Ego Trigger Categories", "file": "m7-l1.html"}]}, {"id": 8, "title": "Ego and Emotional Intelligence", "lessons": [{"id": "m8l1", "heading": "The Four EQ Pillars Applied to Ego", "file": "m8-l1.html"}]}, {"id": 9, "title": "Practical Techniques to Manage Your Ego", "lessons": [{"id": "m9l1", "heading": "The STOP Technique and the 24-Hour Rule", "file": "m9-l1.html"}, {"id": "m9l2", "heading": "Practicing Humility Without Losing Confidence", "file": "m9-l2.html"}]}, {"id": 10, "title": "Building an Ego-Balanced Life", "lessons": [{"id": "m10l1", "heading": "Designing Your Personal Ego-Balance Routine", "file": "m10-l1.html"}]}];

const STATE_KEY = 'egoLMS_state_v1';

function loadState(){
  try{ return JSON.parse(localStorage.getItem(STATE_KEY)) || {lessons:{}, reviews:{}, worksheets:{}, name:''}; }
  catch(e){ return {lessons:{}, reviews:{}, worksheets:{}, name:''}; }
}
function saveState(s){ localStorage.setItem(STATE_KEY, JSON.stringify(s)); }

let STATE = loadState();

function totalUnits(){
  let n = 0;
  STRUCTURE.forEach(m=>{ n += m.lessons.length + 1; }); // +1 for module review
  return n;
}
function completedUnits(){
  let n = 0;
  STRUCTURE.forEach(m=>{
    m.lessons.forEach(l=>{ if(STATE.lessons[l.id] && STATE.lessons[l.id].complete) n++; });
    if(STATE.reviews[m.id] && STATE.reviews[m.id].passed) n++;
  });
  return n;
}
function overallPct(){
  const t = totalUnits();
  return t ? Math.round((completedUnits()/t)*100) : 0;
}

/* ---------------- Sidebar ---------------- */
function buildSidebar(activeType, activeId){
  const nav = document.getElementById('sbNav');
  if(!nav) return;
  let html = '';
  STRUCTURE.forEach(m=>{
    const doneLessons = m.lessons.filter(l=>STATE.lessons[l.id] && STATE.lessons[l.id].complete).length;
    const reviewDone = STATE.reviews[m.id] && STATE.reviews[m.id].passed;
    const modDone = doneLessons === m.lessons.length && reviewDone;
    const isActiveModule = (activeType==='module' && activeId===m.id) ||
                            (activeType==='lesson' && m.lessons.some(l=>l.id===activeId)) ||
                            (activeType==='review' && activeId===m.id);
    html += `<li class="sb-mod ${modDone?'done':''} ${isActiveModule?'open active':''}" data-mod="${m.id}">
      <div class="sb-mod-head" onclick="toggleSbMod(${m.id})">
        <div class="sb-mod-num">${modDone?'&#10003;':m.id}</div>
        <div>${m.title}</div>
        <div class="chevron">&#9656;</div>
      </div>
      <ul class="sb-lessons">`;
    m.lessons.forEach((l,idx)=>{
      const done = STATE.lessons[l.id] && STATE.lessons[l.id].complete;
      const isCurrent = (activeType==='lesson' && activeId===l.id);
      html += `<li class="sb-lesson ${done?'complete':''} ${isCurrent?'current':''}">
        <span class="chk">${done?'&#10003;':''}</span>
        <a href="${l.file}" style="color:inherit;text-decoration:none;">${idx+1}. ${l.heading}</a>
      </li>`;
    });
    const isReviewCurrent = (activeType==='review' && activeId===m.id);
    html += `<li class="sb-lesson review ${reviewDone?'complete':''} ${isReviewCurrent?'current':''}">
        <span class="chk">${reviewDone?'&#10003;':''}</span>
        <a href="module-${m.id}-review.html" style="color:inherit;text-decoration:none;">&#9733; Module Review &amp; Assessment</a>
      </li>`;
    html += `</ul></li>`;
  });
  nav.innerHTML = html;
  updateOverallProgressUI();
}
function toggleSbMod(id){
  document.querySelectorAll('.sb-mod').forEach(el=>{
    if(String(el.dataset.mod) === String(id)) el.classList.toggle('open');
  });
}
function updateOverallProgressUI(){
  const pct = overallPct();
  const fill = document.getElementById('sbProgressFill');
  const pctEl = document.getElementById('sbProgressPct');
  const mini = document.getElementById('miniProgress');
  if(fill) fill.style.width = pct+'%';
  if(pctEl) pctEl.textContent = pct+'% complete \u2014 ' + completedUnits() + '/' + totalUnits() + ' items';
  if(mini) mini.textContent = pct+'% complete';
}
function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
}

/* ---------------- Lesson completion ---------------- */
function markLessonComplete(id, btn){
  STATE.lessons[id] = Object.assign({}, STATE.lessons[id], {complete:true});
  saveState(STATE);
  if(btn){ btn.textContent = '\u2713 Lesson Complete'; btn.classList.add('btn-done'); btn.classList.remove('btn-primary'); btn.disabled = true; }
  updateOverallProgressUI();
  document.querySelectorAll('.sb-lesson').forEach(el=>{}); // no-op, rebuilt on next load
  const navEl = document.getElementById('sbNav');
  if(navEl){ /* re-render sidebar to reflect check */ }
}
function isLessonComplete(id){ return !!(STATE.lessons[id] && STATE.lessons[id].complete); }

/* ---------------- Worksheet (live autosave) ---------------- */
function initWorksheet(key){
  const ta = document.getElementById('wsText');
  const tag = document.getElementById('wsSaved');
  const wc = document.getElementById('wsCount');
  if(!ta) return;
  ta.value = (STATE.worksheets[key]) || '';
  updateWc();
  let t;
  ta.addEventListener('input', function(){
    updateWc();
    clearTimeout(t);
    t = setTimeout(()=>{
      STATE.worksheets[key] = ta.value;
      saveState(STATE);
      if(tag){ tag.classList.add('show'); setTimeout(()=>tag.classList.remove('show'), 1400); }
    }, 400);
  });
  function updateWc(){
    if(wc){ const words = ta.value.trim().length ? ta.value.trim().split(/\s+/).length : 0; wc.textContent = words + ' words'; }
  }
}

/* ---------------- Quiz engine ---------------- */
/* questions: [{q, options:[...], correct: idx, explain}] */
function initQuiz(containerId, questions, opts){
  opts = opts || {};
  const key = opts.key;              // storage key, e.g. 'm1l1' or 'review-1'
  const kind = opts.kind || 'lesson'; // 'lesson' or 'review'
  const moduleId = opts.moduleId;
  const lessonId = opts.lessonId;
  const box = document.getElementById(containerId);
  if(!box) return;
  const answers = new Array(questions.length).fill(null);

  let html = '';
  questions.forEach((item, qi)=>{
    html += `<div class="quiz-q" id="qq-${qi}">
      <div class="qtitle">${qi+1}. ${item.q}</div>`;
    item.options.forEach((opt, oi)=>{
      html += `<div class="quiz-opt" data-q="${qi}" data-o="${oi}" onclick="selectQuizOpt(this,${qi},${oi})">
        <div class="radio"></div><div>${opt}</div>
      </div>`;
    });
    html += `<div class="quiz-feedback" id="qf-${qi}"></div></div>`;
  });
  box.innerHTML = html;

  window['__quiz_' + containerId] = { questions, answers, key, kind, moduleId, lessonId, containerId };

  const submitBtn = document.getElementById(containerId + '-submit');
  if(submitBtn){ submitBtn.onclick = function(){ submitQuiz(containerId); }; }

  // restore previous attempt if present
  const prevKey = kind === 'review' ? ('review-' + key) : ('lesson-' + key);
  const prev = STATE.lessons[prevKey] || STATE.reviews[prevKey];
}

function selectQuizOpt(el, qi, oi){
  const containerId = el.closest('[id^="quizbox"]') ? el.closest('[id^="quizbox"]').id : el.parentElement.parentElement.dataset.container;
  // find owning quiz object by scanning window keys (simplest: use data attribute on container)
  const box = el.closest('.quiz-box') || el.closest('[data-quiz]');
  let qObjKey = null;
  Object.keys(window).forEach(k=>{
    if(k.indexOf('__quiz_') === 0){
      const obj = window[k];
      if(document.getElementById(obj.containerId) && document.getElementById(obj.containerId).contains(el)){
        qObjKey = k;
      }
    }
  });
  if(!qObjKey) return;
  const quiz = window[qObjKey];
  if(quiz.answers[qi] !== null) return; // already answered, lock it
  quiz.answers[qi] = oi;

  const group = document.querySelectorAll('#qq-'+qi+' .quiz-opt');
  const correctIdx = quiz.questions[qi].correct;
  group.forEach(g=>{
    g.classList.add('disabled');
    const go = parseInt(g.dataset.o,10);
    if(go === oi) g.classList.add('selected');
    if(go === correctIdx) g.classList.add('correct');
    else if(go === oi && oi !== correctIdx) g.classList.add('incorrect');
  });
  const fb = document.getElementById('qf-'+qi);
  if(fb){
    fb.classList.add('show');
    if(oi === correctIdx){
      fb.classList.add('correct');
      fb.innerHTML = '<b>Correct.</b> ' + quiz.questions[qi].explain;
    } else {
      fb.classList.add('incorrect');
      fb.innerHTML = '<b>Not quite.</b> ' + quiz.questions[qi].explain;
    }
  }

  // enable submit if all answered
  const allAnswered = quiz.answers.every(a=>a!==null);
  const submitBtn = document.getElementById(quiz.containerId + '-submit');
  if(submitBtn) submitBtn.disabled = !allAnswered;
}

function submitQuiz(containerId){
  const qObjKey = '__quiz_' + containerId;
  const quiz = window[qObjKey];
  if(!quiz) return;
  let score = 0;
  quiz.questions.forEach((item,qi)=>{ if(quiz.answers[qi] === item.correct) score++; });
  const total = quiz.questions.length;
  const pct = Math.round((score/total)*100);
  const passed = pct >= 70;

  const storeKey = quiz.kind === 'review' ? ('review-' + quiz.key) : ('lesson-' + quiz.key);
  if(quiz.kind === 'review'){
    STATE.reviews[quiz.moduleId] = {score, total, passed};
  } else {
    STATE.lessons[quiz.lessonId] = Object.assign({}, STATE.lessons[quiz.lessonId], {quizScore:score, quizTotal:total, quizPassed:passed});
    if(passed){ STATE.lessons[quiz.lessonId].complete = true; }
  }
  saveState(STATE);

  const banner = document.getElementById(containerId + '-banner');
  if(banner){
    banner.classList.add('show');
    banner.innerHTML = `<div><div class="score">${score}/${total} (${pct}%)</div>
      <div class="msg">${passed ? 'Well done! You passed this check.' : 'Keep going \u2014 review the material and try again anytime.'}</div></div>`;
  }
  const submitBtn = document.getElementById(containerId + '-submit');
  if(submitBtn){ submitBtn.textContent = 'Submitted'; submitBtn.disabled = true; }

  if(quiz.kind === 'lesson' && passed){
    const completeBtn = document.getElementById('markCompleteBtn');
    if(completeBtn){ completeBtn.textContent = '\u2713 Lesson Complete'; completeBtn.classList.add('btn-done'); completeBtn.classList.remove('btn-primary'); completeBtn.disabled = true; }
  }
  updateOverallProgressUI();
}

/* ---------------- Module page progress ---------------- */
function renderModuleLessonList(containerId, moduleId){
  const mod = STRUCTURE.find(m=>m.id===moduleId);
  if(!mod) return;
  const box = document.getElementById(containerId);
  if(!box) return;
  let html = '';
  mod.lessons.forEach((l,idx)=>{
    const done = isLessonComplete(l.id);
    html += `<a class="module-card ${done?'done':''}" href="${l.file}" style="margin-bottom:12px;">
      <div class="m-num">${done?'&#10003;':idx+1}</div>
      <h3>${l.heading}</h3>
      <div class="m-meta">${done?'Completed':'Not started'} &middot; Includes explanation, worksheet &amp; knowledge check</div>
    </a>`;
  });
  box.innerHTML = html;
}

/* ---------------- Home page ---------------- */
function renderHomeGrid(containerId){
  const box = document.getElementById(containerId);
  if(!box) return;
  let html = '';
  STRUCTURE.forEach(m=>{
    const doneLessons = m.lessons.filter(l=>isLessonComplete(l.id)).length;
    const reviewDone = STATE.reviews[m.id] && STATE.reviews[m.id].passed;
    const totalUnitsM = m.lessons.length + 1;
    const doneUnitsM = doneLessons + (reviewDone?1:0);
    const pct = Math.round((doneUnitsM/totalUnitsM)*100);
    const isDone = doneUnitsM === totalUnitsM;
    html += `<a class="module-card ${isDone?'done':''}" href="module-${m.id}.html">
      <div class="m-num">${isDone?'&#10003;':m.id}</div>
      <h3>${m.title}</h3>
      <div class="m-meta">${m.lessons.length} lesson${m.lessons.length>1?'s':''} + live module assessment</div>
      <div class="m-bar"><div class="m-bar-fill" style="width:${pct}%"></div></div>
    </a>`;
  });
  box.innerHTML = html;
}
function getResumeLink(){
  for(const m of STRUCTURE){
    for(const l of m.lessons){
      if(!isLessonComplete(l.id)) return l.file;
    }
    if(!(STATE.reviews[m.id] && STATE.reviews[m.id].passed)) return 'module-'+m.id+'-review.html';
  }
  return 'certificate.html';
}
function initHomeResume(){
  const btn = document.getElementById('resumeBtn');
  if(btn) btn.setAttribute('href', getResumeLink());
}

/* ---------------- Certificate ---------------- */
function courseComplete(){
  return completedUnits() === totalUnits();
}
function initCertificate(){
  const input = document.getElementById('certName');
  const nameEl = document.getElementById('certNameDisplay');
  const dateEl = document.getElementById('certDate');
  if(dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', {year:'numeric', month:'long', day:'numeric'});
  if(input){
    input.value = STATE.name || '';
    if(nameEl) nameEl.textContent = input.value || 'Your Name';
    input.addEventListener('input', ()=>{
      STATE.name = input.value;
      saveState(STATE);
      if(nameEl) nameEl.textContent = input.value || 'Your Name';
    });
  }
  const gate = document.getElementById('certGate');
  const certBody = document.getElementById('certBody');
  if(gate && certBody){
    if(courseComplete()){ gate.style.display='none'; certBody.style.display='block'; }
    else { gate.style.display='block'; certBody.style.display='none'; }
  }
}

document.addEventListener('DOMContentLoaded', function(){
  updateOverallProgressUI();
  injectAuthUI();
});

function injectAuthUI(){
  const actions = document.querySelector('.top-actions');
  if(actions && !document.getElementById('logoutLink')){
    const a = document.createElement('a');
    a.id = 'logoutLink';
    a.href = '#';
    a.className = 'btn btn-outline';
    a.style.cssText = 'padding:7px 14px;font-size:12.5px;';
    a.textContent = 'Logout';
    a.onclick = function(e){ e.preventDefault(); if(typeof logout === 'function') logout(); };
    actions.appendChild(a);
  }
  const footer = document.querySelector('.sb-footer');
  if(footer && !document.getElementById('learnerNameDisplay')){
    const span = document.createElement('div');
    span.id = 'learnerNameDisplay';
    span.style.cssText = 'margin-top:6px;color:var(--gold);font-weight:600;';
    footer.appendChild(span);
  }
}
