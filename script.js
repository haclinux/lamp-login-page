const scene = document.getElementById("scene");
const lampToggle = document.getElementById("lampToggle");
const lampHint = document.getElementById("lampHint");
const stars = document.getElementById("stars");
const authCard = document.getElementById("authCard");
const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const cardViews = authCard.querySelector(".card-views");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");
const toast = document.getElementById("toast");
const accountDemo = document.getElementById("accountDemo");
const accountDemoTitle = document.getElementById("accountDemoTitle");
const accountDemoList = document.getElementById("accountDemoList");

let toastTimer;
let revealTimer;
let switchPullStart;
let viewSwitching = false;

cardViews.style.height = `${loginView.scrollHeight}px`;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

for (let i = 0; i < 32; i++) {
  const dot = document.createElement("span");
  dot.className = "firefly";
  const column = i % 8;
  const row = Math.floor(i / 8);
  dot.style.left = `${((column + 0.2 + Math.random() * 0.6) / 8) * 100}%`;
  dot.style.top = `${((row + 0.15 + Math.random() * 0.7) / 4) * 100}%`;
  dot.style.setProperty("--size", `${2 + Math.random() * 2}px`);
  dot.style.setProperty("--duration", `${3 + Math.random() * 5}s`);
  dot.style.setProperty("--delay", `${Math.random() * -7}s`);
  dot.style.setProperty("--drift-x", `${Math.random() * 30 - 15}px`);
  dot.style.setProperty("--drift-y", `${Math.random() * 38 - 30}px`);
  stars.appendChild(dot);
}

function toggleLamp() {
  const isOff = scene.classList.toggle("lamp-off");
  lampToggle.setAttribute("aria-label", isOff ? "Pull the switch to turn the lamp on" : "Pull the switch to turn the lamp off");
  lampToggle.setAttribute("aria-pressed", String(!isOff));
  lampHint.textContent = isOff ? "PULL THE SWITCH TO TURN ON THE LIGHT" : "PULL THE SWITCH AGAIN TO TURN OFF";
  window.clearTimeout(revealTimer);

  if (isOff) {
    authCard.inert = true;
  } else {
    const revealDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 280;
    revealTimer = window.setTimeout(() => {
      if (!scene.classList.contains("lamp-off")) authCard.inert = false;
    }, revealDelay);
  }
}

lampToggle.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  switchPullStart = event.clientY;
  lampToggle.classList.add("is-pulling");
  lampToggle.setPointerCapture(event.pointerId);
});

lampToggle.addEventListener("pointermove", (event) => {
  if (switchPullStart === undefined || !lampToggle.hasPointerCapture(event.pointerId)) return;
  const pullDistance = Math.max(0, Math.min(44, event.clientY - switchPullStart));
  lampToggle.style.setProperty("--pull-distance", `${pullDistance}px`);
});

function finishSwitchPull(event) {
  if (switchPullStart === undefined) return;
  const pullDistance = Math.max(0, event.clientY - switchPullStart);
  switchPullStart = undefined;
  lampToggle.classList.remove("is-pulling");
  lampToggle.style.removeProperty("--pull-distance");
  if (pullDistance >= 20) toggleLamp();
}

lampToggle.addEventListener("pointerup", finishSwitchPull);
lampToggle.addEventListener("pointercancel", () => {
  switchPullStart = undefined;
  lampToggle.classList.remove("is-pulling");
  lampToggle.style.removeProperty("--pull-distance");
});

lampToggle.addEventListener("click", (event) => {
  if (event.detail === 0) toggleLamp();
});

document.querySelectorAll("[data-password-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.passwordToggle);
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    button.textContent = showing ? "SHOW" : "HIDE";
    button.setAttribute("aria-label", showing ? "Show password" : "Hide password");
  });
});

function setFormMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
}

function setActiveView(activeView, inactiveView) {
  activeView.classList.add("is-active");
  activeView.removeAttribute("aria-hidden");
  activeView.inert = false;
  inactiveView.classList.remove("is-active");
  inactiveView.setAttribute("aria-hidden", "true");
  inactiveView.inert = true;
}

function waitForCardResize() {
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, 500);
    cardViews.addEventListener("transitionend", (event) => {
      if (event.target !== cardViews || event.propertyName !== "height") return;
      window.clearTimeout(timer);
      resolve();
    }, { once: true });
  });
}

