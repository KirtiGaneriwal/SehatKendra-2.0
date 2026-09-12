// ============ STATE ============
const state = {
  loggedIn: false,
  patientName: 'Guest Citizen',
  abhaId: null,
  conditions: [],
  medicines: [],
  allergies: [],
  registration: {},
  booking: {
    pathway: 'general',
    doctor: 'Dr. Priya Sharma',
    doctorRole: 'General Medicine',
    mode: 'In-Person Hospital OPD',
    date: '',
    slot: '10:00 AM',
    confirmed: false,
    attachedPrescriptionId: ''
  },
  prescriptions: []
};

// ============ FONT SIZE (A- / A / A+) ============
function setFontSize(size){
  document.documentElement.setAttribute('data-fontsize', size);
  document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.dataset.size === size));
  try{ localStorage.setItem('sehatkendra-fontsize', size); }catch(e){}
}
(function initFontSize(){
  let saved = 'md';
  try{ saved = localStorage.getItem('sehatkendra-fontsize') || 'md'; }catch(e){}
  document.addEventListener('DOMContentLoaded', () => setFontSize(saved));
})();

// ============ HIGH CONTRAST MODE ============
function applyContrast(isHigh){
  document.documentElement.setAttribute('data-contrast', isHigh ? 'high' : 'normal');
  const btn = document.getElementById('contrastToggleBtn');
  if(btn) btn.classList.toggle('active', isHigh);
  const icon = document.getElementById('contrastIcon');
  if(icon) icon.textContent = isHigh ? '◑' : '◐';
  try{ localStorage.setItem('sehatkendra-contrast', isHigh ? 'high' : 'normal'); }catch(e){}
}
function toggleContrast(){
  const isHigh = document.documentElement.getAttribute('data-contrast') === 'high';
  applyContrast(!isHigh);
}
(function initContrast(){
  let saved = 'normal';
  try{ saved = localStorage.getItem('sehatkendra-contrast') || 'normal'; }catch(e){}
  document.addEventListener('DOMContentLoaded', () => applyContrast(saved === 'high'));
})();

// ============ QUICK LANGUAGE SELECT (header) ============
// Full page-wide translation is out of scope for this prototype; this covers the
// header / utility bar and the landing screen. Extend by adding more data-i18n
// attributes in the HTML and matching keys below.
const translations = {
  en: {
    phone: '📞 1800-11-4477 (Toll Free)',
    govLine: 'Government of India · National Health Authority',
    brandSub: 'National Digital Health Gateway',
    signInBtn: '👤 Citizen Sign-in',
    navHome: '▦ Patient Home',
    guestPill: '☀ Guest Citizen',
    navLogout: 'Logout',
    govPill: 'Government of India · National Health Authority',
    heroTitle: 'Welcome to SEHAT KENDRA',
    heroSubtitle: 'Universal Digital Health Records & Citizen Gateway',
    heroDesc: 'A secure, citizen-friendly portal designed to connect your health journey with doctors, hospitals, and wellness services under Ayushman Bharat Digital Mission (ABDM).',
    getStarted: 'Get Started →',
    selectLangBtn: '🌐 Select Preferred Language',
    trust1: '✓ 100% Free Public Health Service',
    trust2: '🔒 ABDM & DISHA Compliant Consent Protection',
    trust3: '🗣 Voice Assisted in 6 Regional Languages'
  },
  hi: {
    phone: '📞 1800-11-4477 (टोल फ्री)',
    govLine: 'भारत सरकार · राष्ट्रीय स्वास्थ्य प्राधिकरण',
    brandSub: 'राष्ट्रीय डिजिटल स्वास्थ्य गेटवे',
    signInBtn: '👤 नागरिक साइन-इन',
    navHome: '▦ रोगी होम',
    guestPill: '☀ अतिथि नागरिक',
    navLogout: 'लॉग आउट',
    govPill: 'भारत सरकार · राष्ट्रीय स्वास्थ्य प्राधिकरण',
    heroTitle: 'सेहत केंद्र में आपका स्वागत है',
    heroSubtitle: 'सार्वभौमिक डिजिटल स्वास्थ्य रिकॉर्ड और नागरिक गेटवे',
    heroDesc: 'एक सुरक्षित, नागरिक-अनुकूल पोर्टल जो आपकी स्वास्थ्य यात्रा को आयुष्मान भारत डिजिटल मिशन (एबीडीएम) के तहत डॉक्टरों, अस्पतालों और वेलनेस सेवाओं से जोड़ता है।',
    getStarted: 'शुरू करें →',
    selectLangBtn: '🌐 पसंदीदा भाषा चुनें',
    trust1: '✓ 100% निःशुल्क सार्वजनिक स्वास्थ्य सेवा',
    trust2: '🔒 एबीडीएम और डिशा अनुरूप सहमति सुरक्षा',
    trust3: '🗣 6 क्षेत्रीय भाषाओं में आवाज़ सहायता'
  },
  bn: {
    phone: '📞 1800-11-4477 (টোল ফ্রি)',
    govLine: 'ভারত সরকার · জাতীয় স্বাস্থ্য কর্তৃপক্ষ',
    brandSub: 'জাতীয় ডিজিটাল স্বাস্থ্য গেটওয়ে',
    signInBtn: '👤 নাগরিক সাইন-ইন',
    navHome: '▦ রোগীর হোম',
    guestPill: '☀ অতিথি নাগরিক',
    navLogout: 'লগ আউট',
    govPill: 'ভারত সরকার · জাতীয় স্বাস্থ্য কর্তৃপক্ষ',
    heroTitle: 'সেহত কেন্দ্রে আপনাকে স্বাগতম',
    heroSubtitle: 'সর্বজনীন ডিজিটাল স্বাস্থ্য রেকর্ড ও নাগরিক গেটওয়ে',
    heroDesc: 'একটি নিরাপদ, নাগরিক-বান্ধব পোর্টাল যা আয়ুষ্মান ভারত ডিজিটাল মিশনের (এবিডিএম) আওতায় আপনার স্বাস্থ্যযাত্রাকে ডাক্তার, হাসপাতাল ও ওয়েলনেস পরিষেবার সঙ্গে যুক্ত করে।',
    getStarted: 'শুরু করুন →',
    selectLangBtn: '🌐 পছন্দের ভাষা নির্বাচন করুন',
    trust1: '✓ ১০০% বিনামূল্যে জনস্বাস্থ্য পরিষেবা',
    trust2: '🔒 এবিডিএম ও ডিশা সম্মত সম্মতি সুরক্ষা',
    trust3: '🗣 ৬টি আঞ্চলিক ভাষায় ভয়েস সহায়তা'
  },
  mr: {
  phone: '📞 1800-11-4477 (टोल फ्री)',
  govLine: 'भारत सरकार · राष्ट्रीय आरोग्य प्राधिकरण',
  brandSub: 'राष्ट्रीय डिजिटल आरोग्य प्रवेशद्वार',
  signInBtn: '👤 नागरिक साइन-इन',
  navHome: '▦ रुग्ण मुख्यपृष्ठ',
  guestPill: '☀ अतिथी नागरिक',
  navLogout: 'लॉगआउट',
  govPill: 'भारत सरकार · राष्ट्रीय आरोग्य प्राधिकरण',
  heroTitle: 'SEHAT KENDRA मध्ये आपले स्वागत आहे',
  heroSubtitle: 'सार्वत्रिक डिजिटल आरोग्य नोंदी आणि नागरिक प्रवेशद्वार',
  heroDesc: 'आयुष्मान भारत डिजिटल मिशन (ABDM) अंतर्गत डॉक्टर, रुग्णालये आणि आरोग्य सेवांशी तुमचा आरोग्य प्रवास जोडण्यासाठी तयार केलेले सुरक्षित आणि नागरिकांसाठी सुलभ पोर्टल.',
  getStarted: 'सुरुवात करा →',
  selectLangBtn: '🌐 पसंतीची भाषा निवडा',
  trust1: '✓ १००% मोफत सार्वजनिक आरोग्य सेवा',
  trust2: '🔒 ABDM आणि DISHA अनुरूप संमती संरक्षण',
  trust3: '🗣 ६ प्रादेशिक भाषांमध्ये आवाज सहाय्य'
},
ta: {
  phone: '📞 1800-11-4477 (கட்டணமில்லா)',
  govLine: 'இந்திய அரசு · தேசிய சுகாதார ஆணையம்',
  brandSub: 'தேசிய டிஜிட்டல் சுகாதார நுழைவாயில்',
  signInBtn: '👤 குடிமக்கள் உள்நுழைவு',
  navHome: '▦ நோயாளர் முகப்புப் பக்கம்',
  guestPill: '☀ விருந்தினர் குடிமகன்',
  navLogout: 'வெளியேறு',
  govPill: 'இந்திய அரசு · தேசிய சுகாதார ஆணையம்',
  heroTitle: 'SEHAT KENDRA-க்கு உங்களை வரவேற்கிறோம்',
  heroSubtitle: 'உலகளாவிய டிஜிட்டல் சுகாதாரப் பதிவுகள் மற்றும் குடிமக்கள் நுழைவாயில்',
  heroDesc: 'ஆயுஷ்மான் பாரத் டிஜிட்டல் மிஷன் (ABDM) திட்டத்தின் கீழ், உங்கள் சுகாதாரப் பயணத்தை மருத்துவர்கள், மருத்துவமனைகள் மற்றும் நலவாழ்வு சேவைகளுடன் இணைக்கும் வகையில் வடிவமைக்கப்பட்ட பாதுகாப்பான மற்றும் குடிமக்களுக்கு ஏற்ற இணையதளம்.',
  getStarted: 'தொடங்குங்கள் →',
  selectLangBtn: '🌐 விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
  trust1: '✓ 100% இலவச பொது சுகாதார சேவை',
  trust2: '🔒 ABDM மற்றும் DISHA இணக்கமான ஒப்புதல் பாதுகாப்பு',
  trust3: '🗣 6 பிராந்திய மொழிகளில் குரல் உதவி'
},
or: {
  phone: '📞 1800-11-4477 (ଟୋଲ୍ ଫ୍ରି)',
  govLine: 'ଭାରତ ସରକାର · ଜାତୀୟ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରାଧିକରଣ',
  brandSub: 'ଜାତୀୟ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ଦ୍ୱାର',
  signInBtn: '👤 ନାଗରିକ ସାଇନ୍-ଇନ୍',
  navHome: '▦ ରୋଗୀ ମୁଖ୍ୟପୃଷ୍ଠା',
  guestPill: '☀ ଅତିଥି ନାଗରିକ',
  navLogout: 'ଲଗ୍ ଆଉଟ୍',
  govPill: 'ଭାରତ ସରକାର · ଜାତୀୟ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରାଧିକରଣ',
  heroTitle: 'SEHAT KENDRAକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ',
  heroSubtitle: 'ସାର୍ବଜନୀନ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ଏବଂ ନାଗରିକ ଦ୍ୱାର',
  heroDesc: 'ଆୟୁଷ୍ମାନ ଭାରତ ଡିଜିଟାଲ୍ ମିଶନ୍ (ABDM) ଅଧୀନରେ ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ଯାତ୍ରାକୁ ଡାକ୍ତର, ହସ୍ପିଟାଲ୍ ଏବଂ ସୁସ୍ଥତା ସେବା ସହିତ ଯୋଡ଼ିବା ପାଇଁ ନିର୍ମିତ ଏକ ସୁରକ୍ଷିତ ଏବଂ ନାଗରିକ-ଅନୁକୂଳ ପୋର୍ଟାଲ୍।',
  getStarted: 'ଆରମ୍ଭ କରନ୍ତୁ →',
  selectLangBtn: '🌐 ପସନ୍ଦର ଭାଷା ଚୟନ କରନ୍ତୁ',
  trust1: '✓ 100% ମାଗଣା ସାର୍ବଜନୀନ ସ୍ୱାସ୍ଥ୍ୟ ସେବା',
  trust2: '🔒 ABDM ଏବଂ DISHA ଅନୁକୂଳ ସମ୍ମତି ସୁରକ୍ଷା',
  trust3: '🗣 6ଟି ଆଞ୍ଚଳିକ ଭାଷାରେ ଭଏସ୍ ସହାୟତା'
}
};
// Maps the full language names used on the "screen-language" cards to the
// short codes used by the header quick-select and translations dictionary.
const langCodeMap = { English:'en', Hindi:'hi', Bengali:'bn', Tamil:'ta', Marathi:'mr', Odia:'or' };
const langNameMap = {
  en: 'English',
  hi: 'Hindi',
  bn: 'Bengali',
  ta: 'Tamil',
  mr: 'Marathi',
  or: 'Odia'
};

