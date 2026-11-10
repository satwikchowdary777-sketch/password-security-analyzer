
const passwordInput = document.getElementById("password");
const guessRate = document.getElementById("guessRate");
const estimateOutput = document.getElementById("crackTimeEstimate");

function estimateTime() {
    const password = passwordInput.value;

    if (password.length === 0) {
        estimateOutput.textContent =
            "Enter a sample password to see an estimate.";
        return;
    }

    let pool = 0;

    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 33;

    const combinations = BigInt(pool) ** BigInt(password.length);
    const averageGuesses = combinations / 2n;
    const rate = Number(guessRate.value);
    const seconds = Number(averageGuesses) / rate;

    let result;

    if (seconds < 1) {
        result = "Less than a second";
    } else if (seconds < 60) {
        result = Math.round(seconds) + " seconds";
    } else if (seconds < 3600) {
        result = Math.round(seconds / 60) + " minutes";
    } else if (seconds < 86400) {
        result = Math.round(seconds / 3600) + " hours";
    } else if (seconds < 31557600) {
        result = Math.round(seconds / 86400) + " days";
    } else if (!Number.isFinite(seconds) ||
               seconds >= 31557600 * 1e6) {
        result = "Millions of years or more";
    } else {
        result = Math.round(seconds / 31557600) + " years";
    }

    estimateOutput.textContent =
        "Illustrative average guessing time: " + result;
}

passwordInput.addEventListener("input", estimateTime);
guessRate.addEventListener("change", estimateTime);
