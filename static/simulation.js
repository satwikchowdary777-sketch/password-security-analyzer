
const simPassword = document.getElementById("simPassword");
const simShowPassword = document.getElementById("simShowPassword");

const requirements = {
    length: document.getElementById("simLength"),
    upper: document.getElementById("simUpper"),
    lower: document.getElementById("simLower"),
    number: document.getElementById("simNumber"),
    symbol: document.getElementById("simSymbol")
};

const twoStatus = document.getElementById("simTwoStatus");
const fiveStatus = document.getElementById("simFiveStatus");
const twoSpace = document.getElementById("simTwoSpace");
const fiveSpace = document.getElementById("simFiveSpace");
const twoExplanation = document.getElementById("simTwoExplanation");
const fiveExplanation = document.getElementById("simFiveExplanation");
const simMeaning = document.getElementById("simMeaning");

function setRequirement(element, passed, label) {
    element.textContent = (passed ? "✓ " : "○ ") + label;
    element.classList.toggle("passed", passed);
}

function formatPossibilities(value) {
    return value.toExponential(3).replace("e+", " × 10^");
}

function updateSimulation() {
    const password = simPassword.value;

    if (!password) {
        Object.values(requirements).forEach(element => {
            element.classList.remove("passed");
        });

        requirements.length.textContent = "○ At least 12 characters";
        requirements.upper.textContent = "○ Contains an uppercase letter (A–Z)";
        requirements.lower.textContent = "○ Contains a lowercase letter (a–z)";
        requirements.number.textContent = "○ Contains a number (0–9)";
        requirements.symbol.textContent = "○ Contains a special character";

        twoStatus.textContent = "Waiting for input";
        fiveStatus.textContent = "Waiting for input";
        twoSpace.textContent = "—";
        fiveSpace.textContent = "—";

        twoExplanation.textContent = "Enter a sample to see the result.";
        fiveExplanation.textContent = "Enter a sample to see the result.";
        simMeaning.textContent =
            "Type a fictional password to compare the two policies.";
        return;
    }

    const longEnough = password.length >= 12;
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const symbol = /[^A-Za-z0-9]/.test(password);
    const lettersOnly = /^[A-Za-z]+$/.test(password);

    setRequirement(
        requirements.length, longEnough, "At least 12 characters"
    );
    setRequirement(
        requirements.upper, upper, "Contains an uppercase letter (A–Z)"
    );
    setRequirement(
        requirements.lower, lower, "Contains a lowercase letter (a–z)"
    );
    setRequirement(
        requirements.number, number, "Contains a number (0–9)"
    );
    setRequirement(
        requirements.symbol, symbol, "Contains a special character"
    );

    // Policy A: at least 12 characters, using letters only.
    const twoPass = longEnough && lettersOnly;

    // Policy B: at least 12 characters and all five requirements.
    const fivePass =
        longEnough && upper && lower && number && symbol;

    twoStatus.textContent = twoPass
        ? "✓ Policy requirements met"
        : "✗ Policy requirements not met";

    fiveStatus.textContent = fivePass
        ? "✓ Policy requirements met"
        : "✗ Policy requirements not met";


    twoSpace.textContent = formatPossibilities(twoPossibilities);
    fiveSpace.textContent = formatPossibilities(fivePossibilities);

    twoExplanation.textContent = twoPass
        ? "This sample meets the two-condition policy."
        : "This sample does not meet the two-condition policy.";

    fiveExplanation.textContent = fivePass
        ? "This sample meets all five requirements."
        : "This sample does not meet all five requirements.";

    if (twoPass && fivePass) {
        simMeaning.textContent =
            "This sample meets both example policies. Meeting a checklist " +
            "does not prove that a password is unpredictable or unique.";
    } else if (fivePass && !twoPass) {
        simMeaning.textContent =
            "This sample meets the five-requirement policy but not the " +
            "letters-only policy. The policies accept different kinds " +
            "of passwords.";
    } else if (twoPass && !fivePass) {
        simMeaning.textContent =
            "This sample meets the letters-only policy but misses at " +
            "least one five-requirement condition.";
    } else {
        simMeaning.textContent =
            "This sample does not meet either example policy. " +
            "Check the requirements highlighted above.";
    }
}

simPassword.addEventListener("input", updateSimulation);

simShowPassword.addEventListener("change", () => {
    simPassword.type = simShowPassword.checked ? "text" : "password";
});

updateSimulation();
