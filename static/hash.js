
const hashInput = document.getElementById("hashInput");
const hashInput2 = document.getElementById("hashInput2");
const hashButton = document.getElementById("hashButton");

const hashOutput = document.getElementById("hashOutput");
const hashOutput2 = document.getElementById("hashOutput2");
const hashStatus = document.getElementById("hashStatus");
const hashComparison = document.getElementById("hashComparison");

async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const result = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(result))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

hashButton.addEventListener("click", async function () {
    const first = hashInput.value;
    const second = hashInput2.value;

    if (first.length === 0 && second.length === 0) {
        hashStatus.textContent = "Please enter sample text first.";
        hashOutput.textContent = "No hash generated.";
        hashOutput2.textContent = "No hash generated.";
        hashComparison.textContent = "Nothing to compare.";
        return;
    }

    hashButton.disabled = true;
    hashStatus.textContent = "Generating hashes...";

    try {
        if (first.length > 0) {
            hashOutput.textContent = await sha256(first);
        } else {
            hashOutput.textContent = "No input provided.";
        }

        if (second.length > 0) {
            hashOutput2.textContent = await sha256(second);
        } else {
            hashOutput2.textContent = "No input provided.";
        }

        if (first.length > 0 && second.length > 0) {
            const firstHash = await sha256(first);
            const secondHash = await sha256(second);

            hashComparison.textContent =
                firstHash === secondHash
                    ? "Both hashes match."
                    : "The hashes differ.";
        } else {
            hashComparison.textContent =
                "Enter text in both fields to compare the hashes.";
        }

        hashStatus.textContent = "Hash generation completed.";
    } catch (error) {
        hashStatus.textContent =
            "Hash generation failed. Try a supported browser.";
        console.error(error);
    } finally {
        hashButton.disabled = false;
    }
});
