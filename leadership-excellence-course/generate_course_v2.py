# -*- coding: utf-8 -*-
"""
Generator v2 for: Leadership Excellence for Working Professionals
Produces 5 pages per module + landing + dashboard:
  module-XX-content.html     (concepts, full EN + full simple-Tamil)
  module-XX-examples.html    (real-life example, full EN + TA)
  module-XX-metaphor.html    (metaphor, full EN + TA)
  module-XX-worksheet.html   (structured worksheet, full EN + TA)
  module-XX-actionplan.html  (action plan, full EN + TA, marks module complete)
Same stack as v1: Poppins + Noto Sans Tamil, navy/gold, EN/Tamil toggle,
Firebase auth gate, GAS logging, WhatsApp CTA, Razorpay button.
"""
import os
from course_data import COURSE, MODULES
from module_extensions import EXTENSIONS

OUT = "output_v2"
os.makedirs(OUT, exist_ok=True)

FIREBASE_CONFIG_PLACEHOLDER = """
    // TODO: Replace with your existing Firebase project config (lifeskills-bd221)
    const firebaseConfig = {
      apiKey: "YOUR_RESTRICTED_API_KEY",
      authDomain: "lifeskills-bd221.firebaseapp.com",
      projectId: "lifeskills-bd221",
      storageBucket: "lifeskills-bd221.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    const COURSE_ID = "leadership-excellence-professionals";
"""
GAS_ENDPOINT_PLACEHOLDER = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
RAZORPAY_BUTTON_PLACEHOLDER = "pl_TGKqVmSmXDJlbw"
WHATSAPP_NUMBER = COURSE["whatsapp_number"]

PAGE_SEQUENCE = ["content", "examples", "metaphor", "worksheet", "actionplan"]
PAGE_LABEL_EN = {"content": "Content", "examples": "Real-Life Examples", "metaphor": "Metaphor",
                 "worksheet": "Worksheet", "actionplan": "Action Plan"}
PAGE_LABEL_TA = {"content": "உள்ளடக்கம்", "examples": "நிஜ வாழ்க்கை உதாரணங்கள்", "metaphor": "உருவகம்",
                  "worksheet": "பணித்தாள்", "actionplan": "செயல் திட்டம்"}