function applyLanguage(lang){
  const dict = translations[lang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(dict[key] !== undefined) el.textContent = dict[key];
  });
  document.documentElement.setAttribute('lang', lang);
  try{ localStorage.setItem('sehatkendra-lang', lang); }catch(e){}
}

function quickSelectLanguage(lang, el){
  document.querySelectorAll('.utility-right .lang-link').forEach(l => l.classList.remove('active'));
  if(el) el.classList.add('active');
  applyLanguage(lang);
  // Keep the full "Select Your Language" screen in sync with the header pick
  const fullName = langNameMap[lang];
  const card = fullName ? document.querySelector('.lang-card[data-lang="' + fullName + '"]') : null;
  if(card) selectLanguage(card, true);
}

(function initLanguage(){
  const defaultLanguage = 'en';

  document.addEventListener('DOMContentLoaded', () => {
    // Always start the app in English
    applyLanguage(defaultLanguage);

    // Set English as the active header language
    document.querySelectorAll('.utility-right .lang-link').forEach(l => {
      l.classList.toggle('active', l.dataset.lang === defaultLanguage);
    });

    // Keep the language-selection card synced
    const englishCard = document.querySelector('.lang-card[data-lang="English"]');
    if (englishCard) {
      selectLanguage(englishCard, true);
    }
  });
})();

// ============ THEME ============
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeToggleBtn');
  if(btn) btn.textContent = theme === 'dark' ? '☀' : '🌙';
  try{ localStorage.setItem('sehatkendra-theme', theme); }catch(e){}
}
function toggleTheme(){
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}
(function initTheme(){
  let saved = 'light';
  try{ saved = localStorage.getItem('sehatkendra-theme') || 'light'; }catch(e){}
  document.addEventListener('DOMContentLoaded', () => applyTheme(saved));
})();

// ============ NAVIGATION ============
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if(target){ target.classList.add('active'); }
  window.scrollTo({top:0, behavior:'smooth'});
  if(id === 'screen-dashboard') renderDashboard();
  if(id === 'screen-book-confirm') renderBookingConfirm();
  if(id === 'screen-caresse-dashboard' && typeof renderCaresseDashboard === 'function') renderCaresseDashboard();
  if(id === 'screen-caresse-accessibility' && typeof renderCaresseAccessibility === 'function') renderCaresseAccessibility();
  if(id === 'screen-caresse-learn' && typeof renderCaresseLearn === 'function') renderCaresseLearn();
  const isCaresse = id.indexOf('screen-caresse-') === 0 && id !== 'screen-caresse-register' && id !== 'screen-caresse-choice';
  const nav = document.getElementById('caresseBottomNav');
  if(nav) nav.classList.toggle('hidden', !isCaresse);
  const logo=document.getElementById('brandLogo'); const brand=document.querySelector('.brand-en'); const sub=document.querySelector('.brand-sub');
  if(logo) logo.src=isCaresse ? 'caresse-logo.png' : 'logo.png';
  if(brand) brand.innerHTML=isCaresse ? 'CARESSE' : 'SEHAT KENDRA <span class=\"brand-hi\">सेहत केंद्र</span>';
  if(sub) sub.textContent=isCaresse ? 'Designed for Dyslexic & ADHD Minds' : 'National Digital Health Gateway';
  if(isCaresse && typeof updateCaresseNav === 'function') updateCaresseNav(id);
}

