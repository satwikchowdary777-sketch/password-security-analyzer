
const input = document.getElementById("shaStepInput");
const startButton = document.getElementById("shaStartButton");
const previousButton = document.getElementById("shaPrevious");
const nextButton = document.getElementById("shaNext");

const counter = document.getElementById("shaStepCounter");
const title = document.getElementById("shaStepTitle");
const description = document.getElementById("shaStepDescription");
const details = document.getElementById("shaStepDetails");
const progress = document.getElementById("shaProgressBar");
const finalHash = document.getElementById("shaFinalHash");

let stages = [];
let current = 0;

function hex(bytes) {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join(" ");
}

function readableBytes(bytes) {
    return Array.from(bytes)
        .map(b => {
            if (b >= 32 && b <= 126) {
                return String.fromCharCode(b);
            }
            return ".";
        })
        .join("");
}

function formatHash(bytes) {
    return Array.from(new Uint8Array(bytes))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

async function runSimulation() {
    const text = input.value;
    const bytes = new TextEncoder().encode(text);

    // Calculate the SHA-256 padding for explanation.
    const originalBits = BigInt(bytes.length) * 8n;
    const zeroBytes =
        (56 - ((bytes.length + 1) % 64) + 64) % 64;

    const totalBytes = bytes.length + 1 + zeroBytes + 8;
    const blockCount = totalBytes / 64;

    const padded = new Uint8Array(totalBytes);
    padded.set(bytes);
    padded[bytes.length] = 0x80;

    let length = originalBits;

    for (let i = 0; i < 8; i++) {
        padded[totalBytes - 1 - i] =
            Number(length & 255n);
        length >>= 8n;
    }

    // This produces the genuine SHA-256 digest.
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    const result = formatHash(digest);

    stages = [
        {
            title: "1. Start with your message",
            description:
                "Everything starts with the data you enter. " +
                "SHA-256 can process a short word, a long document, " +
                "or other data.",
            details:
                "YOUR MESSAGE\n" +
                (text.length ? JSON.stringify(text) : "(empty text)") +
                "\n\nWhat to understand:\n" +
                "• The message is the input.\n" +
                "• Different inputs normally produce different digests.\n" +
                "• The same input produces the same digest."
        },
        {
            title: "2. Turn the message into bytes",
            description:
                "The computer represents text using numbers called bytes. " +
                "UTF-8 is the encoding used by this demonstration.",
            details:
                "TEXT\n" + (text || "(empty text)") +
                "\n\nUTF-8 BYTES (hexadecimal)\n" +
                (hex(bytes) || "(no bytes)") +
                "\n\nBYTE COUNT: " + bytes.length +
                "\n\nThink of bytes as the numerical form of your message."
        },
        {
            title: "3. Prepare the message with padding",
            description:
                "SHA-256 needs data arranged into 512-bit blocks. " +
                "It appends a 1 bit, adds zero bits, and stores the " +
                "original message length in a 64-bit field.",
            details:
                "Original message: " + bytes.length + " bytes" +
                "\nOriginal length: " + originalBits + " bits" +
                "\nPadding marker: 1 bit (starts with hex 80)" +
                "\nZero padding: " + zeroBytes + " bytes" +
                "\nLength field: 64 bits" +
                "\nPrepared message: " + totalBytes + " bytes" +
                "\n\nThe final prepared size is a multiple of 64 bytes."
        },
        {
            title: "4. Divide into 512-bit blocks",
            description:
                "The prepared message is divided into blocks. " +
                "Every block contains 512 bits, which is 64 bytes. " +
                "SHA-256 processes the blocks in sequence.",
            details:
                "BLOCK SIZE: 512 bits (64 bytes)" +
                "\nPREPARED MESSAGE: " + totalBytes + " bytes" +
                "\nNUMBER OF BLOCKS: " + blockCount +
                "\n\nFor the word 'hello', the padded message fits " +
                "into one block. Longer messages may need more blocks."
        },
        {
            title: "5. Mix the data through 64 rounds",
            description:
                "SHA-256 uses mathematical operations to repeatedly " +
                "mix the block with its internal hash state. This is " +
                "not encryption: there is no decryption key.",
            details:
                "Each block is processed through 64 rounds." +
                "\n\nThe algorithm uses:" +
                "\n• Bit rotations and shifts" +
                "\n• XOR and other bitwise operations" +
                "\n• Fixed mathematical constants" +
                "\n• Addition modulo 2^32" +
                "\n\nThese operations create a complex dependency " +
                "between the input data and the resulting digest." +
                "\n\nThis is a conceptual explanation, not a trace " +
                "of the browser's private internal calculations."
        },
        {
            title: "6. Receive the final hash",
            description:
                "The final result is a 256-bit digest. It is normally " +
                "written in hexadecimal, with two characters per byte.",
            details:
                "DIGEST SIZE: 256 bits" +
                "\nDIGEST SIZE: 32 bytes" +
                "\nHEX CHARACTERS: 64" +
                "\n\nFINAL SHA-256 HASH\n" + result +
                "\n\nChanging the input changes the digest. " +
                "The digest is not intended to be converted back " +
                "into the original message."
        }
    ];

    current = 0;
    renderStage();

    finalHash.textContent = result;
}

function renderStage() {
    const stage = stages[current];

    if (!stage) return;

    counter.textContent =
        "Step " + (current + 1) + " of " + stages.length;

    title.textContent = stage.title;
    description.textContent = stage.description;
    details.textContent = stage.details;

    progress.style.width =
        ((current + 1) / stages.length * 100) + "%";

    previousButton.disabled = current === 0;
    nextButton.disabled = current === stages.length - 1;
}

startButton.addEventListener("click", async () => {
    startButton.disabled = true;
    finalHash.textContent = "Calculating...";

    try {
        await runSimulation();
    } catch (error) {
        console.error(error);
        finalHash.textContent =
            "Unable to calculate the hash. Refresh and try again.";
    } finally {
        startButton.disabled = false;
    }
});

previousButton.addEventListener("click", () => {
    if (current > 0) {
        current--;
        renderStage();
    }
});

nextButton.addEventListener("click", () => {
    if (current < stages.length - 1) {
        current++;
        renderStage();
    }
});
