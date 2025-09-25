// Paste your string between the quotes below (or assign s = document.querySelector('#tokenAddress').value)
const s = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE";

// Show raw representation & length
console.log("raw (JSON):", JSON.stringify(s));
console.log("length:", s.length);

// Regex extract 0x...40hex if present (handles URLs)
const match = s.match(/0x[a-fA-F0-9]{40}/);
console.log("regex match:", match ? match[0] : null);

// Candidate before cleaning
let candidate = match ? match[0] : s;
console.log("candidate (before strip):", JSON.stringify(candidate), "len:", candidate.length);

// Remove non-ASCII control characters and non-hex junk
const cleaned = candidate.replace(/[^\x20-\x7E]/g, "").replace(/[^0-9a-fA-Fx]/g, "");
console.log("cleaned candidate:", JSON.stringify(cleaned), "len:", cleaned.length);

// Print every char and its charCode (helps spot invisible or wrong chars)
for (let i = 0; i < s.length; i++) {
  console.log(i, JSON.stringify(s[i]), s[i], s.charCodeAt(i));
}