BASE_CSS = """
:root{
  --navy:#0b1f3a; --navy-2:#132b4d; --gold:#c9a227; --gold-light:#e8cf6f;
  --bg:#f7f8fb; --text:#1c2530; --muted:#5b6778; --card:#ffffff; --border:#e3e7ee;
  --success:#1e7d4f; --danger:#b3261e;
}
*{box-sizing:border-box;}
body{margin:0;font-family:'Poppins',sans-serif;background:var(--bg);color:var(--text);line-height:1.65;}
.navbar{background:var(--navy);color:#fff;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
.navbar .brand{font-weight:600;font-size:1.05rem;display:flex;align-items:center;gap:10px;}
.navbar .brand .dot{width:10px;height:10px;background:var(--gold);border-radius:50%;display:inline-block;}
.lang-toggle{background:transparent;border:1px solid var(--gold);color:var(--gold-light);padding:6px 14px;border-radius:20px;cursor:pointer;font-family:'Poppins',sans-serif;font-size:0.85rem;}
.lang-toggle:hover{background:var(--gold);color:var(--navy);}
.container{max-width:900px;margin:0 auto;padding:32px 20px 90px;}
.eyebrow{color:var(--gold);text-transform:uppercase;letter-spacing:1.5px;font-size:0.78rem;font-weight:600;}
h1{color:var(--navy);font-size:1.85rem;margin:6px 0 4px;}
h2{color:var(--navy);font-size:1.25rem;margin-top:0;border-left:4px solid var(--gold);padding-left:12px;}
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;margin:18px 0;box-shadow:0 1px 3px rgba(11,31,58,0.05);}
.objective{background:linear-gradient(135deg,var(--navy),var(--navy-2));color:#fff;border-radius:14px;padding:20px 24px;margin:20px 0;}
.objective .label{color:var(--gold-light);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;font-weight:600;}
.progress-bar{height:8px;background:var(--border);border-radius:6px;overflow:hidden;margin:16px 0;}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold-light));}
.btn{display:inline-block;background:var(--navy);color:#fff;text-decoration:none;padding:12px 26px;border-radius:8px;font-weight:600;border:none;cursor:pointer;font-family:'Poppins',sans-serif;font-size:0.95rem;}
.btn:hover{background:var(--navy-2);}
.btn-gold{background:var(--gold);color:var(--navy);}
.btn-gold:hover{background:var(--gold-light);}
.btn-outline{background:transparent;color:var(--navy);border:1.5px solid var(--navy);}
.btn-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px;}
.whatsapp-fab{position:fixed;bottom:22px;right:22px;background:#25D366;color:#fff;border-radius:50px;padding:12px 20px;text-decoration:none;font-weight:600;box-shadow:0 4px 14px rgba(0,0,0,0.2);display:flex;align-items:center;gap:8px;z-index:50;}
.page-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 6px;}
.page-tab{font-size:0.75rem;padding:5px 12px;border-radius:16px;background:var(--bg);border:1px solid var(--border);color:var(--muted);text-decoration:none;font-weight:600;}
.page-tab.active{background:var(--navy);color:#fff;border-color:var(--navy);}
.concept-card{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:18px 20px;margin:14px 0;}
.concept-card h3{margin:0 0 8px;color:var(--navy);font-size:1.05rem;}
.concept-card .en{color:var(--text);font-size:0.98rem;margin-bottom:10px;}
.concept-card .ta{color:var(--muted);font-size:0.95rem;padding-top:10px;border-top:1px dashed var(--border);}
.example-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:26px;margin:18px 0;position:relative;}
.example-card .quote-mark{position:absolute;top:14px;left:20px;font-size:2.5rem;color:var(--gold-light);font-family:Georgia,serif;line-height:1;}
.example-card .body-en{margin-top:20px;font-size:1rem;}
.example-card .body-ta{margin-top:16px;padding-top:16px;border-top:1px solid var(--border);color:var(--muted);font-size:0.98rem;}
.metaphor-block{background:linear-gradient(135deg,var(--navy),var(--navy-2));color:#fff;border-radius:16px;padding:34px 30px;text-align:left;}
.metaphor-block .line-en{font-size:1.55rem;font-weight:700;font-style:italic;margin-bottom:8px;}
.metaphor-block .line-ta{font-size:1.2rem;color:var(--gold-light);margin-bottom:20px;}
.metaphor-block .explain-en{font-size:0.98rem;color:#d6deec;line-height:1.6;}
.metaphor-block .explain-ta{font-size:0.94rem;color:#9fb1ce;line-height:1.65;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.15);}
.worksheet-item{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:16px 18px;margin:14px 0;}
.worksheet-item .q-en{font-weight:600;color:var(--navy);margin-bottom:4px;}
.worksheet-item .q-ta{color:var(--muted);font-size:0.92rem;margin-bottom:10px;}
.worksheet-item textarea{width:100%;min-height:70px;border:1px solid var(--border);border-radius:8px;padding:10px;font-family:'Poppins',sans-serif;font-size:0.95rem;}
.badge{display:inline-block;background:var(--gold);color:var(--navy);font-size:0.75rem;font-weight:700;padding:4px 10px;border-radius:20px;}
.locked-banner{background:#fff4d6;border:1px solid var(--gold);border-radius:10px;padding:16px;margin-bottom:20px;text-align:center;}
footer{text-align:center;color:var(--muted);font-size:0.85rem;padding:30px 20px;}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.save-msg{color:var(--success);font-weight:600;margin-top:10px;display:none;}
@media(max-width:640px){.grid-2{grid-template-columns:1fr;}}
"""

FONTS_LINK = """<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap" rel="stylesheet">"""

def lang_toggle_script():
    return """
function setLang(lang){
  localStorage.setItem('courseLang', lang);
  document.querySelectorAll('[data-en]').forEach(el=>{
    el.textContent = lang === 'ta' ? el.getAttribute('data-ta') : el.getAttribute('data-en');
  });
  document.documentElement.setAttribute('lang', lang === 'ta' ? 'ta' : 'en');
}
document.addEventListener('DOMContentLoaded', ()=>{
  const saved = localStorage.getItem('courseLang') || 'en';
  setLang(saved);
});
"""

