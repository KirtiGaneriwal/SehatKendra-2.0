// ============ BACKEND CONNECTION ============
const BACKEND_URL = "http://127.0.0.1:8000";

let aadhaarTransactionId = null;
// ============ STATE ============
const state = {
  loggedIn: false,
  patientId: null,
  patientName: "Guest Citizen",
  abhaId: null,
  conditions: [],
  medicines: [],
  allergies: [],
  registration: {},
  booking: {
    pathway: "general",
    doctor: "Dr. Priya Sharma",
    doctorRole: "General Medicine",
    mode: "In-Person Hospital OPD",
    date: "",
    slot: "10:00 AM",
    confirmed: false,
    attachedPrescriptionId: ""
  },
  prescriptions: []
};


// ============ SCREEN NAVIGATION ============
function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {
      screen.classList.remove("active");
    });

  const target = document.getElementById(id);

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ============ LOGIN / APP ENTRY ============
function enterApp(nextScreenId) {

  state.loggedIn = true;

  const pill = document.getElementById("guestPill");

  if (pill) {
    pill.textContent =
      "☀ " + (state.patientName || "Citizen");
  }

  const preAuth =
    document.getElementById("preAuthActions");

  const postAuth =
    document.getElementById("postAuthNav");

  if (preAuth) {
    preAuth.classList.add("hidden");
  }

  if (postAuth) {
    postAuth.classList.remove("hidden");
  }

  showScreen(nextScreenId);
}


// ============ LOGOUT ============
function logout() {

  state.loggedIn = false;

  const preAuth =
    document.getElementById("preAuthActions");

  const postAuth =
    document.getElementById("postAuthNav");

  if (preAuth) {
    preAuth.classList.remove("hidden");
  }

  if (postAuth) {
    postAuth.classList.add("hidden");
  }

  showScreen("screen-landing");
}


// ============ HOME ============
function goHome() {

  if (state.loggedIn) {
    showScreen("screen-dashboard");
  }
}


// ============ SAMPLE LOGIN ============
function loginAsSamplePatient() {

  state.patientId = 1;

  state.patientName = "Smt. Ananya Sen";

  state.abhaId = "91-4421-8890-1204";

  state.conditions = [
    "Hypertension",
    "Diabetes"
  ];

  state.medicines = [
    "Tab. Metformin 500mg",
    "Tab. Amlodipine 5mg"
  ];

  state.allergies = [
    "Penicillin (mild rash)"
  ];

  enterApp("screen-dashboard");
}


// ============ GUEST LOGIN ============
function loginAsGuest() {

  state.patientId = null;

  state.patientName = "Guest Citizen";

  state.abhaId = "GUEST-0000-0000-0000";

  state.conditions = [];

  state.medicines = [];

  state.allergies = [];

  enterApp("screen-dashboard");
}

