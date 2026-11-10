
const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");
const strengthText = document.getElementById("strengthText");
const strengthBar = document.getElementById("strengthBar");
const summary = document.getElementById("summary");
const tipsText = document.getElementById("tipsText");
const clearButton = document.getElementById("clearButton");

const checks = {
    length: document.getElementById("lengthCheck"),
    upper: document.getElementById("upperCheck"),
    lower: document.getElementById("lowerCheck"),
    number: document.getElementById("numberCheck"),
    symbol: document.getElementById("symbolCheck")
};

function updateCheck(element, passed, label) {
    if (!element) return;

    element.textContent = (passed ? "✓ " : "○ ") + label;
    element.classList.toggle("pass", passed);
}

function analyzePassword() {
    const password = passwordInput.value;

    const results = {
        length: password.length >= 12,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password)
    };

    updateCheck(checks.length, results.length, "At least 12 characters");
    updateCheck(checks.upper, results.upper, "Contains an uppercase letter");
    updateCheck(checks.lower, results.lower, "Contains a lowercase letter");
    updateCheck(checks.number, results.number, "Contains a number");
    updateCheck(checks.symbol, results.symbol, "Contains a symbol");

    const score = Object.values(results).filter(Boolean).length;

    if (!password) {
        strengthText.textContent = "Not checked";
        strengthBar.style.width = "0%";
        summary.textContent = "Enter a sample password to begin.";
        tipsText.textContent = "Use a long, unique password or passphrase.";
        return;
    }

    let level;
    let width;
    let color;

    if (password.length < 8 || score <= 2) {
        level = "Weak";
        width = "25%";
        color = "#f87171";
    } else if (score === 3) {
        level = "Fair";
        width = "50%";
        color = "#fbbf24";
    } else if (score === 4) {
        level = "Good";
        width = "75%";
        color = "#60a5fa";
    } else {
        level = "Strong checklist";
        width = "100%";
        color = "#4ade80";
    }

    strengthText.textContent = level;
    strengthBar.style.width = width;
    strengthBar.style.background = color;

    summary.textContent =
        score + " of 5 checklist conditions met. " +
        "This is a basic estimate, not a guarantee of security.";

    const tips = [];

    if (!results.length) tips.push("Use at least 12 characters.");
    if (!results.upper) tips.push("Consider an uppercase letter.");
    if (!results.lower) tips.push("Consider a lowercase letter.");
    if (!results.number) tips.push("Consider a number.");
    if (!results.symbol) tips.push("Consider a symbol.");

    if (tips.length === 0) {
        tips.push("All five checklist conditions are met.");
        tips.push("Use a unique password that isn't predictable.");
    }

    tipsText.textContent = tips.join("\n");
}

if (passwordInput) {
    passwordInput.addEventListener("input", analyzePassword);
}

if (toggleButton && passwordInput) {
    toggleButton.addEventListener("click", function () {
        const show = passwordInput.type === "password";
        passwordInput.type = show ? "text" : "password";
        toggleButton.textContent = show ? "Hide" : "Show";
    });
}

if (clearButton && passwordInput) {
    clearButton.addEventListener("click", function () {
        passwordInput.value = "";
        passwordInput.type = "password";

        if (toggleButton) toggleButton.textContent = "Show";

        analyzePassword();
        passwordInput.focus();
    });
}

if (passwordInput && strengthText && strengthBar &&
    summary && tipsText && Object.values(checks).every(Boolean)) {
    analyzePassword();
} else {
    console.error(
        "Password Analyzer: An HTML element is missing or has the wrong ID."
    );
}