def firebase_auth_guard(course_id):
    return f"""
<script type="module">
  import {{ initializeApp }} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import {{ getAuth, onAuthStateChanged }} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  import {{ getFirestore, doc, getDoc }} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  {FIREBASE_CONFIG_PLACEHOLDER}
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  onAuthStateChanged(auth, async (user) => {{
    if (!user) {{ window.location.href = "login.html?course=" + COURSE_ID; return; }}
    try {{
      const enrollDoc = await getDoc(doc(db, "enrollments", user.uid + "_" + COURSE_ID));
      if (!enrollDoc.exists() || enrollDoc.data().status !== "active") {{
        document.getElementById('lockedBanner').style.display = 'block';
        document.getElementById('courseBody').style.display = 'none';
      }} else {{
        document.getElementById('lockedBanner').style.display = 'none';
        document.getElementById('courseBody').style.display = 'block';
      }}
    }} catch(e) {{ console.error("Enrollment check failed:", e); }}
  }});
</script>
"""

def gas_log_script(course_id, page_id):
    return f"""
<script>
(function(){{
  try {{
    const img = new Image();
    const params = new URLSearchParams({{ course: "{course_id}", page: "{page_id}", ts: new Date().toISOString(), key: "SHARED_SPAM_FILTER_KEY" }});
    img.src = "{GAS_ENDPOINT_PLACEHOLDER}?" + params.toString();
  }} catch(e) {{ }}
}})();
</script>
"""

def whatsapp_fab():
    return f"""<a class="whatsapp-fab" href="https://wa.me/{WHATSAPP_NUMBER}?text=Hi%2C%20I%20have%20a%20question%20about%20the%20Leadership%20Excellence%20course" target="_blank" rel="noopener">💬 <span data-en="WhatsApp Us" data-ta="வாட்ஸ்அப் செய்யவும்">WhatsApp Us</span></a>"""

def head(title_en):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title_en} | Leadership Excellence for Working Professionals</title>
{FONTS_LINK}
<style>{BASE_CSS}</style>
</head>
"""

def navbar():
    return """
<div class="navbar">
  <div class="brand"><span class="dot"></span> <span data-en="Leadership Excellence" data-ta="தலைமைத்துவ சிறப்பு">Leadership Excellence</span></div>
  <button class="lang-toggle" onclick="setLang(document.documentElement.lang==='ta'?'en':'ta')">EN / தமிழ்</button>
</div>
"""

def footer_block():
    return f"""
<footer>
  <div>{COURSE['author']} — {COURSE['author_title_en']}</div>
  <div>{COURSE['contact_email']} | +{WHATSAPP_NUMBER[:2]} {WHATSAPP_NUMBER[2:]}</div>
  <div style="margin-top:6px;">"God is always with u."</div>
</footer>
"""

def module_filename(num, kind):
    return f"module-{num:02d}-{kind}.html"

def page_tabs(m, active):
    tabs = ""
    for kind in PAGE_SEQUENCE:
        cls = "page-tab active" if kind == active else "page-tab"
        tabs += f'<a class="{cls}" href="{module_filename(m["num"], kind)}" data-en="{PAGE_LABEL_EN[kind]}" data-ta="{PAGE_LABEL_TA[kind]}">{PAGE_LABEL_EN[kind]}</a>'
    return f'<div class="page-tabs">{tabs}</div>'

def module_nav(m, active, prev_module_link, next_module_link):
    idx = PAGE_SEQUENCE.index(active)
    prev_link = module_filename(m["num"], PAGE_SEQUENCE[idx-1]) if idx > 0 else prev_module_link
    next_link = module_filename(m["num"], PAGE_SEQUENCE[idx+1]) if idx < len(PAGE_SEQUENCE)-1 else next_module_link
    prev_label_en = "← Previous" if idx > 0 else "← Previous Module"
    next_label_en = "Next →" if idx < len(PAGE_SEQUENCE)-1 else "Next Module →"
    return f"""
    <div class="btn-row" style="justify-content:space-between;">
      <a class="btn btn-outline" href="{prev_link}" data-en="{prev_label_en}" data-ta="← முந்தையது">{prev_label_en}</a>
      <a class="btn btn-outline" href="{next_link}" data-en="{next_label_en}" data-ta="அடுத்தது →">{next_label_en}</a>
    </div>"""

def wrap_page(m, active, body_html, prev_module_link, next_module_link, extra_script=""):
    return f"""{head(m['title_en'] + ' - ' + PAGE_LABEL_EN[active])}