async function activateView(activeView, inactiveView) {
  if (viewSwitching || activeView.classList.contains("is-active")) return;

  viewSwitching = true;
  authCard.classList.add("is-switching");
  setFormMessage(loginMessage, "");
  setFormMessage(registerMessage, "");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    setActiveView(activeView, inactiveView);
    cardViews.style.height = `${activeView.scrollHeight}px`;
  } else {
    cardViews.style.height = `${inactiveView.scrollHeight}px`;
    cardViews.offsetHeight;
    inactiveView.classList.remove("is-active");
    inactiveView.setAttribute("aria-hidden", "true");
    inactiveView.inert = true;
    cardViews.style.height = "0px";
    await waitForCardResize();

    setActiveView(activeView, inactiveView);
    cardViews.offsetHeight;
    cardViews.style.height = `${activeView.scrollHeight}px`;
    await waitForCardResize();
  }

  authCard.classList.remove("is-switching");
  viewSwitching = false;
  activeView.querySelector("input").focus();
}

window.addEventListener("resize", () => {
  if (!viewSwitching) {
    const activeView = registerView.classList.contains("is-active") ? registerView : loginView;
    cardViews.style.height = `${activeView.scrollHeight}px`;
  }
});

document.getElementById("signupLink").addEventListener("click", (event) => {
  event.preventDefault();
  activateView(registerView, loginView);
});

document.getElementById("signinLink").addEventListener("click", (event) => {
  event.preventDefault();
  activateView(loginView, registerView);
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  if (!email.value.trim()) {
    setFormMessage(loginMessage, "Enter your email address.", true);
    email.focus();
    return;
  }
  if (!email.validity.valid) {
    setFormMessage(loginMessage, "Enter a valid email address.", true);
    email.focus();
    return;
  }
  if (!password.value) {
    setFormMessage(loginMessage, "Enter your password.", true);
    password.focus();
    return;
  }
  if (password.value.length < 8) {
    setFormMessage(loginMessage, "Your password must be at least 8 characters.", true);
    password.focus();
    return;
  }

  setFormMessage(loginMessage, "");
  showToast("Details checked. Connect a secure authentication provider to sign in.");
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("registerEmail");
  const password = document.getElementById("registerPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  if (!fullName.value.trim()) {
    setFormMessage(registerMessage, "Enter your full name.", true);
    fullName.focus();
    return;
  }
  if (!email.value.trim()) {
    setFormMessage(registerMessage, "Enter your email address.", true);
    email.focus();
    return;
  }
  if (!email.validity.valid) {
    setFormMessage(registerMessage, "Enter a valid email address.", true);
    email.focus();
    return;
  }
  if (password.value.length < 8) {
    setFormMessage(registerMessage, "Choose a password with at least 8 characters.", true);
    password.focus();
    return;
  }
  if (confirmPassword.value !== password.value) {
    setFormMessage(registerMessage, "Your passwords do not match.", true);
    confirmPassword.focus();
    return;
  }

  setFormMessage(registerMessage, "");
  showToast("Details checked. Connect a secure authentication provider to create your account.");
});

document.getElementById("forgotLink").addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Password reset must be connected to a secure authentication provider.");
});
const sampleAccounts = [
  { name: "Alex Morgan", email: "alex.morgan@example.test", initials: "AM" },
  { name: "Sam Taylor", email: "sam.taylor@example.test", initials: "ST" },
  { name: "Jordan Lee", email: "jordan.lee@example.test", initials: "JL" }
];

function openAccountDemo(provider) {
  const isGoogle = provider === "Google";
  accountDemo.classList.toggle("provider-github", !isGoogle);
  accountDemoTitle.textContent = `Choose a ${provider} account`;
  accountDemoList.replaceChildren();

  sampleAccounts.forEach((account) => {
    const option = document.createElement("button");
    option.className = "demo-profile";
    option.type = "button";
    const avatar = document.createElement("span");
    avatar.className = "demo-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = account.initials;

    const details = document.createElement("span");
    details.className = "demo-account-copy";
    const name = document.createElement("span");
    name.className = "demo-account-name";
    name.textContent = account.name;
    const email = document.createElement("span");
    email.className = "demo-account-email";
    email.textContent = account.email;
    details.append(name, email);
    option.append(avatar, details);
    option.addEventListener("click", () => {
      accountDemo.close();
      showToast("Demo profile selected. This did not sign you in.");
    });
    accountDemoList.appendChild(option);
  });

  accountDemo.showModal();
  accountDemoList.querySelector("button").focus();
}

document.getElementById("googleButton").addEventListener("click", () => openAccountDemo("Google"));
document.getElementById("githubButton").addEventListener("click", () => openAccountDemo("GitHub"));
document.getElementById("closeAccountDemo").addEventListener("click", () => accountDemo.close());
accountDemo.addEventListener("click", (event) => {
  if (event.target === accountDemo) accountDemo.close();
});
document.getElementById("privacyLink").addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Add your privacy policy page here.");
});
document.getElementById("helpLink").addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Add your support email or help page here.");
});