// ============ NEW PATIENT REGISTRATION ============
function goToRegStep(step) {

  document
    .querySelectorAll("#regForm .reg-step")
    .forEach(el => el.classList.remove("active"));

  const target = document.getElementById("regStep" + step);

  if (target) {
    target.classList.add("active");
  }

  const label = document.getElementById("regStepLabel");

  const titles = {
    1: "Identity Setup",
    2: "ABHA & Emergency Contact",
    3: "Review & Consent"
  };

  if (label) {
    label.textContent =
      `Step ${step} of 3: ${titles[step] || ""}`;
  }

  if (step === 3) {
    renderRegistrationReview();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function regNext(fromStep) {

  if (fromStep === 1) {

    const name = document.getElementById("regName").value.trim();
    const dob = document.getElementById("regDob").value;
    const mobile =
      document.getElementById("regMobile").value.replace(/\D/g, "");
    const city = document.getElementById("regCity").value.trim();

    if (!name) {
      alert("Please enter your full name.");
      return;
    }

    if (!dob) {
      alert("Please enter your date of birth.");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!city) {
      alert("Please enter your city / town.");
      return;
    }
  }

  goToRegStep(fromStep + 1);
}


function regBack(fromStep) {
  goToRegStep(fromStep - 1);
}


function renderRegistrationReview() {

  const box = document.getElementById("regReviewBox");

  if (!box) return;

  const val = id => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };

  const rows = [
    ["Full Name", val("regName")],
    ["Date of Birth", val("regDob")],
    ["Gender", val("regGender")],
    ["Mobile Number", val("regMobile")],
    ["Email", val("regEmail") || "—"],
    ["City / Town", val("regCity")],
    ["State / UT", val("regState")],
    ["ABHA Number", val("regAbha") || "Will be created on registration"],
    ["Emergency Contact", val("regEmergencyName") || "—"],
    ["Relationship", val("regEmergencyRelation") || "—"],
    ["Emergency Phone", val("regEmergencyPhone") || "—"]
  ];

  box.innerHTML = rows
    .map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`)
    .join("");
}


function submitRegistration() {

  const consent = document.getElementById("regConsent");

  if (!consent || !consent.checked) {
    alert("Please consent to storing your details to continue.");
    return;
  }

  state.patientId = state.patientId || 1;

  state.patientName =
    document.getElementById("regName").value.trim() || "New Citizen";

  state.abhaId =
    document.getElementById("regAbha").value.trim() || "NEW-ABHA-PENDING";

  state.registration = {
    dob: document.getElementById("regDob").value,
    gender: document.getElementById("regGender").value,
    mobile: document.getElementById("regMobile").value.trim(),
    email: document.getElementById("regEmail").value.trim(),
    city: document.getElementById("regCity").value.trim(),
    state: document.getElementById("regState").value,
    emergencyName: document.getElementById("regEmergencyName").value.trim(),
    emergencyRelation:
      document.getElementById("regEmergencyRelation").value.trim(),
    emergencyPhone:
      document.getElementById("regEmergencyPhone").value.trim()
  };

  alert("Registration successful! Your digital health profile has been created. ✅");

  enterApp("screen-dashboard");
}


// ============ AADHAAR INPUT ============
function getAadhaarInput() {
  return document.getElementById("abhaId");
}


// ============ OTP INPUTS ============
function getOtpValue() {
  const otpBoxes = document.querySelectorAll(".otp-boxes input");

  if (otpBoxes.length === 6) {
    return Array.from(otpBoxes)
      .map(box => box.value.trim())
      .join("");
  }

  const singleOtp =
    document.getElementById("otp") ||
    document.getElementById("aadhaarOtp") ||
    document.getElementById("otpInput");

  return singleOtp ? singleOtp.value.trim() : "";
}
// ============ BOOKING FLOW ============

function selectPathway(kind, el) {
  state.booking.pathway = kind;

  document.querySelectorAll(".pathway-card").forEach(card => {
    card.classList.remove("selected");

    const btn = card.querySelector(".btn");

    if (btn) {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");
    }
  });

  el.classList.add("selected");

  const btn = el.querySelector(".btn");

  if (btn) {
    btn.classList.remove("btn-outline");
    btn.classList.add("btn-primary");
  }
}


function goToDoctorStep() {

  if (state.booking.pathway === "ayurveda") {

    state.booking.doctor = "Vaidya Dr. Rajesh Sharma";

    state.booking.doctorRole =
      "Kayachikitsa (Internal Medicine & Joint Care)";

    showScreen("screen-book-2-ayurveda");

  } else {

    state.booking.doctor = "Dr. Priya Sharma";

    state.booking.doctorRole =
      "General Medicine";

    showScreen("screen-book-2-general");
  }
}


function selectDoctor(el, name, role) {

  state.booking.doctor = name;
  state.booking.doctorRole = role;

  const grid = el.closest(".doctor-grid");

  grid.querySelectorAll(".doctor-card").forEach(card => {

    card.classList.remove("selected");

    const btn = card.querySelector(".btn");

    if (btn) {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");
      btn.textContent = "Select";
    }
  });

  el.classList.add("selected");

  const btn = el.querySelector(".btn");

  if (btn) {
    btn.classList.remove("btn-outline");
    btn.classList.add("btn-primary");
    btn.textContent = "Selected";
  }
}


function selectSlot(el) {

  state.booking.slot =
    el.textContent.trim();

  const grid =
    el.closest(".slot-grid");

  grid.querySelectorAll(".slot")
    .forEach(slot =>
      slot.classList.remove("selected")
    );

  el.classList.add("selected");
}
function goBackFromStep3() {
  if (state.booking.pathway === "ayurveda") {
    showScreen("screen-book-2-ayurveda");
  } else {
    showScreen("screen-book-2-general");
  }
}

function goToConsent() {

  state.booking.mode =
    document.getElementById("consultMode").value;

  const dateInput =
    document.getElementById("consultDate").value;

  // Keep PostgreSQL date format: YYYY-MM-DD
  if (dateInput) {

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      // Already correct
      state.booking.date = dateInput;

    } else {
      // Try to extract a date from text like:
      // Tomorrow (10 Sep 2026)
      const match = dateInput.match(
        /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/
      );

      if (match) {

        const day = match[1].padStart(2, "0");
        const monthName = match[2];
        const year = match[3];

        const months = {
          January: "01",
          February: "02",
          March: "03",
          April: "04",
          May: "05",
          June: "06",
          July: "07",
          August: "08",
          September: "09",
          October: "10",
          November: "11",
          December: "12"
        };

        if (months[monthName]) {
          state.booking.date =
            `${year}-${months[monthName]}-${day}`;
        } else {
          alert("Invalid appointment date.");
          return;
        }

      } else {
        alert("Invalid appointment date.");
        return;
      }
    }

  } else {
    alert("Please select an appointment date.");
    return;
  }

  showScreen("screen-book-consent");
  renderBookingSummary();
}
// ============ BOOKING SUMMARY (CONSENT SCREEN) ============
function renderBookingSummary() {

  const box = document.getElementById("consentSummary");

  if (box) {

    const b = state.booking;

    let formattedDate = "Not selected";

    if (b.date) {
      const parsed = new Date(b.date + "T00:00:00");

      if (!isNaN(parsed)) {
        formattedDate = parsed.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
      }
    }

    box.innerHTML = `
      <p><strong>Doctor:</strong> ${b.doctor}</p>
      <p><strong>Specialisation:</strong> ${b.doctorRole}</p>
      <p><strong>Consultation Mode:</strong> ${b.mode}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Time Slot:</strong> ${b.slot}</p>
    `;
  }

  const select = document.getElementById("rxAttachSelect");

  if (select) {

    select.innerHTML =
      '<option value="">None (optional)</option>';

    (state.prescriptions || []).forEach(rx => {

      const option = document.createElement("option");

      option.value = rx.id;

      option.textContent =
        rx.title || rx.name || `Prescription #${rx.id}`;

      select.appendChild(option);
    });
  }
}