// Login completes: reveal the logged-in header nav
function enterApp(nextScreenId){
  state.loggedIn = true;
  const pill=document.getElementById('guestPill'); if(pill) pill.textContent='☀ '+(state.patientName||'Citizen');
  document.getElementById('preAuthActions').classList.add('hidden');
  document.getElementById('postAuthNav').classList.remove('hidden');
  showScreen(nextScreenId);
}

function logout(){
  state.loggedIn = false;
  document.getElementById('preAuthActions').classList.remove('hidden');
  document.getElementById('postAuthNav').classList.add('hidden');
  showScreen('screen-landing');
}

function goHome(){
  if(state.loggedIn){ showScreen('screen-dashboard'); }
}

// ============ LANGUAGE ============
// fromQuickSelect=true when called by quickSelectLanguage(), to avoid an infinite loop
function selectLanguage(el, fromQuickSelect){
  document.querySelectorAll('.lang-card').forEach(c => {
    c.classList.remove('selected');
    const pill = c.querySelector('.selected-pill');
    if(pill) pill.remove();
  });
  el.classList.add('selected');
  const pill = document.createElement('span');
  pill.className = 'selected-pill';
  pill.textContent = 'Selected';
  el.appendChild(pill);

  if(!fromQuickSelect){
    const code = langCodeMap[el.dataset.lang];
    if(code){
      applyLanguage(code);
      document.querySelectorAll('.utility-right .lang-link').forEach(l => l.classList.toggle('active', l.dataset.lang === code));
    }
  }
}

// ============ QUICK LOGIN PATHS ============
function loginAsSamplePatient(){
  state.patientName = 'Smt. Ananya Sen';
  state.abhaId = '91-4421-8890-1204';
  state.conditions = ['Hypertension', 'Diabetes'];
  state.medicines = ['Tab. Metformin 500mg', 'Tab. Amlodipine 5mg'];
  state.allergies = ['Penicillin (mild rash)'];
  enterApp('screen-dashboard');
}
function loginAsGuest(){
  state.patientName = 'Guest Citizen';
  state.abhaId = 'GUEST-0000-0000-0000';
  state.conditions = [];
  state.medicines = [];
  state.allergies = [];
  enterApp('screen-dashboard');
}
function verifyAbhaOtp(){
  loginAsSamplePatient();
}

// ============ REGISTRATION (3 steps) ============
let regStep = 1;
const REG_TOTAL_STEPS = 3;
function goToRegStep(step){
  regStep = step;
  document.querySelectorAll('.reg-step').forEach(s => s.classList.remove('active'));
  document.getElementById('regStep' + step).classList.add('active');
  document.getElementById('regStepLabel').textContent = 'Step ' + step + ' of ' + REG_TOTAL_STEPS + ': ' +
    (step === 1 ? 'Identity Setup' : step === 2 ? 'ABHA & Emergency Contact' : 'Review & Consent');
  if(step === 3) renderRegReview();
}
function regNext(fromStep){
  if(fromStep === 1){
    const name = document.getElementById('regName').value.trim();
    const mobile = document.getElementById('regMobile').value.trim();
    if(!name || !mobile){ alert('Please fill in your full name and mobile number.'); return; }
  }
  goToRegStep(fromStep + 1);
}
function regBack(fromStep){
  goToRegStep(fromStep - 1);
}
function renderRegReview(){
  const g = id => (document.getElementById(id) ? document.getElementById(id).value : '');
  const box = document.getElementById('regReviewBox');
  box.innerHTML = `
    <p><strong>Name:</strong> ${g('regName') || '—'}</p>
    <p><strong>Date of Birth:</strong> ${g('regDob') || '—'} &nbsp; <strong>Gender:</strong> ${g('regGender')}</p>
    <p><strong>Mobile:</strong> ${g('regMobile') || '—'} &nbsp; <strong>Email:</strong> ${g('regEmail') || '—'}</p>
    <p><strong>City / Town:</strong> ${g('regCity') || '—'} &nbsp; <strong>State:</strong> ${g('regState')}</p>
    <p><strong>ABHA Number:</strong> ${g('regAbha') || 'Not linked — will be created'}</p>
    <p><strong>Emergency Contact:</strong> ${g('regEmergencyName') || '—'} (${g('regEmergencyRelation') || '—'}), ${g('regEmergencyPhone') || '—'}</p>
  `;
}
function submitRegistration(){
  const consent = document.getElementById('regConsent');
  if(!consent.checked){ alert('Please provide consent to continue.'); return; }
  state.patientName = document.getElementById('regName').value.trim() || 'New Patient';
  state.abhaId = document.getElementById('regAbha').value.trim() || 'PENDING-ABHA-LINK';
  state.registration.emergencyName = document.getElementById('regEmergencyName').value.trim();
  state.registration.emergencyPhone = document.getElementById('regEmergencyPhone').value.trim();
  state.registration.emergencyRelation = document.getElementById('regEmergencyRelation').value.trim();
  state.conditions = [];
  state.medicines = [];
  state.allergies = [];
  regStep = 1;
  goToRegStep(1);
  document.getElementById('regForm').reset();
  startQuestionnaire();
}

// ============ CARESSE REGISTRATION ============
let caresseRegStep = 1;
function showCaresseRegStep(step){
  caresseRegStep = step;
  document.querySelectorAll('.caresse-reg-step').forEach(s=>s.classList.remove('active'));
  const target=document.getElementById('caresseRegStep'+step); if(target) target.classList.add('active');
  const labels={1:'About You',2:'Support Preferences',3:'Review & Save'};
  const label=document.getElementById('caresseRegStepLabel'); if(label) label.textContent='Step '+step+' of 3: '+labels[step];
  const progress=document.getElementById('caresseRegProgress'); if(progress) progress.style.width=(step/3*100)+'%';
  if(step===3) renderCaresseReview();
}
function caresseRegNext(from){
  if(from===1){
    const name=document.getElementById('cRegName').value.trim();
    const mobile=document.getElementById('cRegMobile').value.trim();
    if(!name || !mobile){ alert('Please enter your name and mobile number.'); return; }
  }
  if(from===2 && !document.querySelector('#cRegSupport .choice-card.selected')){ alert('Please choose a support profile.'); return; }
  showCaresseRegStep(from+1);
}
function caresseRegBack(from){ showCaresseRegStep(from-1); }
function selectCaresseChoice(el, groupId){
  document.querySelectorAll('#'+groupId+' .choice-card').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
}
function renderCaresseReview(){
  const support=document.querySelector('#cRegSupport .choice-card.selected');
  const v=id=>document.getElementById(id)?.value || '—';
  const box=document.getElementById('caresseReview'); if(!box) return;
  box.innerHTML=`<div><span>Name</span><strong>${v('cRegName')}</strong></div><div><span>Preferred name</span><strong>${v('cRegNickname')}</strong></div><div><span>Support profile</span><strong>${support?.dataset.value || '—'}</strong></div><div><span>Reading style</span><strong>${v('cRegReading')}</strong></div><div><span>Focus support</span><strong>${v('cRegFocus')}</strong></div>`;
}
function submitCaresseRegistration(){
  const consent=document.getElementById('cRegConsent'); if(!consent.checked){ alert('Please confirm the profile-saving consent.'); return; }
  const support=document.querySelector('#cRegSupport .choice-card.selected');
  const profile={name:document.getElementById('cRegName').value.trim(),nickname:document.getElementById('cRegNickname').value.trim(),mobile:document.getElementById('cRegMobile').value.trim(),support:support?.dataset.value||'Both',reading:document.getElementById('cRegReading').value,focus:document.getElementById('cRegFocus').value,createdAt:new Date().toISOString()};
  try{localStorage.setItem('caresse-profile',JSON.stringify(profile));}catch(e){}
  state.patientName=profile.nickname||profile.name||'Caresse User';
  state.registration.caresse=profile;
  state.loggedIn=true;
  document.getElementById('preAuthActions').classList.add('hidden'); document.getElementById('postAuthNav').classList.remove('hidden');
  showScreen('screen-caresse-choice');
}
function loadCaresseProfile(){
  try{ const raw=localStorage.getItem('caresse-profile'); if(raw){ state.registration.caresse=JSON.parse(raw); state.patientName=state.registration.caresse.nickname||state.registration.caresse.name||state.patientName; return true; }}catch(e){} return false;
}
function showCaresseScreen(id){ showScreen(id); }