<body>
{navbar()}
{firebase_auth_guard(COURSE['course_id']) if False else ''}
{gas_log_script(COURSE['course_id'], module_filename(m['num'], active))}
<div class="container">
  <div id="lockedBanner" class="locked-banner" style="display:none;">
    <strong data-en="Checking your enrollment..." data-ta="உங்கள் பதிவு சரிபார்க்கப்படுகிறது...">Checking your enrollment...</strong>
  </div>
  <div id="courseBody">
    <div class="eyebrow" data-en="Module {m['num']} of 14 · {PAGE_LABEL_EN[active]}" data-ta="பாடம் {m['num']} / 14 · {PAGE_LABEL_TA[active]}">Module {m['num']} of 14 · {PAGE_LABEL_EN[active]}</div>
    <h1 data-en="{m['title_en']}" data-ta="{m['title_ta']}">{m['title_en']}</h1>
    {page_tabs(m, active)}
    {body_html}
    {module_nav(m, active, prev_module_link, next_module_link)}
  </div>
</div>
{whatsapp_fab()}
{footer_block()}
<script>{lang_toggle_script()}</script>
{extra_script}
</body>
</html>"""

# NOTE: Firebase auth guard is written into every page's <script> below via direct call
# (kept separate from wrap_page's placeholder above to avoid double-injection).
def wrap_page_final(m, active, body_html, prev_module_link, next_module_link, extra_script=""):
    return f"""{head(m['title_en'] + ' - ' + PAGE_LABEL_EN[active])}
<body>
{navbar()}
{firebase_auth_guard(COURSE['course_id'])}
{gas_log_script(COURSE['course_id'], module_filename(m['num'], active))}
<div class="container">
  <div id="lockedBanner" class="locked-banner" style="display:none;">
    <strong data-en="Checking your enrollment..." data-ta="உங்கள் பதிவு சரிபார்க்கப்படுகிறது...">Checking your enrollment...</strong>
    <p data-en="If this course isn't unlocked yet, please complete payment or contact us on WhatsApp." data-ta="இந்த பாடநெறி இன்னும் திறக்கப்படவில்லை என்றால், தயவுசெய்து பணம் செலுத்தவும் அல்லது வாட்ஸ்அப்பில் தொடர்பு கொள்ளவும்.">If this course isn't unlocked yet, please complete payment or contact us on WhatsApp.</p>
  </div>
  <div id="courseBody" style="display:none;">
    <div class="eyebrow" data-en="Module {m['num']} of 14 · {PAGE_LABEL_EN[active]}" data-ta="பாடம் {m['num']} / 14 · {PAGE_LABEL_TA[active]}">Module {m['num']} of 14 · {PAGE_LABEL_EN[active]}</div>
    <h1 data-en="{m['title_en']}" data-ta="{m['title_ta']}">{m['title_en']}</h1>
    {page_tabs(m, active)}
    {body_html}
    {module_nav(m, active, prev_module_link, next_module_link)}
  </div>
