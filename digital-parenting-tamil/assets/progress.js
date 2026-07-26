
const COURSE_KEY = 'dpm_progress_v1';
function getProgress(){ try{return JSON.parse(localStorage.getItem(COURSE_KEY))||{}}catch(e){return {}} }
function setLessonDone(id){ const p=getProgress(); p[id]=true; localStorage.setItem(COURSE_KEY, JSON.stringify(p)); }
function isLessonDone(id){ return !!getProgress()[id]; }
function markDoneUI(id, btn){
  setLessonDone(id);
  if(btn){ btn.textContent='✅ Completed'; btn.disabled=true; }
  document.querySelectorAll('[data-lesson-row="'+id+'"]').forEach(el=>el.classList.add('done'));
}
function renderModuleProgress(lessonIds, barEl, textEl){
  const p = getProgress();
  const done = lessonIds.filter(id=>p[id]).length;
  const pct = Math.round((done/lessonIds.length)*100);
  if(barEl) barEl.style.width = pct+'%';
  if(textEl) textEl.textContent = done+' / '+lessonIds.length+' Lessons Completed ('+pct+'%)';
  return pct;
}
// MCQ interactivity
document.addEventListener('click', function(e){
  const opt = e.target.closest('.mcq-opt');
  if(!opt) return;
  const card = opt.closest('.mcq-card');
  const correct = card.getAttribute('data-answer');
  const val = opt.querySelector('input').value;
  card.querySelectorAll('.mcq-opt').forEach(o=>o.classList.remove('correct','wrong'));
  if(val === correct){
    opt.classList.add('correct');
    card.querySelector('.mcq-feedback').textContent = '✅ சரியான பதில்! (Correct)';
    card.querySelector('.mcq-feedback').style.color = '#2e7d55';
  } else {
    opt.classList.add('wrong');
    const correctOpt = [...card.querySelectorAll('.mcq-opt')].find(o=>o.querySelector('input').value===correct);
    if(correctOpt) correctOpt.classList.add('correct');
    card.querySelector('.mcq-feedback').textContent = '❌ மீண்டும் முயற்சி செய்யவும் (Try again)';
    card.querySelector('.mcq-feedback').style.color = '#b3392c';
  }
});
// checkbox + textarea autosave
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('[data-key]').forEach(el=>{
    const key='dpm_field_'+el.getAttribute('data-key');
    const saved = localStorage.getItem(key);
    if(saved !== null){
      if(el.type==='checkbox') el.checked = saved==='1';
      else el.value = saved;
    }
    el.addEventListener('change', ()=>{
      localStorage.setItem(key, el.type==='checkbox' ? (el.checked?'1':'0') : el.value);
    });
    el.addEventListener('input', ()=>{
      if(el.tagName==='TEXTAREA' || el.type==='text') localStorage.setItem(key, el.value);
    });
  });
});