// ============ HEALTH QUESTIONNAIRE (8 sections) ============
const questionnaireData = [
  {
    title: '1. Basic Health Metrics',
    body: `
      <div class="form-row form-row--3">
        <div class="field"><label>Height (cm)</label><input type="text" placeholder="e.g. 162 cm or 'Not Sure'"></div>
        <div class="field"><label>Weight (kg)</label><input type="text" placeholder="e.g. 64 kg or 'Not Sure'"></div>
        <div class="field"><label>Blood Group</label>
          <select><option>O Positive (O+)</option><option>O Negative (O-)</option><option>A Positive (A+)</option><option>A Negative (A-)</option><option>B Positive (B+)</option><option>B Negative (B-)</option><option>AB Positive (AB+)</option><option>AB Negative (AB-)</option><option>Not Sure</option></select>
        </div>
      </div>`
  },
  {
    title: '2. Existing Medical Conditions',
    body: `
      <div class="check-grid">
        <label><input type="checkbox">Diabetes</label>
        <label><input type="checkbox">Hypertension</label>
        <label><input type="checkbox">Asthma</label>
        <label><input type="checkbox">Heart Condition</label>
        <label><input type="checkbox">Thyroid Disorder</label>
        <label><input type="checkbox">None of the above</label>
      </div>`
  },
  {
    title: '3. Current Medications',
    body: `
      <div class="field"><label>List any medicines you currently take</label>
      <textarea placeholder="e.g. Tab. Metformin 500mg — once daily after breakfast"></textarea></div>`
  },
  {
    title: '4. Known Allergies',
    body: `
      <div class="field"><label>Food, drug, or environmental allergies</label>
      <input type="text" placeholder="e.g. Penicillin (mild rash)"></div>`
  },
  {
    title: '5. Family Medical History',
    body: `
      <div class="check-grid">
        <label><input type="checkbox">Diabetes</label>
        <label><input type="checkbox">Hypertension</label>
        <label><input type="checkbox">Heart Disease</label>
        <label><input type="checkbox">Cancer</label>
        <label><input type="checkbox">None known</label>
      </div>`
  },
  {
    title: '6. Lifestyle Habits',
    body: `
      <div class="form-row">
        <div class="field"><label>Smoking</label><select><option>Never</option><option>Occasionally</option><option>Regularly</option><option>Quit</option></select></div>
        <div class="field"><label>Alcohol Consumption</label><select><option>Never</option><option>Occasionally</option><option>Regularly</option></select></div>
      </div>
      <div class="field"><label>Physical Activity</label><select><option>Sedentary</option><option>Light (1-2x/week)</option><option>Moderate (3-4x/week)</option><option>Active (5x+/week)</option></select></div>`
  },
  {
    title: '7. Emergency Contact',
    body: `
      <div class="form-row">
        <div class="field"><label>Contact Name</label><input type="text" placeholder="Full name"></div>
        <div class="field"><label>Relationship</label><input type="text" placeholder="e.g. Spouse, Parent"></div>
      </div>
      <div class="field"><label>Phone Number</label><input type="text" placeholder="10-digit mobile number"></div>`
  },
  {
    title: '8. Consent & Review',
    body: `
      <div class="notice-box">ⓘ This questionnaire aggregates records for consultation. It is NOT a medical diagnosis system.</div>
      <label class="check-row"><input type="checkbox" id="qConsent"> I confirm the information provided is accurate to the best of my knowledge and consent to it being shared with my treating doctor under ABDM guidelines.</label>`
  }
];
let qStep = 0;
function startQuestionnaire(){
  qStep = 0;
  showScreen('screen-questionnaire');
  renderQuestionnaireStep();
}
function renderQuestionnaireStep(){
  const total = questionnaireData.length;
  const pct = Math.round(((qStep + 1) / total) * 100);
  document.getElementById('qSectionLabel').textContent = 'Section ' + (qStep + 1) + ' of ' + total;
  document.getElementById('qPercentLabel').textContent = pct + '% Complete';
  document.getElementById('qProgressFill').style.width = pct + '%';
  const section = questionnaireData[qStep];
  document.getElementById('qSectionTitle').textContent = section.title;
  document.getElementById('qSectionBody').innerHTML = section.body;
  document.getElementById('qBackBtn').classList.toggle('hidden', qStep === 0);
  document.getElementById('qNextBtn').textContent = (qStep === total - 1) ? 'Finish & View Dashboard' : 'Continue →';
}
function questionnaireNext(){
  if(qStep === questionnaireData.length - 1){
    const consent = document.getElementById('qConsent');
    if(consent && !consent.checked){ alert('Please confirm consent to continue.'); return; }
    enterApp('screen-dashboard');
    return;
  }
  qStep++;
  renderQuestionnaireStep();
}
function questionnaireBack(){
  if(qStep === 0) return;
  qStep--;
  renderQuestionnaireStep();
}

// ============ DASHBOARD ============
function renderDashboard(){
  document.getElementById('dashPatientName').textContent = 'Welcome, ' + state.patientName;
  document.getElementById('dashAbhaLinked').textContent = 'ABHA Linked: ' + (state.abhaId || 'Not linked');

  const summaryCard = document.getElementById('dashHealthSummary');

  if(state.conditions.length === 0 && state.medicines.length === 0){
    summaryCard.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🩺</div>
        <p>No health records yet. Complete your questionnaire to build your health profile.</p>
        <button class="btn btn-outline" onclick="startQuestionnaire()">Complete Questionnaire</button>
      </div>`;
  } else {
    summaryCard.innerHTML = `
      <div class="summary-block">
        <div class="summary-label">EXISTING CONDITIONS</div>
        ${state.conditions.map(c => `<span class="tag tag--blue">${c}</span>`).join(' ')}
      </div>
      <div class="summary-block">
        <div class="summary-label">CURRENT MEDICINES (${state.medicines.length})</div>
        <p style="margin:0;font-size:13px;">${state.medicines.join(', ') || '—'}</p>
      </div>
      <div class="summary-block">
        <div class="summary-label">KNOWN ALLERGIES</div>
        <p style="margin:0;font-size:13px;">${state.allergies.join(', ') || 'None recorded'}</p>
      </div>
      <button class="btn btn-outline btn-block" onclick="startQuestionnaire()">↻ Update Medical History</button>`;
  }

  const upcoming = document.getElementById('dashUpcoming');
  if(state.booking.confirmed){
    upcoming.innerHTML = `
      <div class="summary-block-box">
        <p><strong>${state.booking.doctor}</strong> (${state.booking.doctorRole})</p>
        <p>${state.booking.mode} — ${state.booking.date || 'Tomorrow'}, ${state.booking.slot}</p>
      </div>
      <button class="btn btn-outline btn-block" onclick="showScreen('screen-book-1')">+ Schedule Another</button>`;
  } else {
    upcoming.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <p>No consultations scheduled currently. You can book an OPD slot or eSanjeevani tele-consultation below.</p>
        <button class="btn btn-primary" onclick="showScreen('screen-book-1')">📅 Book Appointment Now</button>
      </div>`;
  }
}

// ============ BOOKING FLOW ============
function selectPathway(kind, el){
  state.booking.pathway = kind;
  document.querySelectorAll('.pathway-card').forEach(c => {
    c.classList.remove('selected');
    const btn = c.querySelector('.btn');
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
  });
  el.classList.add('selected');
  const btn = el.querySelector('.btn');
  btn.classList.remove('btn-outline');
  btn.classList.add('btn-primary');
}

function goToDoctorStep(){
  if(state.booking.pathway === 'ayurveda'){
    state.booking.doctor = 'Vaidya Dr. Rajesh Sharma';
    state.booking.doctorRole = 'Kayachikitsa (Internal Medicine & Joint Care)';
    showScreen('screen-book-2-ayurveda');
  } else {
    state.booking.doctor = 'Dr. Priya Sharma';
    state.booking.doctorRole = 'General Medicine';
    showScreen('screen-book-2-general');
  }
}