</div>
{whatsapp_fab()}
{footer_block()}
<script>{lang_toggle_script()}</script>
{extra_script}
</body>
</html>"""

# ---------------------------------------------------------------- CONTENT PAGE
def render_content_page(m, ext, prev_link, next_link):
    concept_html = ""
    for (title_en, body_en), body_ta in zip(m["concepts"], ext["concepts_ta"]):
        concept_html += f"""
        <div class="concept-card">
          <h3>{title_en}</h3>
          <div class="en" data-en="{body_en}" data-ta="{body_ta}">{body_en}</div>
        </div>"""
    body = f"""
    <div class="objective">
      <div class="label" data-en="Learning Objective" data-ta="கற்றல் நோக்கம்">Learning Objective</div>
      <p data-en="{m['objective_en']}" data-ta="{m['objective_ta']}">{m['objective_en']}</p>
    </div>
    {concept_html}
    """
    return wrap_page_final(m, "content", body, prev_link, next_link)

# ---------------------------------------------------------------- EXAMPLES PAGE
def render_examples_page(m, ext, prev_link, next_link):
    rl = ext["real_life"]
    body = f"""
    <div class="example-card">
      <span class="quote-mark">&ldquo;</span>
      <h2 data-en="{rl['title_en']}" data-ta="{rl['title_ta']}">{rl['title_en']}</h2>
      <div class="body-en" data-en="{rl['body_en']}" data-ta="{rl['body_ta']}">{rl['body_en']}</div>
    </div>
    """
    return wrap_page_final(m, "examples", body, prev_link, next_link)

# ---------------------------------------------------------------- METAPHOR PAGE
def render_metaphor_page(m, ext, prev_link, next_link):
    mt = ext["metaphor"]
    body = f"""
    <div class="metaphor-block">
      <div class="line-en" data-en="&ldquo;{mt['line_en']}&rdquo;" data-ta="&ldquo;{mt['line_ta']}&rdquo;">&ldquo;{mt['line_en']}&rdquo;</div>
      <div class="explain-en" data-en="{mt['explain_en']}" data-ta="{mt['explain_ta']}">{mt['explain_en']}</div>
    </div>
    """
    return wrap_page_final(m, "metaphor", body, prev_link, next_link)

# ---------------------------------------------------------------- WORKSHEET PAGE
def render_worksheet_page(m, ext, prev_link, next_link):
    ws = ext["worksheet"]
    items = ""
    for i, p in enumerate(ws["prompts"]):
        items += f"""
        <div class="worksheet-item">
          <div class="q-en" data-en="{i+1}. {p['en']}" data-ta="{i+1}. {p['ta']}">{i+1}. {p['en']}</div>
          <textarea id="ws-{m['num']}-{i}" placeholder="Type your answer here..."></textarea>
        </div>"""
    body = f"""
    <div class="card">
      <h2 data-en="{ws['title_en']}" data-ta="{ws['title_ta']}">{ws['title_en']}</h2>
      {items}
      <button class="btn btn-gold" onclick="saveWorksheet()" data-en="Save My Answers" data-ta="எனது பதில்களை சேமிக்கவும்">Save My Answers</button>
      <p class="save-msg" id="saveMsg" data-en="Saved on this device." data-ta="இந்த சாதனத்தில் சேமிக்கப்பட்டது.">Saved on this device.</p>
    </div>
    """
    script = f"""
<script>
function saveWorksheet(){{
  const data = {{}};
  document.querySelectorAll('textarea[id^="ws-{m['num']}-"]').forEach(t=>{{ data[t.id] = t.value; }});
  localStorage.setItem('worksheet-module-{m['num']}', JSON.stringify(data));
  document.getElementById('saveMsg').style.display = 'block';
}}
window.addEventListener('DOMContentLoaded', ()=>{{
  const saved = JSON.parse(localStorage.getItem('worksheet-module-{m['num']}') || '{{}}');
  Object.keys(saved).forEach(id=>{{ const el = document.getElementById(id); if(el) el.value = saved[id]; }});
}});
</script>"""
    return wrap_page_final(m, "worksheet", body, prev_link, next_link, extra_script=script)

# ---------------------------------------------------------------- ACTION PLAN PAGE
def render_actionplan_page(m, ext, next_module_link):
    ap = ext["action_plan"]
    items = ""
    for i, p in enumerate(ap["prompts"]):
        items += f"""
        <div class="worksheet-item">
          <div class="q-en" data-en="{p['en']}" data-ta="{p['ta']}">{p['en']}</div>
          <textarea id="ap-{m['num']}-{i}" placeholder="Write your commitment here..."></textarea>
        </div>"""
    body = f"""
    <div class="card">
      <h2 data-en="{ap['title_en']}" data-ta="{ap['title_ta']}">{ap['title_en']}</h2>
      {items}
      <button class="btn btn-gold" onclick="completeModule()" data-en="Save &amp; Mark Module Complete" data-ta="சேமித்து பாடத்தை முடிந்ததாக குறிக்கவும்">Save &amp; Mark Module Complete</button>
      <p class="save-msg" id="saveMsg" data-en="Module marked complete. Great work!" data-ta="பாடம் முடிந்ததாக குறிக்கப்பட்டது. சிறப்பான வேலை!">Module marked complete. Great work!</p>
    </div>
    """
    script = f"""