// ============ BACKEND APPOINTMENT BOOKING ============
async function confirmBooking() {

  const consent = document.getElementById("bookingConsent");

  if (!consent || !consent.checked) {
    alert("Please consent to share your health record with the doctor.");
    return;
  }

  // Use logged-in patient, otherwise demo patient
  const patientId = state.patientId || 1;

  const select = document.getElementById("rxAttachSelect");

  const prescriptionId =
    select && select.value && /^\d+$/.test(select.value)
      ? select.value
      : null;

  const payload = {
    patient_id: String(patientId),

    doctor: state.booking.doctor || "Dr. Priya Sharma",

    doctor_role:
      state.booking.doctorRole || "General Medicine",

    mode:
      state.booking.mode || "In-Person Hospital OPD",

    appointment_date:
      state.booking.date,

    appointment_time:
      state.booking.slot || "10:00 AM",

    prescription_id: prescriptionId,

    consent: true
  };

  console.log("Booking appointment:", payload);

  try {

    const response = await fetch(
      `${BACKEND_URL}/appointments`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Appointment booking failed."
      );
    }

    console.log(
      "Appointment successfully saved:",
      data
    );

    state.booking.confirmed = true;

    state.booking.backendAppointment =
      data.appointment || data;

    alert("Appointment booked successfully! ✅");

    showScreen("screen-book-confirm");

  } catch (error) {

    console.error(
      "Appointment booking error:",
      error
    );

    alert(
      "Unable to book appointment.\n\n" +
      error.message
    );
  }
}

// ============ REQUEST DEMO OTP ============
async function requestAadhaarOtp() {
  const input = document.getElementById("abhaId");

  if (!input) {
    alert("Aadhaar number field not found.");
    return;
  }

  const aadhaar = input.value.replace(/\D/g, "");

  if (!/^\d{12}$/.test(aadhaar)) {
    alert("Please enter a valid 12-digit DEMO Aadhaar number.");
    return;
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/auth/aadhaar/request-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          aadhaar: aadhaar,
          consent: true
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "OTP request failed.");
    }

    aadhaarTransactionId = data.transaction_id;

    alert(
      "Demo Aadhaar OTP:\n\n" +
      (data.demo_otp || "123456")
    );

    showScreen("screen-abha-otp");

    const otpScreen = document.getElementById("screen-abha-otp");

    if (otpScreen) {
      const firstOtp = otpScreen.querySelector(".otp-boxes input");

      if (firstOtp) {
        setTimeout(() => firstOtp.focus(), 100);
      }
    }

  } catch (error) {
    console.error("OTP request error:", error);

    alert(
      "OTP Error:\n\n" +
      error.message
    );
  }
}


// ============ VERIFY DEMO OTP ============
async function verifyAbhaOtp() {

  const input = getAadhaarInput();
  const otp = getOtpValue();

  if (!input) {
    alert("Aadhaar / Health Number field not found.");
    return;
  }

  const aadhaar = input.value.replace(/\D/g, "");

  if (!/^\d{12}$/.test(aadhaar)) {
    alert(
      "Please enter the same 12-digit DEMO Aadhaar number."
    );
    return;
  }

  if (!/^\d{6}$/.test(otp)) {
    alert("Please enter the complete 6-digit OTP.");
    return;
  }

  if (!aadhaarTransactionId) {
    alert("Please request OTP first.");
    showScreen("screen-abha-id");
    return;
  }

  try {

    const response = await fetch(
      `${BACKEND_URL}/auth/aadhaar/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          aadhaar: aadhaar,
          transaction_id: aadhaarTransactionId,
          otp: otp
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "OTP verification failed."
      );
    }

    console.log(
      "OTP verification successful:",
      data
    );

    state.loggedIn = true;

    state.patientName =
      data.patient_name ||
      "Smt. Ananya Sen";

    state.abhaId =
      data.abha_id ||
      "DEMO-AADHAAR-VERIFIED";

    state.conditions =
      data.conditions || [];

    state.medicines =
      data.medicines || [];

    state.allergies =
      data.allergies || [];

    aadhaarTransactionId = null;

    document
      .querySelectorAll(".otp-boxes input")
      .forEach(box => {
        box.value = "";
      });

    alert(
      "Authentication successful! ✅"
    );

    enterApp("screen-dashboard");

  } catch (error) {

    console.error(
      "OTP verification error:",
      error
    );

    alert(
      "Verification failed:\n\n" +
      error.message
    );
  }
}


// ============ OTP BOX AUTO MOVE ============
document.addEventListener(
  "input",
  function (event) {

    if (
      !event.target.matches(
        ".otp-boxes input"
      )
    ) {
      return;
    }

    const box = event.target;

    box.value =
      box.value
        .replace(/\D/g, "")
        .slice(0, 1);

    if (box.value) {

      const next =
        box.nextElementSibling;

      if (
        next &&
        next.matches("input")
      ) {
        next.focus();
      }
    }
  }
);


// ============ OTP BACKSPACE ============
document.addEventListener(
  "keydown",
  function (event) {

    if (
      !event.target.matches(
        ".otp-boxes input"
      )
    ) {
      return;
    }

    if (
      event.key === "Backspace" &&
      !event.target.value
    ) {

      const previous =
        event.target.previousElementSibling;

      if (
        previous &&
        previous.matches("input")
      ) {
        previous.focus();
      }
    }
  }
);
// ================= CARE AI BACKEND =================

async function callCareAI(question) {

  addChatBubble(question, true);

  try {

    const response = await fetch("http://127.0.0.1:8000/care-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: question
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Care AI request failed");
    }

    addChatBubble(data.answer, false);

  } catch (error) {

    console.error("Care AI Error:", error);

    addChatBubble(
      "Sorry, Care AI could not connect to the backend. Please make sure the Sehat Kendra backend is running.",
      false
    );

  }
}


function askCareAI(question) {
  callCareAI(question);
}


function sendChat() {

  const input = document.getElementById("chatInput");

  if (!input) {
    console.error("chatInput not found");
    return;
  }

  const text = input.value.trim();

  if (!text) return;

  input.value = "";

  callCareAI(text);
}


function addChatBubble(text, isUser) {

  const body = document.getElementById("chatBody");

  if (!body) {
    console.error("chatBody not found");
    return;
  }

  const bubble = document.createElement("div");

  bubble.className =
    "chat-bubble" + (isUser ? " user" : "");

  const time =
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

  bubble.innerHTML = `
    <p>${text}</p>
    <div class="chat-meta">
      <span>${time}</span>
      ${isUser
      ? ""
      : '<button class="btn-link-small" onclick="speak(this.parentElement.previousElementSibling.textContent)">🔊 Listen</button>'
    }
    </div>
  `;

  body.appendChild(bubble);

  body.scrollTop = body.scrollHeight;
}
// ================= ABHA LOGIN =================

let abhaTransactionId = null;

async function requestAbhaOtp() {

  const input = document.getElementById("abhaLoginId");

  if (!input) return;

  const abhaId = input.value.replace(/\D/g, "");

  if (!/^\d{14}$/.test(abhaId)) {
    alert("Please enter a valid 14-digit ABHA number.");
    return;
  }

  try {

    const response = await fetch(
      `${BACKEND_URL}/auth/abha/request-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          abha_id: abhaId
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "ABHA OTP failed.");
    }

    abhaTransactionId = data.transaction_id;

    showScreen("screen-abha-otp");

    alert(
      "Demo ABHA OTP:\n\n" + data.demo_otp
    );

  } catch (error) {

    console.error("ABHA Login Error:", error);

    alert(
      "ABHA login failed:\n\n" + error.message
    );
  }
}