function goBackFromStep3(){
  showScreen(state.booking.pathway === 'ayurveda' ? 'screen-book-2-ayurveda' : 'screen-book-2-general');
}

function selectDoctor(el, name, role){
  state.booking.doctor = name;
  state.booking.doctorRole = role;
  const grid = el.closest('.doctor-grid');
  grid.querySelectorAll('.doctor-card').forEach(c => {
    c.classList.remove('selected');
    const btn = c.querySelector('.btn');
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
    btn.textContent = 'Select';
  });
  el.classList.add('selected');
  const btn = el.querySelector('.btn');
  btn.classList.remove('btn-outline');
  btn.classList.add('btn-primary');
  btn.textContent = 'Selected';
}

function selectSlot(el){
  state.booking.slot = el.textContent.trim();
  const grid = el.closest('.slot-grid');
  grid.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
}

function goToConsent(){
  state.booking.mode = document.getElementById('consultMode').value;
  state.booking.date = document.getElementById('consultDate').value;
  showScreen('screen-book-consent');
  renderBookingSummary();
}

function renderBookingSummary(){
  document.getElementById('consentSummary').innerHTML = `
    <p><strong>Doctor:</strong> ${state.booking.doctor} — ${state.booking.doctorRole}</p>
    <p><strong>Mode:</strong> ${state.booking.mode}</p>
    <p><strong>Date & Time:</strong> ${state.booking.date}, ${state.booking.slot}</p>`;

  const select = document.getElementById('rxAttachSelect');
  if(select){
    const options = ['<option value="">None — don\'t attach a prescription</option>']
      .concat(state.prescriptions.map(rx => `<option value="${rx.id}">${rx.date} — ${rx.diagnosis || 'Symptom Record'} (${rx.source})</option>`));
    select.innerHTML = options.join('');
    select.value = state.booking.attachedPrescriptionId || '';
  }
}

function confirmBooking(){
  const consent = document.getElementById('bookingConsent');
  if(!consent.checked){ alert('Please consent to share your health record with the doctor to proceed.'); return; }
  const select = document.getElementById('rxAttachSelect');
  state.booking.attachedPrescriptionId = select ? select.value : '';
  state.booking.confirmed = true;
  showScreen('screen-book-confirm');
}

function renderBookingConfirm(){
  document.getElementById('confirmDoctor').textContent = state.booking.doctor + ' (' + state.booking.doctorRole + ')';
  let details = state.booking.mode + ' — ' + state.booking.date + ', ' + state.booking.slot;
  if(state.booking.attachedPrescriptionId){
    const rx = state.prescriptions.find(r => r.id === state.booking.attachedPrescriptionId);
    if(rx) details += ' · 📋 Prescription attached (' + rx.date + ')';
  }
  document.getElementById('confirmSlot').textContent = details;
}

// ============ AYUSH WELLNESS TABS ============
const wellnessData = [
  {
    tag: 'Lifestyle Protocol',
    title: 'Daily Wellness (Dinacharya)',
    sub: 'Traditional Daily Rhythm for Vital Balance',
    desc: 'Harmonize bodily rhythms through disciplined waking hours, mindful hydration, and gentle morning sensory cleansing.',
    items: [
      { h: 'Brahma Muhurta (Mindful Rising)', p: 'Waking approximately 45 minutes before sunrise aligns mental clarity with nature\u2019s calmest atmospheric cycle.' },
      { h: 'Ushapan (Morning Warm Water)', p: 'Drinking 1\u20132 glasses of room-temperature or lukewarm water upon waking gently awakens the digestive tract (Agni).' },
      { h: 'Abhyanga (Self-Oil Massage)', p: 'Light self-massage using sesame or coconut oil before bathing calms the nervous system and supports joint lubrication.' }
    ],
    note: 'Note: Dinacharya is a preventive lifestyle guideline to support well-being. It does not replace clinical therapy for illness.',
    cta: 'Discuss with an Ayurveda Vaidya'
  },
  {
    tag: 'Lifestyle Protocol',
    title: 'Sleep & Restful Rejuvenation (Nidra)',
    sub: 'Restoring the Body\u2019s Natural Repair Cycle',
    desc: 'Consistent, well-timed rest supports hormonal balance, tissue repair, and mental steadiness.',
    items: [
      { h: 'Fixed Sleep Window', p: 'Sleeping and waking at the same time daily stabilizes the body\u2019s internal clock.' },
      { h: 'Screen-Free Wind Down', p: 'Avoiding bright screens for 30 minutes before bed supports natural melatonin release.' },
      { h: 'Warm Milk with Nutmeg', p: 'A traditional bedtime drink believed to gently calm the nervous system before sleep.' }
    ],
    note: 'Note: Persistent insomnia should be discussed with a qualified physician, not managed through lifestyle guidance alone.',
    cta: 'Discuss with an Ayurveda Vaidya'
  },
  {
    tag: 'Movement Protocol',
    title: 'Yoga & Therapeutic Asanas',
    sub: 'Gentle Postures for Joint Ease and Spinal Health',
    desc: 'Slow, mindful movement supports flexibility, circulation, and musculoskeletal comfort.',
    items: [
      { h: 'Tadasana (Mountain Pose)', p: 'Improves posture awareness and gently engages the spine and core.' },
      { h: 'Marjariasana (Cat-Cow)', p: 'Encourages spinal mobility and can ease mild lower-back stiffness.' },
      { h: 'Vrikshasana (Tree Pose)', p: 'Builds balance and lower-limb stability at a comfortable pace.' }
    ],
    note: 'Note: Consult a doctor before starting new postures if you have an existing joint or cardiac condition.',
    cta: 'Discuss with an Ayurveda Vaidya'
  },
  {
    tag: 'Breathing Protocol',
    title: 'Breathing Practices (Pranayama)',
    sub: 'Regulating the Breath to Calm the Mind',
    desc: 'Structured breathing exercises are used traditionally to support stress downregulation and focus.',
    items: [
      { h: 'Nadi Shodhana (Alternate Nostril)', p: 'A slow, alternating breath pattern associated with a calmer nervous system.' },
      { h: 'Bhramari (Humming Bee Breath)', p: 'A gentle humming exhale often used to ease tension and mental fatigue.' },
      { h: 'Deergha Swasam (Deep Breathing)', p: 'Slow, full breaths that encourage relaxed, diaphragmatic breathing.' }
    ],
    note: 'Note: Those with respiratory conditions should learn these practices under supervision.',
    cta: 'Discuss with an Ayurveda Vaidya'
  },
  {
    tag: 'Nutrition Protocol',
    title: 'Mindful Nutrition (Ahara)',
    sub: 'Eating in Alignment with Digestive Strength',
    desc: 'Traditional dietary guidance emphasizes warm, freshly prepared meals eaten at regular times.',
    items: [
      { h: 'Regular Meal Timing', p: 'Eating at consistent times is believed to support steady digestive fire (Agni).' },
      { h: 'Warm, Freshly Cooked Food', p: 'Favoured over cold or heavily processed food for easier digestion.' },
      { h: 'Mindful, Unhurried Eating', p: 'Eating without distraction supports better digestion and satiety awareness.' }
    ],
    note: 'Note: This is general lifestyle guidance and not a prescribed diet plan for any medical condition.',
    cta: 'Discuss with an Ayurveda Vaidya'
  }
];

function renderWellness(index){
  const d = wellnessData[index];
  const panel = document.getElementById('wellnessPanel');
  panel.innerHTML = `
    <div class="step-row">
      <span class="eyebrow-pill">${d.tag}</span>
      <button class="icon-btn" onclick="speak('${d.title}')">\u{1F50A} Listen</button>
    </div>
    <h3>${d.title}</h3>
    <p class="wellness-sub">${d.sub}</p>
    <p class="wellness-desc">${d.desc}</p>
    <div class="wellness-grid">
      ${d.items.map(it => `
        <div class="wellness-item">
          <h5>${it.h}</h5>
          <p>${it.p}</p>
        </div>`).join('')}
    </div>
    <p class="wellness-note">${d.note}</p>
    <button class="btn btn-outline" onclick="showScreen('screen-book-1')">${d.cta} \u2192</button>
  `;
}