<script>
function completeModule(){{
  const data = {{}};
  document.querySelectorAll('textarea[id^="ap-{m['num']}-"]').forEach(t=>{{ data[t.id] = t.value; }});
  localStorage.setItem('actionplan-module-{m['num']}', JSON.stringify(data));
  localStorage.setItem('complete-module-{m['num']}', '1');
  document.getElementById('saveMsg').style.display = 'block';
}}
window.addEventListener('DOMContentLoaded', ()=>{{
  const saved = JSON.parse(localStorage.getItem('actionplan-module-{m['num']}') || '{{}}');
  Object.keys(saved).forEach(id=>{{ const el = document.getElementById(id); if(el) el.value = saved[id]; }});
}});
</script>"""
    # Action plan page uses a custom nav row: Previous (worksheet) + Next Module / Dashboard
    idx = PAGE_SEQUENCE.index("actionplan")
    prev_link = module_filename(m["num"], PAGE_SEQUENCE[idx-1])
    return f"""{head(m['title_en'] + ' - Action Plan')}
<body>
{navbar()}
{firebase_auth_guard(COURSE['course_id'])}
{gas_log_script(COURSE['course_id'], module_filename(m['num'], 'actionplan'))}
<div class="container">
  <div id="lockedBanner" class="locked-banner" style="display:none;">
    <strong data-en="Checking your enrollment..." data-ta="உங்கள் பதிவு சரிபார்க்கப்படுகிறது...">Checking your enrollment...</strong>
  </div>
  <div id="courseBody" style="display:none;">
    <div class="eyebrow" data-en="Module {m['num']} of 14 · Action Plan" data-ta="பாடம் {m['num']} / 14 · செயல் திட்டம்">Module {m['num']} of 14 · Action Plan</div>
    <h1 data-en="{m['title_en']}" data-ta="{m['title_ta']}">{m['title_en']}</h1>
    {page_tabs(m, "actionplan")}
    {body}
    <div class="btn-row" style="justify-content:space-between;">
      <a class="btn btn-outline" href="{prev_link}" data-en="← Previous" data-ta="← முந்தையது">← Previous</a>
      <div style="display:flex;gap:12px;">
        <a class="btn btn-outline" href="dashboard.html" data-en="Back to Dashboard" data-ta="டாஷ்போர்டுக்கு திரும்பவும்">Back to Dashboard</a>
        <a class="btn" href="{next_module_link}" data-en="Next Module →" data-ta="அடுத்த பாடம் →">Next Module →</a>
      </div>
    </div>
  </div>
</div>
{whatsapp_fab()}
{footer_block()}
<script>{lang_toggle_script()}</script>
{script}
</body>
</html>"""

# ---------------------------------------------------------------- LANDING PAGE
def render_landing_page():
    module_rows = ""
    for m in MODULES:
        module_rows += f"""
        <div class="card" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <span class="badge">M{m['num']:02d}</span>
            <strong style="margin-left:8px;" data-en="{m['title_en']}" data-ta="{m['title_ta']}">{m['title_en']}</strong>
            <div style="font-size:0.82rem;color:var(--muted);margin-top:2px;" data-en="5 pages: Content, Real-Life Examples, Metaphor, Worksheet, Action Plan" data-ta="5 பக்கங்கள்: உள்ளடக்கம், நிஜ வாழ்க்கை உதாரணங்கள், உருவகம், பணித்தாள், செயல் திட்டம்">5 pages: Content, Real-Life Examples, Metaphor, Worksheet, Action Plan</div>
          </div>
          <a class="btn btn-outline" href="{module_filename(m['num'],'content')}" data-en="Preview →" data-ta="முன்னோட்டம் →">Preview →</a>
        </div>"""

    return f"""{head('Course Overview')}