async function verifyAbhaLogin() {

  const abhaInput =
    document.getElementById("abhaLoginId");

  const otpInput =
    document.getElementById("abhaOtpInput");

  const abhaId =
    abhaInput.value.replace(/\D/g, "");

  const otp =
    otpInput.value.trim();

  if (!/^\d{14}$/.test(abhaId)) {
    alert("Invalid ABHA number.");
    return;
  }

  if (!/^\d{6}$/.test(otp)) {
    alert("Enter the 6-digit OTP.");
    return;
  }

  if (!abhaTransactionId) {
    alert("Please request OTP first.");
    return;
  }

  try {

    const response = await fetch(
      `${BACKEND_URL}/auth/abha/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          abha_id: abhaId,
          transaction_id: abhaTransactionId,
          otp: otp
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "ABHA verification failed."
      );
    }

    state.loggedIn = true;
    state.patientName =
      data.patient_name || "ABHA Citizen";
    state.abhaId =
      data.abha_id || abhaId;

    abhaTransactionId = null;

    alert("ABHA authentication successful! ✅");

    enterApp("screen-dashboard");

  } catch (error) {

    console.error("ABHA Verification Error:", error);

    alert(
      "ABHA verification failed:\n\n" +
      error.message
    );
  }
}
// ================= AADHAAR LOGIN =================

let aadhaarLoginTransactionId = null;

async function requestAadhaarLoginOtp() {

  const input = document.getElementById("aadhaarLoginId");

  if (!input) {
    alert("Aadhaar input not found.");
    return;
  }

  const aadhaar = input.value.replace(/\D/g, "");

  if (!/^\d{12}$/.test(aadhaar)) {
    alert("Please enter a valid 12-digit Aadhaar number.");
    return;
  }

  try {

    const response = await fetch(
      `${BACKEND_URL}/auth/aadhaar/request-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          aadhaar: aadhaar,
          consent: true
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Aadhaar OTP failed.");
    }

    aadhaarLoginTransactionId = data.transaction_id;

    showScreen("screen-aadhaar-otp");

    alert(
      "Demo Aadhaar OTP:\n\n" +
      data.demo_otp
    );

  } catch (error) {

    console.error("Aadhaar Login Error:", error);

    alert(
      "Aadhaar login failed:\n\n" +
      error.message
    );
  }
}


