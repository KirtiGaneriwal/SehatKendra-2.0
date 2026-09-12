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

// ============ SAMPLE LOGIN ============
function loginAsSamplePatient() {
  state.patientName = "Smt. Ananya Sen";
  state.abhaId = "91-4421-8890-1204";
  state.conditions = ["Hypertension", "Diabetes"];
  state.medicines = [
    "Tab. Metformin 500mg",
    "Tab. Amlodipine 5mg"
  ];
  state.allergies = ["Penicillin (mild rash)"];

  enterApp("screen-dashboard");
}


// ============ GUEST LOGIN ============
function loginAsGuest() {
  state.patientName = "Guest Citizen";
  state.abhaId = "GUEST-0000-0000-0000";
  state.conditions = [];
  state.medicines = [];
  state.allergies = [];

  enterApp("screen-dashboard");
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

  const input = document.getElementById("mobileNumberInput");

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
}