<body>
{navbar()}
<div class="container">
  <div class="eyebrow" data-en="For Working Professionals" data-ta="பணிபுரியும் நிபுணர்களுக்காக">For Working Professionals</div>
  <h1 data-en="{COURSE['course_title_en']}" data-ta="{COURSE['course_title_ta']}">{COURSE['course_title_en']}</h1>
  <p data-en="A 14-module, self-paced, fully bilingual (English/simple Tamil) program. Every module has 5 pages: core content, a real-life workplace example, a memorable metaphor, a hands-on worksheet, and a personal action plan." data-ta="14-பாடங்கள் கொண்ட, சுய-வேக, முழுமையாக இருமொழி (ஆங்கிலம்/எளிய தமிழ்) திட்டம். ஒவ்வொரு பாடத்திலும் 5 பக்கங்கள் உள்ளன: முக்கிய உள்ளடக்கம், ஒரு நிஜ வாழ்க்கை பணியிட உதாரணம், நினைவில் நிற்கும் ஒரு உருவகம், ஒரு நடைமுறை பணித்தாள், மற்றும் ஒரு தனிப்பட்ட செயல் திட்டம்.">
    A 14-module, self-paced, fully bilingual (English/simple Tamil) program. Every module has 5 pages: core content, a real-life workplace example, a memorable metaphor, a hands-on worksheet, and a personal action plan.
  </p>

  <div class="card">
    <h2 style="margin-top:0;" data-en="What's Included" data-ta="என்ன அடங்கும்">What's Included</h2>
    <div class="grid-2">
      <div>✅ <span data-en="14 modules × 5 pages each" data-ta="14 பாடங்கள் × தலா 5 பக்கங்கள்">14 modules × 5 pages each</span></div>
      <div>✅ <span data-en="Full English / simple Tamil translation on every page" data-ta="ஒவ்வொரு பக்கத்திலும் முழு ஆங்கிலம் / எளிய தமிழ் மொழிபெயர்ப்பு">Full English / simple Tamil translation on every page</span></div>
      <div>✅ <span data-en="Real workplace examples for every module" data-ta="ஒவ்வொரு பாடத்திற்கும் நிஜ பணியிட உதாரணங்கள்">Real workplace examples for every module</span></div>
      <div>✅ <span data-en="A memorable metaphor for every module" data-ta="ஒவ்வொரு பாடத்திற்கும் நினைவில் நிற்கும் ஒரு உருவகம்">A memorable metaphor for every module</span></div>
      <div>✅ <span data-en="Hands-on worksheets and a 90-day action plan" data-ta="நடைமுறை பணித்தாள்கள் மற்றும் 90-நாள் செயல் திட்டம்">Hands-on worksheets and a 90-day action plan</span></div>
      <div>✅ <span data-en="Direct WhatsApp support" data-ta="நேரடி வாட்ஸ்அப் ஆதரவு">Direct WhatsApp support</span></div>
    </div>
  </div>

  <div class="card" style="text-align:center;">
    <h2 style="margin-top:0;" data-en="Enroll Now" data-ta="இப்போது பதிவு செய்யுங்கள்">Enroll Now</h2>
    <p data-en="Secure payment via Razorpay. After payment, you'll be redirected to complete your account setup on WhatsApp." data-ta="Razorpay மூலம் பாதுகாப்பான கட்டணம். கட்டணத்திற்குப் பிறகு, வாட்ஸ்அப்பில் உங்கள் கணக்கு அமைப்பை முடிக்க திருப்பி விடப்படுவீர்கள்.">
      Secure payment via Razorpay. After payment, you'll be redirected to complete your account setup on WhatsApp.
    </p>
    <form>
      <script src="https://checkout.razorpay.com/v1/payment-button.js"
        data-payment_button_id="{RAZORPAY_BUTTON_PLACEHOLDER}" async></script>
    </form>
    <p style="margin-top:16px;"><a href="dashboard.html" data-en="Already enrolled? Go to Dashboard →" data-ta="ஏற்கனவே பதிவு செய்துள்ளீர்களா? டாஷ்போர்டுக்குச் செல்லவும் →">Already enrolled? Go to Dashboard →</a></p>
  </div>

  <h2 data-en="Module List" data-ta="பாட பட்டியல்">Module List</h2>
  {module_rows}