async function verifyAadhaarLogin() {

  const input =
    document.getElementById("aadhaarLoginId");

  const otpInput =
    document.getElementById("aadhaarOtpInput");

  if (!input || !otpInput) {
    alert("Aadhaar or OTP field not found.");
    return;
  }

  const aadhaar =
    input.value.replace(/\D/g, "");

  const otp =
    otpInput.value.trim();

  if (!/^\d{12}$/.test(aadhaar)) {
    alert("Invalid Aadhaar number.");
    return;
  }

  if (!/^\d{6}$/.test(otp)) {
    alert("Enter the 6-digit OTP.");
    return;
  }

  if (!aadhaarLoginTransactionId) {
    alert("Please request OTP first.");
    return;
  }

  try {

    const response = await fetch(
      `${BACKEND_URL}/auth/aadhaar/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          aadhaar: aadhaar,
          transaction_id: aadhaarLoginTransactionId,
          otp: otp
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Aadhaar verification failed."
      );
    }

    state.loggedIn = true;
    state.patientId = data.patient_id || 1;
    state.patientName =
      data.patient_name || "Aadhaar Citizen";
    state.abhaId =
      data.abha_id || "DEMO-ABHA";

    aadhaarLoginTransactionId = null;

    alert("Aadhaar authentication successful! ✅");

    enterApp("screen-dashboard");

  } catch (error) {

    console.error(
      "Aadhaar Verification Error:",
      error
    );

    alert(
      "Aadhaar verification failed:\n\n" +
      error.message
    );
  }
}

// ================= MOBILE OTP DEMO =================

let mobileDemoOtp = null;

function requestMobileOtp() {

  const input = document.getElementById("mobileLoginNumber");

  if (!input) {
    alert("Mobile number field not found.");
    return;
  }

  const mobile = input.value.replace(/\D/g, "");

  if (!/^\d{10}$/.test(mobile)) {
    alert("Please enter a valid 10-digit demo mobile number.");
    return;
  }

  // Generate demo OTP
  mobileDemoOtp =
    Math.floor(100000 + Math.random() * 900000).toString();

  // Move to OTP screen
  showScreen("screen-mobile-otp");

  // Show OTP for demo
  alert(
    "Demo Mobile OTP:\n\n" +
    mobileDemoOtp
  );

  const otpInput =
    document.getElementById("mobileOtpInput");

  if (otpInput) {
    setTimeout(() => {
      otpInput.focus();
    }, 100);
  }
}


function verifyMobileOtp() {

  const otpInput =
    document.getElementById("mobileOtpInput");

  if (!otpInput) {
    alert("OTP field not found.");
    return;
  }

  const enteredOtp =
    otpInput.value.trim();

  if (!/^\d{6}$/.test(enteredOtp)) {
    alert("Please enter the complete 6-digit OTP.");
    return;
  }

  if (enteredOtp !== mobileDemoOtp) {
    alert("Invalid OTP. Please enter the demo OTP shown earlier.");
    return;
  }

  // Demo login successful
  state.loggedIn = true;
  state.patientId = 1;
  state.patientName = "Demo Citizen";
  state.abhaId = "DEMO-MOBILE-VERIFIED";

  alert("Mobile verification successful! ✅");

  enterApp("screen-dashboard");
}// ======================================================
// LANGUAGE PREVIEW FIX
// ======================================================

let selectedPortalLanguage = "en";

const languagePreview = {
  en: {
    title: "Select Your Language",
    subtitle: "Please choose the language in which you would like to use the SEHAT KENDRA portal.",
    back: "← Back",
    continue: "Continue →",
    listen: "🔊 Listen",
    selected: "Selected"
  },

  hi: {
    title: "अपनी भाषा चुनें",
    subtitle: "कृपया वह भाषा चुनें जिसमें आप SEHAT KENDRA पोर्टल का उपयोग करना चाहते हैं।",
    back: "← वापस",
    continue: "जारी रखें →",
    listen: "🔊 सुनें",
    selected: "चयनित"
  },

  bn: {
    title: "আপনার ভাষা নির্বাচন করুন",
    subtitle: "আপনি যে ভাষায় SEHAT KENDRA পোর্টাল ব্যবহার করতে চান সেটি নির্বাচন করুন।",
    back: "← ফিরে যান",
    continue: "চালিয়ে যান →",
    listen: "🔊 শুনুন",
    selected: "নির্বাচিত"
  },

  ta: {
    title: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    subtitle: "SEHAT KENDRA போர்ட்டலைப் பயன்படுத்த விரும்பும் மொழியைத் தேர்ந்தெடுக்கவும்.",
    back: "← பின்செல்",
    continue: "தொடரவும் →",
    listen: "🔊 கேளுங்கள்",
    selected: "தேர்ந்தெடுக்கப்பட்டது"
  },

  mr: {
    title: "तुमची भाषा निवडा",
    subtitle: "कृपया SEHAT KENDRA पोर्टल वापरण्यासाठी भाषा निवडा.",
    back: "← मागे",
    continue: "पुढे जा →",
    listen: "🔊 ऐका",
    selected: "निवडलेले"
  },

  or: {
    title: "ଆପଣଙ୍କ ଭାଷା ଚୟନ କରନ୍ତୁ",
    subtitle: "SEHAT KENDRA ପୋର୍ଟାଲ୍ ବ୍ୟବହାର କରିବାକୁ ଆପଣ ଚାହୁଁଥିବା ଭାଷା ଚୟନ କରନ୍ତୁ।",
    back: "← ପଛକୁ",
    continue: "ଜାରି ରଖନ୍ତୁ →",
    listen: "🔊 ଶୁଣନ୍ତୁ",
    selected: "ଚୟନ କରାଯାଇଛି"
  }
};


// ======================================================
// LANGUAGE SELECT
// ======================================================

function selectLanguage(card) {

  if (!card) return;

  // Remove selected from every card
  document.querySelectorAll(".lang-card").forEach(c => {

    c.classList.remove("selected");

    const oldPill = c.querySelector(".selected-pill");

    if (oldPill) {
      oldPill.remove();
    }

  });

  // Select clicked card
  card.classList.add("selected");

  // Get language
  const languageName = card.dataset.lang;

  const languageCodes = {
    English: "en",
    Hindi: "hi",
    Bengali: "bn",
    Tamil: "ta",
    Marathi: "mr",
    Odia: "or"
  };

  selectedPortalLanguage =
    languageCodes[languageName] || "en";

  const preview = languagePreview[selectedPortalLanguage];

  // Add selected badge
  const badge = document.createElement("span");

  badge.className = "selected-pill";

  badge.textContent = preview.selected;

  card.appendChild(badge);


  // ====================================================
  // CHANGE LANGUAGE PREVIEW SCREEN
  // ====================================================

  const languageScreen =
    document.getElementById("screen-language");

  if (languageScreen) {

    // Main heading
    const heading =
      languageScreen.querySelector("h2");

    if (heading) {
      heading.textContent = preview.title;
    }

    // Description
    const description =
      languageScreen.querySelector(".panel-desc");

    if (description) {
      description.textContent = preview.subtitle;
    }

    // Listen button
    const listenButton =
      languageScreen.querySelector(".icon-btn");

    if (listenButton) {
      listenButton.textContent = preview.listen;
    }

    // Panel buttons
    const buttons =
      languageScreen.querySelectorAll(".panel-actions button");

    if (buttons.length >= 2) {

      buttons[0].textContent = preview.back;
      buttons[1].textContent = preview.continue;

    }
  }


  // ====================================================
  // APPLY LANGUAGE TO REST OF WEBSITE
  // ====================================================

  if (typeof applyLanguage === "function") {
    applyLanguage(selectedPortalLanguage);
  }

  // Save selected language
  try {
    localStorage.setItem(
      "sehatkendra-lang",
      selectedPortalLanguage
    );
  } catch (error) {}

}


// ======================================================
// INITIAL LANGUAGE
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

  const englishCard =
    document.querySelector(
      '.lang-card[data-lang="English"]'
    );

  if (englishCard) {
    selectLanguage(englishCard);
  }

});
// ======================================================
// DIGITAL PRESCRIPTION CENTER - FIX
// ======================================================

function openPrescriptionCenter() {

    console.log("Prescription Center clicked");

    // Hide every screen
    document.querySelectorAll(".screen").forEach(function(screen) {
        screen.classList.remove("active");
    });

    // Find prescription screen
    const prescriptionScreen =
        document.getElementById("screen-prescription");

    if (!prescriptionScreen) {
        alert("ERROR: screen-prescription not found!");
        console.error("screen-prescription not found");
        return;
    }

    // Show prescription screen
    prescriptionScreen.classList.add("active");

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Load saved prescriptions
    if (typeof loadPrescriptions === "function") {
        loadPrescriptions();
    }

    if (typeof renderSavedPrescriptions === "function") {
        renderSavedPrescriptions();
    }

    console.log("Prescription Center opened successfully");
}


// ======================================================
// PRESCRIPTION BACK BUTTON
// ======================================================

function closePrescriptionCenter() {
    document.querySelectorAll(".screen").forEach(function(screen) {
        screen.classList.remove("active");
    });

    const dashboard =
        document.getElementById("screen-dashboard");

    if (dashboard) {
        dashboard.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
// ============================================================
// SEHAT KENDRA - PRESCRIPTION CENTER BACKEND CONNECTION
// ============================================================

const PRESCRIPTION_API = "http://127.0.0.1:8000";
const PRESCRIPTION_PATIENT_ID = 1;


// ============================================================
// OPEN PRESCRIPTION CENTER
// ============================================================

async function openPrescriptionCenter() {

    console.log("Opening Prescription Center");

    // Hide all screens
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    // Show prescription screen
    const screen = document.getElementById("screen-prescription");

    if (!screen) {
        alert("Prescription Center screen not found.");
        return;
    }

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Load saved prescriptions
    await loadPrescriptionsFromBackend();
}


// ============================================================
// LOAD PRESCRIPTIONS FROM SUPABASE THROUGH FASTAPI
// ============================================================

async function loadPrescriptionsFromBackend() {

    const container =
        document.getElementById("rxSavedList");

    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">⏳</div>
            <p>Loading your prescriptions...</p>
        </div>
    `;

    try {

        const response = await fetch(
            `${PRESCRIPTION_API}/prescriptions/${PRESCRIPTION_PATIENT_ID}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Could not load prescriptions"
            );
        }

        const prescriptions =
            data.prescriptions || [];

        if (prescriptions.length === 0) {

            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>No saved prescriptions yet.</p>
                    <p class="muted">
                        Upload a prescription or speak your symptoms.
                    </p>
                </div>
            `;

            return;
        }

        container.innerHTML = prescriptions.map(rx => {

            const medicines =
                Array.isArray(rx.medicines)
                    ? rx.medicines
                    : [];

            return `
                <div class="rx-list-item">

                    <div>

                        <strong>
                            ${rx.diagnosis || "Digital Prescription"}
                        </strong>

                        <p class="muted">
                            ${rx.symptoms || "No symptoms recorded"}
                        </p>

                        <small>
                            ${medicines.length} medicine(s)
                        </small>

                    </div>

                    <span class="rx-source-tag">
                        ${rx.source || "Digital"}
                    </span>

                </div>
            `;

        }).join("");

    } catch (error) {

        console.error(
            "Prescription loading error:",
            error
        );

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">⚠️</div>

                <p>
                    Unable to connect to the prescription backend.
                </p>

                <button
                    class="btn btn-outline"
                    onclick="loadPrescriptionsFromBackend()"
                >
                    Retry
                </button>

            </div>
        `;
    }
}


// ============================================================
// UPLOAD / SCAN PRESCRIPTION
// ============================================================

async function handlePrescriptionUpload(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    if (!file) return;


    const thumb =
        document.getElementById("rxPreviewThumb");

    const status =
        document.getElementById("rxScanStatus");


    // Image preview
    if (
        file.type &&
        file.type.startsWith("image/")
    ) {

        const reader =
            new FileReader();

        reader.onload = function(e) {

            if (thumb) {

                thumb.src = e.target.result;

                thumb.classList.remove("hidden");
            }
        };

        reader.readAsDataURL(file);

    } else {

        if (thumb) {
            thumb.classList.add("hidden");
        }
    }


    if (status) {
        status.classList.remove("hidden");
    }


    try {

        // Ask backend to process prescription
        const scanResponse =
            await fetch(
                `${PRESCRIPTION_API}/prescriptions/scan`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        patient_id:
                            String(
                                PRESCRIPTION_PATIENT_ID
                            ),

                        filename:
                            file.name
                    })
                }
            );


        const scanData =
            await scanResponse.json();


        if (!scanResponse.ok) {

            throw new Error(
                scanData.detail ||
                "Prescription scan failed"
            );
        }


        const prescription =
            scanData.prescription;


        // Save prescription to Supabase
        const saveResponse =
            await fetch(
                `${PRESCRIPTION_API}/prescriptions`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            prescription
                        )
                }
            );


        const saveData =
            await saveResponse.json();


        if (!saveResponse.ok) {

            throw new Error(
                saveData.detail ||
                "Prescription could not be saved"
            );
        }

// Hide scanning status
const scanStatus =
    document.getElementById("rxScanStatus");

if (scanStatus) {
    scanStatus.classList.add("hidden");
    scanStatus.style.display = "none";
}

// Show success message inside the page
const successBox =
    document.createElement("div");

successBox.style.cssText = `
    margin: 20px 0;
    padding: 18px 22px;
    border-radius: 12px;
    background: #e8f7ee;
    border: 1px solid #42a66b;
    color: #155724;
    font-size: 17px;
`;

successBox.innerHTML = `
    <strong>✅ Prescription scanned and saved successfully!</strong>
    <div style="margin-top:8px;">
        Diagnosis:
        ${prescription.diagnosis || "Recorded"}
    </div>
    <div style="margin-top:6px;">
        Saved to your digital health record.
    </div>
`;

const prescriptionScreen =
    document.getElementById("screen-prescription");

if (prescriptionScreen) {

    const panel =
        prescriptionScreen.querySelector(".panel");

    if (panel) {
        panel.prepend(successBox);
    } else {
        prescriptionScreen.prepend(successBox);
    }
}

        // Refresh list
        await loadPrescriptionsFromBackend();


    } catch (error) {

        console.error(
            "Prescription error:",
            error
        );

        alert(
            "❌ Prescription processing failed.\n\n" +
            error.message
        );

    } finally {

        if (status) {
            status.classList.add("hidden");
        }
    }
}


// ============================================================
// VOICE RECOGNITION
// ============================================================

let prescriptionRecognition = null;
let prescriptionRecording = false;


function toggleVoiceCapture() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Voice recognition is not supported in this browser."
        );

        return;
    }


    const button =
        document.getElementById("rxVoiceBtn");

    const transcript =
        document.getElementById("rxTranscript");

    const language =
        document.getElementById("rxVoiceLang");


    // Stop recording
    if (prescriptionRecording) {

        if (prescriptionRecognition) {
            prescriptionRecognition.stop();
        }

        return;
    }


    prescriptionRecognition =
        new SpeechRecognition();


    prescriptionRecognition.lang =
        language
            ? language.value
            : "en-IN";


    prescriptionRecognition.continuous = false;

    prescriptionRecognition.interimResults = true;


    prescriptionRecognition.onstart =
        function() {

            prescriptionRecording = true;

            if (button) {
                button.textContent =
                    "🛑 Stop Speaking";
            }
        };


    prescriptionRecognition.onresult =
        function(event) {

            let text = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                text +=
                    event.results[i][0].transcript;
            }


            if (transcript) {
                transcript.value = text;
            }
        };


    prescriptionRecognition.onerror =
        function(event) {

            console.error(
                "Speech error:",
                event.error
            );

            alert(
                "Voice recognition error: " +
                event.error
            );
        };


    prescriptionRecognition.onend =
        function() {

            prescriptionRecording = false;

            if (button) {

                button.textContent =
                    "🎙 Tap to Start Speaking";
            }
        };


    prescriptionRecognition.start();
}


// ============================================================
// CREATE DIGITAL PRESCRIPTION FROM VOICE
// ============================================================

async function draftPrescriptionFromVoice() {

    const transcript =
        document.getElementById(
            "rxTranscript"
        );


    const language =
        document.getElementById(
            "rxVoiceLang"
        );


    const symptoms =
        transcript
            ? transcript.value.trim()
            : "";


    if (!symptoms) {

        alert(
            "Please speak or type your symptoms first."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${PRESCRIPTION_API}/prescriptions/voice-draft`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        patient_id:
                            String(
                                PRESCRIPTION_PATIENT_ID
                            ),

                        symptoms:
                            symptoms,

                        language:
                            language
                                ? language.value
                                : "en-IN"
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Voice prescription failed"
            );
        }


        const draft =
            data.draft;


        // Save generated prescription
        const saveResponse =
            await fetch(
                `${PRESCRIPTION_API}/prescriptions`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(draft)
                }
            );


        const saveData =
            await saveResponse.json();


        if (!saveResponse.ok) {

            throw new Error(
                saveData.detail ||
                "Prescription could not be saved"
            );
        }


        alert(
            "✅ Digital prescription created and saved!"
        );


        // Refresh saved prescriptions
        await loadPrescriptionsFromBackend();


    } catch (error) {

        console.error(
            "Voice prescription error:",
            error
        );

        alert(
            "❌ Could not create prescription.\n\n" +
            error.message
        );
    }
}
// ============================================================
// FINAL PRESCRIPTION UPLOAD FIX
// This MUST be at the very bottom of script.js
// ============================================================

