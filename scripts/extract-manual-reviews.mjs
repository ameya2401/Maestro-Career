import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const inputPath = path.join(ROOT, "docs", "review.txt");
const outputDir = path.join(ROOT, "src", "data");
const outputPath = path.join(outputDir, "manualGoogleReviews.json");

const text = fs.readFileSync(inputPath, "utf8");
const lines = text.split(/\r?\n/);

const looksLikeStart = (i) => {
    const name = (lines[i] || "").trim();
    const next = (lines[i + 1] || "").trim();
    if (!name) return false;
    if (/^Response from the owner/i.test(name)) return false;
    // A review block starts with a name line followed by a line containing "review" or "reviews".
    return next.toLowerCase().includes("review");
};

let i = 0;
const reviews = [];

while (i < lines.length) {
    if (!looksLikeStart(i)) {
        i++;
        continue;
    }

    const authorName = (lines[i] || "").trim();
    i += 2; // skip "X review(s) ..." line

    // Skip until the relative time marker ("ago", "Edited ...")
    while (i < lines.length) {
        const t = (lines[i] || "").trim();
        if (/(\bago\b|\bEdited\b)/.test(t)) break;
        i++;
    }
    if (i < lines.length) i++; // move past time line

    const body = [];
    while (i < lines.length) {
        const raw = lines[i] || "";
        const t = raw.trim();

        if (!t) {
            if (body.length) {
                i++;
                break;
            }
            i++;
            continue;
        }

        // UI-only markers that sometimes appear after the time line
        if (t === "New") {
            i++;
            continue;
        }

        if (/^Response from the owner/i.test(t)) break;
        if (t === "Share" || t === "Like") break;
        if (t.startsWith("") || t.startsWith("")) break;
        if (t.startsWith("Translated by Google")) break;

        // Next review starts
        if (looksLikeStart(i)) break;

        body.push(raw.trimEnd());
        i++;
    }

    const reviewText = body.join("\n").trim();
    if (reviewText) {
        reviews.push({ authorName, text: reviewText, rating: 5 });
    }
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(reviews, null, 2) + "\n", "utf8");

console.log(`Extracted reviews: ${reviews.length}`);