</div>
{whatsapp_fab()}
{footer_block()}
<script>{lang_toggle_script()}</script>
</body>
</html>"""

# ---------------------------------------------------------------- DASHBOARD PAGE
def render_dashboard_page():
    rows = ""
    for m in MODULES:
        rows += f"""
        <div class="card" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
          <div>
            <span class="badge">M{m['num']:02d}</span>
            <strong style="margin-left:8px;" data-en="{m['title_en']}" data-ta="{m['title_ta']}">{m['title_en']}</strong>
            <div style="font-size:0.85rem;color:var(--muted);margin-top:4px;" id="status-{m['num']}" data-en="Not started" data-ta="தொடங்கவில்லை">Not started</div>
          </div>
          <a class="btn btn-outline" href="{module_filename(m['num'],'content')}" data-en="Open →" data-ta="திறக்கவும் →">Open →</a>
        </div>"""

    return f"""{head('My Dashboard')}
<body>
{navbar()}
{firebase_auth_guard(COURSE['course_id'])}
{gas_log_script(COURSE['course_id'], 'dashboard.html')}
<div class="container">
  <div id="lockedBanner" class="locked-banner" style="display:none;">
    <strong data-en="Checking your enrollment..." data-ta="உங்கள் பதிவு சரிபார்க்கப்படுகிறது...">Checking your enrollment...</strong>
  </div>
  <div id="courseBody" style="display:none;">
    <div class="eyebrow" data-en="Your Progress" data-ta="உங்கள் முன்னேற்றம்">Your Progress</div>
    <h1 data-en="Leadership Excellence — My Dashboard" data-ta="தலைமைத்துவ சிறப்பு — எனது டாஷ்போர்டு">Leadership Excellence — My Dashboard</h1>
    <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:0%;"></div></div>
    <p id="progressText" data-en="0 of 14 modules completed" data-ta="14 பாடங்களில் 0 முடிந்தது">0 of 14 modules completed</p>
    {rows}
  </div>
</div>
{whatsapp_fab()}
{footer_block()}
<script>
{lang_toggle_script()}
window.addEventListener('DOMContentLoaded', ()=>{{
  let completed = 0;
  for(let i=1;i<=14;i++){{
    const done = localStorage.getItem('complete-module-'+i);
    const statusEl = document.getElementById('status-'+i);
    if(done === '1'){{
      completed++;
      if(statusEl){{ statusEl.textContent = 'Completed ✓'; statusEl.style.color = 'var(--success)'; }}
    }}
  }}
  document.getElementById('progressFill').style.width = Math.round((completed/14)*100) + '%';
  document.getElementById('progressText').textContent = completed + ' of 14 modules completed';
}});
</script>
</body>
</html>"""

# ----------------------------------------------------------------- BUILD
def build():
    for i, m in enumerate(MODULES):
        ext = EXTENSIONS[m["num"]]
        prev_module_content = module_filename(MODULES[i-1]["num"], "content") if i > 0 else "index.html"
        next_num = MODULES[i+1]["num"] if i < len(MODULES)-1 else None
        next_module_content = module_filename(next_num, "content") if next_num else "dashboard.html"

        with open(os.path.join(OUT, module_filename(m["num"], "content")), "w", encoding="utf-8") as f:
            f.write(render_content_page(m, ext, prev_module_content, next_module_content))
        with open(os.path.join(OUT, module_filename(m["num"], "examples")), "w", encoding="utf-8") as f:
            f.write(render_examples_page(m, ext, prev_module_content, next_module_content))
        with open(os.path.join(OUT, module_filename(m["num"], "metaphor")), "w", encoding="utf-8") as f:
            f.write(render_metaphor_page(m, ext, prev_module_content, next_module_content))
        with open(os.path.join(OUT, module_filename(m["num"], "worksheet")), "w", encoding="utf-8") as f:
            f.write(render_worksheet_page(m, ext, prev_module_content, next_module_content))
        with open(os.path.join(OUT, module_filename(m["num"], "actionplan")), "w", encoding="utf-8") as f:
            f.write(render_actionplan_page(m, ext, next_module_content))

    with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8") as f:
        f.write(render_landing_page())
    with open(os.path.join(OUT, "dashboard.html"), "w", encoding="utf-8") as f:
        f.write(render_dashboard_page())

    print(f"Generated {len(MODULES)*5 + 2} files in ./{OUT}/")

if __name__ == "__main__":
    build()