async function handlePrescriptionUpload(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    if (!file) return;

    const thumb =
        document.getElementById("rxPreviewThumb");

    const status =
        document.getElementById("rxScanStatus");

    try {

        // Show image preview
        if (
            file.type &&
            file.type.startsWith("image/")
        ) {

            const reader = new FileReader();

            reader.onload = function(e) {

                if (thumb) {

                    thumb.src = e.target.result;

                    thumb.classList.remove("hidden");
                }
            };

            reader.readAsDataURL(file);
        }


        // Show scanning message
        if (status) {
            status.classList.remove("hidden");
        }


        console.log("Sending prescription to backend...");


        // =====================================================
        // STEP 1 — SCAN
        // =====================================================

        const scanResponse = await fetch(
            "http://127.0.0.1:8000/prescriptions/scan",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    patient_id: "1",
                    filename: file.name
                })
            }
        );


        const scanData =
            await scanResponse.json();


        console.log(
            "SCAN RESPONSE:",
            scanData
        );


        if (!scanResponse.ok) {

            throw new Error(
                typeof scanData.detail === "string"
                    ? scanData.detail
                    : JSON.stringify(scanData.detail)
            );
        }


        if (!scanData.prescription) {

            throw new Error(
                "Backend did not return a prescription."
            );
        }


        const prescription =
            scanData.prescription;


        console.log(
            "Prescription generated:",
            prescription
        );


        // =====================================================
        // STEP 2 — SAVE TO SUPABASE
        // =====================================================

        const saveResponse = await fetch(
            "http://127.0.0.1:8000/prescriptions",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    patient_id:
                        String(
                            prescription.patient_id || 1
                        ),

                    diagnosis:
                        prescription.diagnosis || "",

                    symptoms:
                        prescription.symptoms || "",

                    medicines:
                        Array.isArray(
                            prescription.medicines
                        )
                            ? prescription.medicines
                            : [],

                    source:
                        prescription.source ||
                        "Scanned",

                    notes:
                        prescription.notes || "",

                    draft:
                        prescription.draft === true
                })
            }
        );


        const saveData =
            await saveResponse.json();


        console.log(
            "SAVE RESPONSE:",
            saveData
        );


        if (!saveResponse.ok) {

            let errorMessage =
                "Could not save prescription.";

            if (saveData.detail) {

                errorMessage =
                    typeof saveData.detail === "string"
                        ? saveData.detail
                        : JSON.stringify(
                            saveData.detail
                        );
            }

            throw new Error(errorMessage);
        }


        // =====================================================
        // SUCCESS
        // =====================================================

        if (status) {
            status.classList.add("hidden");
        }


        alert(
            "✅ Prescription scanned successfully!\n\n" +
            "Diagnosis: " +
            (prescription.diagnosis || "Recorded") +
            "\n\nSaved to your digital health record."
        );


        // Reload saved prescriptions
        if (
            typeof loadPrescriptionsFromBackend ===
            "function"
        ) {

            await loadPrescriptionsFromBackend();

        } else if (
            typeof loadBackendPrescriptions ===
            "function"
        ) {

            await loadBackendPrescriptions();
        }



    } catch (error) {

        console.error(
            "FINAL PRESCRIPTION ERROR:",
            error
        );


        if (status) {
            status.classList.add("hidden");
        }


        alert(
            "❌ Prescription processing failed.\n\n" +
            (
                error && error.message
                    ? error.message
                    : JSON.stringify(error)
            )
        );
    }
}
function hidePrescriptionScanStatus() {
    const status = document.getElementById("rxScanStatus");

    if (status) {
        status.classList.add("hidden");
        status.style.display = "none";
    }
}
// ============================================================
// THEME BUTTON FIX
// ============================================================