function selectWellnessTab(el, index){
  document.querySelectorAll('.tab-row .tab').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  renderWellness(index);
}

function openAyush(){
  showScreen('screen-ayush');
  renderWellness(0);
  const firstTab = document.querySelector('#screen-ayush .tab-row .tab');
  document.querySelectorAll('#screen-ayush .tab-row .tab').forEach(t => t.classList.remove('selected'));
  if(firstTab) firstTab.classList.add('selected');
}

// ============ CARE AI CHAT (mock) ============
const careAIResponses = {
  'Explain my medical condition': 'Based on your records, you have Hypertension and Diabetes. Hypertension means your blood pressure stays higher than a healthy range, and Diabetes means your body has trouble regulating blood sugar. Managing both usually involves medication, diet, and regular monitoring \u2014 your doctor can tailor this to you.',
  'Help me understand my medicine': 'You are currently listed on Tab. Metformin 500mg, which helps manage blood sugar levels, and Tab. Amlodipine 5mg, which helps relax blood vessels to lower blood pressure. Always take these as prescribed and mention your Penicillin allergy to any new doctor.',
  'General wellness guidance': 'A few general habits that support hypertension and diabetes management: consistent meal timing, reduced salt and refined sugar, daily light movement like walking, and regular sleep. Small, steady changes tend to help more than drastic short-term ones.',
  'When should I consult a doctor?': 'You should book a consultation if you notice new or worsening symptoms, missed medication doses affecting you, or if it has been a while since your last check-up. For anything urgent or severe, please visit the nearest hospital OPD directly rather than waiting.'
};

function askCareAI(question){
  addChatBubble(question, true);
  setTimeout(() => {
    const answer = careAIResponses[question] || 'That is a general wellness topic \u2014 I recommend discussing specifics with your doctor during a consultation. Would you like me to help you book one?';
    addChatBubble(answer, false);
  }, 400);
}

function sendChat(){
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if(!text) return;
  addChatBubble(text, true);
  input.value = '';
  setTimeout(() => {
    addChatBubble('Thanks for sharing that. I can explain general terms and wellness guidance, but for anything specific to your case, please book a consultation so a doctor can review it properly.', false);
  }, 400);
}

function addChatBubble(text, isUser){
  const body = document.getElementById('chatBody');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble' + (isUser ? ' user' : '');
  const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  bubble.innerHTML = `<p>${text}</p><div class="chat-meta"><span>${time}</span>${isUser ? '' : '<button class="btn-link-small" onclick="speak(this.parentElement.previousElementSibling.textContent)">\u{1F50A} Listen</button>'}</div>`;
  body.appendChild(bubble);
  body.scrollTop = body.scrollHeight;
}

// ============ DIGITAL PRESCRIPTION CENTER ============

// -- storage --
function loadPrescriptions(){
  try{
    const raw = localStorage.getItem('sehatkendra-prescriptions');
    state.prescriptions = raw ? JSON.parse(raw) : [];
  }catch(e){ state.prescriptions = []; }
}
function savePrescriptions(){
  try{ localStorage.setItem('sehatkendra-prescriptions', JSON.stringify(state.prescriptions)); }catch(e){}
}

let activePrescriptionId = null;

function openPrescriptionCenter(){
  showScreen('screen-prescription');
  renderSavedPrescriptions();
}