function toggleTheme() {
    const current =
        document.documentElement.getAttribute("data-theme") || "light";

    const newTheme =
        current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute(
        "data-theme",
        newTheme
    );

    const button =
        document.getElementById("themeToggleBtn");

    if (button) {
        button.textContent =
            newTheme === "dark" ? "☀️" : "🌙";
    }

    try {
        localStorage.setItem(
            "sehatkendra-theme",
            newTheme
        );
    } catch (e) {}

    console.log("Theme changed:", newTheme);
}


// ============================================================
// LISTEN / TEXT-TO-SPEECH FIX
// ============================================================

let sehatKendraSpeech = null;

function listenPage() {

    if (
        !("speechSynthesis" in window)
    ) {
        alert(
            "Voice reading is not supported in this browser."
        );
        return;
    }

    // Stop if already speaking
    if (speechSynthesis.speaking) {

        speechSynthesis.cancel();

        console.log("Speech stopped.");

        return;
    }

    // Get currently visible screen
    const activeScreen =
        document.querySelector(".screen.active");

    if (!activeScreen) {
        return;
    }

    // Get readable text
    const text =
        activeScreen.innerText
            .replace(/\s+/g, " ")
            .trim();

    if (!text) {
        alert("There is no text to read.");
        return;
    }

    sehatKendraSpeech =
        new SpeechSynthesisUtterance(text);

    const language =
        document.documentElement.lang || "en";

    const speechLanguages = {
        en: "en-IN",
        hi: "hi-IN",
        bn: "bn-IN",
        ta: "ta-IN",
        mr: "mr-IN",
        or: "en-IN"
    };

    sehatKendraSpeech.lang =
        speechLanguages[language] || "en-IN";

    sehatKendraSpeech.rate = 0.9;
    sehatKendraSpeech.pitch = 1;
    sehatKendraSpeech.volume = 1;

    speechSynthesis.speak(
        sehatKendraSpeech
    );
}


// ============================================================
// INITIALIZE THEME
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        let savedTheme = "light";

        try {
            savedTheme =
                localStorage.getItem(
                    "sehatkendra-theme"
                ) || "light";
        } catch (e) {}

        document.documentElement.setAttribute(
            "data-theme",
            savedTheme
        );

        const button =
            document.getElementById(
                "themeToggleBtn"
            );

        if (button) {
            button.textContent =
                savedTheme === "dark"
                    ? "☀️"
                    : "🌙";
        }
    }
);