function renderSavedPrescriptions(){
  const wrap = document.getElementById('rxSavedList');
  if(!state.prescriptions.length){
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>No digital prescriptions yet. Scan a paper prescription or speak your symptoms above to create one.</p></div>`;
    return;
  }
  wrap.innerHTML = state.prescriptions.slice().reverse().map(rx => `
    <div class="rx-list-item" onclick="viewPrescription('${rx.id}')">
      <div>
        <strong>${rx.diagnosis || 'Symptom Record'}</strong>
        <p class="muted">${rx.date} · ${rx.medicines.length} medicine(s) · ${rx.symptoms || '—'}</p>
      </div>
      <span class="rx-source-tag">${rx.source}</span>
    </div>`).join('');
}

// -- 1. SCAN / UPLOAD (simulated OCR) --
const RX_SCAN_TEMPLATES = [
  {
    diagnosis: 'Viral Fever with Body Ache',
    symptoms: 'Fever (2 days), body ache, mild headache',
    medicines: [
      { name: 'Tab. Paracetamol 500mg', dosage: '1 tablet', frequency: 'Thrice daily after food', duration: '3 days' },
      { name: 'ORS Sachets', dosage: '1 sachet in 1L water', frequency: 'As needed', duration: '3 days' }
    ],
    notes: 'Rest, adequate fluids. Return if fever persists beyond 3 days.'
  },
  {
    diagnosis: 'Acute Gastritis',
    symptoms: 'Stomach pain, mild acidity after meals',
    medicines: [
      { name: 'Tab. Pantoprazole 40mg', dosage: '1 tablet', frequency: 'Once daily before breakfast', duration: '5 days' },
      { name: 'Syp. Antacid', dosage: '10ml', frequency: 'After meals, thrice daily', duration: '5 days' }
    ],
    notes: 'Avoid spicy and oily food. Eat at regular intervals.'
  },
  {
    diagnosis: 'Upper Respiratory Tract Infection',
    symptoms: 'Cough, cold, mild sore throat',
    medicines: [
      { name: 'Tab. Cetirizine 10mg', dosage: '1 tablet', frequency: 'Once at night', duration: '5 days' },
      { name: 'Syp. Cough Expectorant', dosage: '10ml', frequency: 'Thrice daily', duration: '5 days' }
    ],
    notes: 'Warm fluids and steam inhalation recommended.'
  }
];

function handlePrescriptionUpload(evt){
  const file = evt.target.files && evt.target.files[0];
  if(!file) return;

  const thumb = document.getElementById('rxPreviewThumb');
  const status = document.getElementById('rxScanStatus');

  if(file.type.startsWith('image/')){
    const reader = new FileReader();
    reader.onload = e => {
      thumb.src = e.target.result;
      thumb.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  } else {
    thumb.classList.add('hidden');
  }

  status.classList.remove('hidden');
  setTimeout(() => {
    status.classList.add('hidden');
    const template = RX_SCAN_TEMPLATES[Math.floor(Math.random() * RX_SCAN_TEMPLATES.length)];
    const rx = {
      id: 'rx-' + Date.now(),
      date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
      source: 'Scanned',
      diagnosis: template.diagnosis,
      symptoms: template.symptoms,
      medicines: template.medicines,
      notes: template.notes,
      draft: false,
      imageDataUrl: thumb.src && !thumb.classList.contains('hidden') ? thumb.src : null
    };
    state.prescriptions.push(rx);
    savePrescriptions();
    viewPrescription(rx.id);
  }, 1400);
}

// -- 2. VOICE-TO-TEXT SYMPTOM CAPTURE --
let rxRecognition = null;
let rxRecording = false;

function toggleVoiceCapture(){
  const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const btn = document.getElementById('rxVoiceBtn');
const transcript = document.getElementById('rxTranscript');
const langSelect = document.getElementById('rxVoiceLang');

let rxRecognition = null;
let rxRecording = false;

// Tracks whether microphone permission has already been requested
let rxMicPermissionGranted =
  sessionStorage.getItem('rxMicPermissionGranted') === 'true';

// Used to prevent old recognition results from appearing
let rxLanguageChangeId = 0;

// Used when language is changed while listening
let restartAfterLanguageChange = false;


/* =========================================
   REQUEST MICROPHONE PERMISSION ONLY ONCE
   ========================================= */

async function requestMicPermissionOnce() {

  // Permission was already requested in this session
  if (rxMicPermissionGranted) {
    return true;
  }

  // Browser doesn't support getUserMedia
  if (!navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia) {

    return true;
  }

  try {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true
      });

    // We only needed this to obtain microphone permission.
    // SpeechRecognition will handle the actual microphone use.
    stream.getTracks().forEach(track => track.stop());

    rxMicPermissionGranted = true;

    sessionStorage.setItem(
      'rxMicPermissionGranted',
      'true'
    );

    return true;

  } catch (error) {

    console.error(
      'Microphone permission error:',
      error
    );

    alert(
      'Microphone permission is required for voice input.'
    );

    return false;
  }
}


/* =========================================
   CLEAR TEXTAREA
   ========================================= */

function clearRxTranscript() {

  transcript.value = '';

  transcript.dataset.final = '';
}


/* =========================================
   START SPEECH RECOGNITION
   ========================================= */

function startRxRecognition() {

  if (!SpeechRecognition) {

    alert(
      'Voice recognition is not supported in this browser. Please type your symptoms in the box below instead.'
    );

    return;
  }


  // Create a new recognition instance
  rxRecognition = new SpeechRecognition();

  const currentRecognition = rxRecognition;
  const currentLanguageChangeId = rxLanguageChangeId;

  rxRecognition.lang =
    langSelect.value || 'en-IN';

  rxRecognition.interimResults = true;
  rxRecognition.continuous = true;


  /* =========================================
     START
     ========================================= */

  rxRecognition.onstart = () => {

    // Make sure this is still the active recognition
    if (currentRecognition !== rxRecognition) {
      return;
    }

    rxRecording = true;

    btn.textContent =
      '⏺ Listening… Tap to Stop';

    btn.classList.add('recording');
  };


  /* =========================================
     SPEECH RESULT
     ========================================= */

  rxRecognition.onresult = (event) => {

    // Ignore results from an old recognition session
    if (currentRecognition !== rxRecognition) {
      return;
    }

    // Ignore results from before the language was changed
    if (currentLanguageChangeId !== rxLanguageChangeId) {
      return;
    }

    let finalText =
      transcript.dataset.final || '';

    let interim = '';


    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {

      const text =
        event.results[i][0].transcript;


      if (event.results[i].isFinal) {

        finalText += text + ' ';

      } else {

        interim += text;
      }
    }


    transcript.dataset.final = finalText;

    transcript.value =
      (finalText + interim).trim();
  };


  /* =========================================
     ERROR
     ========================================= */

  rxRecognition.onerror = (event) => {

    console.error(
      'Speech recognition error:',
      event.error
    );

    // Don't show an error when we're intentionally
    // restarting because of a language change
    if (restartAfterLanguageChange) {
      return;
    }

    rxRecording = false;

    btn.textContent =
      '🎙 Tap to Start Speaking';

    btn.classList.remove('recording');
  };


  /* =========================================
     END
     ========================================= */

  rxRecognition.onend = () => {

    // If language was changed while listening,
    // start recognition again using the new language
    if (restartAfterLanguageChange) {

      restartAfterLanguageChange = false;

      // Make sure textarea stays empty
      clearRxTranscript();

      // Start with the new language
      startRxRecognition();

      return;
    }


    // Normal stop
    rxRecording = false;

    btn.textContent =
      '🎙 Tap to Start Speaking';

    btn.classList.remove('recording');
  };


  /* =========================================
     START RECOGNITION
     ========================================= */

  try {

    rxRecognition.start();

  } catch (error) {

    console.error(
      'Could not start speech recognition:',
      error
    );

    rxRecording = false;

    btn.textContent =
      '🎙 Tap to Start Speaking';

    btn.classList.remove('recording');
  }
}


/* =========================================
   VOICE BUTTON
   ========================================= */

btn.addEventListener('click', async () => {

  if (!SpeechRecognition) {

    alert(
      'Voice recognition is not supported in this browser. Please type your symptoms in the box below instead.'
    );

    return;
  }


  /* =========================================
     STOP LISTENING
     ========================================= */

  if (rxRecording) {

    if (rxRecognition) {
      rxRecognition.stop();
    }

    return;
  }


  /* =========================================
     REQUEST PERMISSION ONLY ON FIRST USE
     ========================================= */

  const permissionGranted =
    await requestMicPermissionOnce();

  if (!permissionGranted) {
    return;
  }


  /* =========================================
     START LISTENING
     ========================================= */

  clearRxTranscript();

  startRxRecognition();
});


/* =========================================
   LANGUAGE CHANGE
   ========================================= */

langSelect.addEventListener('change', () => {

  /*
   * IMPORTANT:
   * Increase this BEFORE stopping recognition.
   * This makes any late result from the old
   * language invalid.
   */
  rxLanguageChangeId++;


  /*
   * ALWAYS clear the textarea immediately,
   * even if voice recognition is currently ON.
   */
  clearRxTranscript();


  /*
   * If currently listening:
   * stop the old language and restart with
   * the newly selected language.
   */
  if (rxRecording && rxRecognition) {

    restartAfterLanguageChange = true;

    rxRecognition.stop();

    return;
  }


  /*
   * If not listening, just keep the textarea empty.
   */
  clearRxTranscript();
});
}

// naive keyword → likely-condition mapping, purely for demo drafting
const RX_SYMPTOM_MAP = [
  { keywords: ['fever', 'बुखार', 'জ্বর'], diagnosis: 'Suspected Viral Fever', medicines: [{ name:'Tab. Paracetamol 500mg', dosage:'1 tablet', frequency:'Thrice daily after food', duration:'3 days' }] },
  { keywords: ['cough', 'cold', 'खांसी', 'सर्दी', 'কাশি', 'সর্দি'], diagnosis: 'Suspected Upper Respiratory Infection', medicines: [{ name:'Syp. Cough Expectorant', dosage:'10ml', frequency:'Thrice daily', duration:'5 days' }] },
  { keywords: ['stomach', 'acidity', 'पेट', 'এসিডিটি', 'পেট'], diagnosis: 'Suspected Acute Gastritis', medicines: [{ name:'Tab. Pantoprazole 40mg', dosage:'1 tablet', frequency:'Once daily before breakfast', duration:'5 days' }] },
  { keywords: ['headache', 'सरदर्द', 'মাথাব্যথা'], diagnosis: 'Suspected Tension Headache', medicines: [{ name:'Tab. Paracetamol 500mg', dosage:'1 tablet', frequency:'As needed, max thrice daily', duration:'3 days' }] },
  { keywords: ['back pain', 'joint pain', 'कमर दर्द', 'জয়েন্ট ব্যথা'], diagnosis: 'Suspected Musculoskeletal Strain', medicines: [{ name:'Tab. Ibuprofen 400mg', dosage:'1 tablet', frequency:'Twice daily after food', duration:'3 days' }] }
];

function draftPrescriptionFromVoice(){
  const text = document.getElementById('rxTranscript').value.trim();
  if(!text){ alert('Please speak or type your symptoms first.'); return; }
  const lower = text.toLowerCase();
  let matched = null;
  for(const entry of RX_SYMPTOM_MAP){
    if(entry.keywords.some(k => lower.includes(k.toLowerCase()))){ matched = entry; break; }
  }
  const rx = {
    id: 'rx-' + Date.now(),
    date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
    source: 'Voice',
    diagnosis: matched ? matched.diagnosis : 'General Symptom Record',
    symptoms: text,
    medicines: matched ? matched.medicines : [],
    notes: 'AI-drafted from spoken symptoms. This has NOT been reviewed by a doctor — book a consultation to confirm diagnosis and treatment.',
    draft: true,
    imageDataUrl: null
  };
  state.prescriptions.push(rx);
  savePrescriptions();
  document.getElementById('rxTranscript').value = '';
  document.getElementById('rxTranscript').dataset.final = '';
  viewPrescription(rx.id);
}

// -- DIGITAL PRESCRIPTION VIEW --
function viewPrescription(id){
  activePrescriptionId = id;
  document.getElementById('rxSummaryBox').classList.add('hidden');
  document.getElementById('rxFlashcardBox').classList.add('hidden');
  document.getElementById('rxDocLang').value = 'en';
  renderPrescriptionDoc();
  showScreen('screen-prescription-view');
}

function getActivePrescription(){
  return state.prescriptions.find(r => r.id === activePrescriptionId);
}

function renderPrescriptionDoc(){
  const rx = getActivePrescription();
  if(!rx) return;
  const card = document.getElementById('rxDocCard');
  card.innerHTML = `
    ${rx.draft ? '<div class="rx-draft-banner">⚠ AI-DRAFTED — Pending doctor review. Not valid for medicine dispensing until confirmed by a licensed doctor.</div>' : ''}
    <div class="rx-doc-head">
      <div>
        <h3>${rx.diagnosis || 'Symptom Record'}</h3>
        <p class="muted">${state.patientName} · ${rx.date} · Source: ${rx.source}</p>
      </div>
      <span class="rx-source-tag">${rx.source}</span>
    </div>
    ${rx.imageDataUrl ? `<img src="${rx.imageDataUrl}" class="rx-preview-thumb">` : ''}
    <div class="rx-doc-field">
      <div class="summary-label">REPORTED SYMPTOMS</div>
      <p style="margin:0;">${rx.symptoms || '—'}</p>
    </div>
    <div class="rx-doc-field">
      <div class="summary-label">MEDICINES</div>
      ${rx.medicines.length ? `
      <table class="rx-med-table">
        <thead><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr></thead>
        <tbody>${rx.medicines.map(m => `<tr><td>${m.name}</td><td>${m.dosage}</td><td>${m.frequency}</td><td>${m.duration}</td></tr>`).join('')}</tbody>
      </table>` : '<p class="muted" style="margin:0;">No medicines recorded.</p>'}
    </div>
    <div class="rx-doc-field">
      <div class="summary-label">DOCTOR'S NOTES / ADVICE</div>
      <p style="margin:0;">${rx.notes || '—'}</p>
    </div>
    <div class="rx-doc-actions">
      <button class="btn btn-outline" onclick="speak('${(rx.diagnosis + '. ' + rx.symptoms).replace(/'/g, '')}')">🔊 Read Aloud</button>
      <button class="btn btn-outline" onclick="togglePrescriptionSummary()">🧾 Summary</button>
      <button class="btn btn-outline" onclick="toggleFlashcards()">🗂 Flashcards</button>
      <button class="btn btn-outline" onclick="window.print()">🖨 Print / Download</button>
    </div>`;
}

// -- TRANSLATE (labels + recognised medical terms only — demo scope) --
const RX_TERM_DICT = {
  'Viral Fever': { hi:'वायरल बुखार', bn:'ভাইরাল জ্বর' },
  'Suspected Viral Fever': { hi:'संभावित वायरल बुखार', bn:'সম্ভাব্য ভাইরাল জ্বর' },
  'Fever': { hi:'बुखार', bn:'জ্বর' },
  'Cough': { hi:'खांसी', bn:'কাশি' },
  'Cold': { hi:'सर्दी', bn:'সর্দি' },
  'Headache': { hi:'सरदर्द', bn:'মাথাব্যথা' },
  'Stomach pain': { hi:'पेट दर्द', bn:'পেটে ব্যথা' },
  'Rest': { hi:'आराम', bn:'বিশ্রাম' },
  'Tab.': { hi:'टैब.', bn:'ট্যাব.' },
  'Syp.': { hi:'सिरप', bn:'সিরাপ' },
  'Once daily': { hi:'दिन में एक बार', bn:'দিনে একবার' },
  'Twice daily': { hi:'दिन में दो बार', bn:'দিনে দুইবার' },
  'Thrice daily': { hi:'दिन में तीन बार', bn:'দিনে তিনবার' }
};
function translateTerm(text, lang){
  if(lang === 'en' || !text) return text;
  let out = text;
  Object.keys(RX_TERM_DICT).forEach(term => {
    const t = RX_TERM_DICT[term][lang];
    if(t) out = out.split(term).join(t);
  });
  return out;
}
function translatePrescriptionView(lang){
  const rx = getActivePrescription();
  if(!rx) return;
  if(lang === 'en'){ renderPrescriptionDoc(); return; }
  const translated = JSON.parse(JSON.stringify(rx));
  translated.diagnosis = translateTerm(translated.diagnosis, lang);
  translated.symptoms = translateTerm(translated.symptoms, lang);
  translated.notes = translateTerm(translated.notes, lang);
  translated.medicines = translated.medicines.map(m => ({
    name: translateTerm(m.name, lang),
    dosage: m.dosage,
    frequency: translateTerm(m.frequency, lang),
    duration: m.duration
  }));
  const original = activePrescriptionId;
  const backup = getActivePrescription();
  const idx = state.prescriptions.findIndex(r => r.id === original);
  state.prescriptions[idx] = translated;
  renderPrescriptionDoc();
  state.prescriptions[idx] = backup; // restore original English data in storage
}

// -- SUMMARY --
function togglePrescriptionSummary(){
  const box = document.getElementById('rxSummaryBox');
  if(!box.classList.contains('hidden')){ box.classList.add('hidden'); return; }
  const rx = getActivePrescription();
  const medList = rx.medicines.length
    ? rx.medicines.map(m => `${m.name} (${m.frequency}, for ${m.duration})`).join('; ')
    : 'no medicines recorded';
  box.innerHTML = `<strong>In simple terms:</strong> You were found to have <strong>${rx.diagnosis || 'a general health concern'}</strong> based on: ${rx.symptoms}. You should take ${medList}. ${rx.notes}`;
  box.classList.remove('hidden');
}

// -- FLASHCARDS --
let rxFlashcards = [];
let rxFlashIndex = 0;
function buildFlashcards(rx){
  const cards = [
    { q: 'What was this prescription for?', a: rx.diagnosis || 'A general symptom check-up' },
    { q: 'What symptoms were reported?', a: rx.symptoms || 'None recorded' }
  ];
  rx.medicines.forEach(m => {
    cards.push({ q: `How should I take ${m.name}?`, a: `${m.dosage}, ${m.frequency}, for ${m.duration}` });
  });
  cards.push({ q: "What did the doctor's notes say?", a: rx.notes || 'No additional notes.' });
  return cards;
}
function toggleFlashcards(){
  const box = document.getElementById('rxFlashcardBox');
  if(!box.classList.contains('hidden')){ box.classList.add('hidden'); return; }
  const rx = getActivePrescription();
  rxFlashcards = buildFlashcards(rx);
  rxFlashIndex = 0;
  renderFlashcard();
  box.classList.remove('hidden');
}
function renderFlashcard(){
  const card = rxFlashcards[rxFlashIndex];
  document.getElementById('rxFlipFront').textContent = card.q;
  document.getElementById('rxFlipBack').textContent = card.a;
  document.getElementById('rxFlipCard').classList.remove('flipped');
  document.getElementById('rxFlashCount').textContent = 'Card ' + (rxFlashIndex + 1) + ' of ' + rxFlashcards.length;
}
function flashcardNav(dir){
  rxFlashIndex = (rxFlashIndex + dir + rxFlashcards.length) % rxFlashcards.length;
  renderFlashcard();
}

// ============ HEALTH PROFILE ============
function renderProfile(){
  document.getElementById('profileName').textContent = state.patientName;
  document.getElementById('profileAbha').textContent = state.abhaId || 'Not linked';
  document.getElementById('profileConditions').textContent = state.conditions.join(', ') || 'None recorded';
  document.getElementById('profileMedicines').textContent = state.medicines.join(', ') || 'None recorded';
  document.getElementById('profileAllergies').textContent = state.allergies.join(', ') || 'None recorded';
  document.getElementById('profileEmergency').textContent =
    (state.registration.emergencyName ? state.registration.emergencyName + ' (' + state.registration.emergencyRelation + ') — ' + state.registration.emergencyPhone : 'Not provided');
}
function openProfile(){
  renderProfile();
  showScreen('screen-profile');
}

// ============ DOCTOR PORTAL (prototype stub) ============
function openDoctorPlaceholder(name, icon){
  document.getElementById('doctorStubIcon').textContent = icon;
  document.getElementById('doctorStubTitle').textContent = name;
  showScreen('screen-doctor-placeholder');
}

// ============ VOICE / "LISTEN" BUTTONS ============
function speak(text){
  if('speechSynthesis' in window){
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }
// Sending to python server for TTS (if implemented)
  async function sendToPython() {
    const response = await fetch("http://127.0.0.1:5000/api/hello", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "Samriddha"
        })
    });

    const data = await response.json();

    console.log(data.message);
}
}

document.addEventListener('DOMContentLoaded', () => {
  renderWellness(0);
  loadPrescriptions();
});
