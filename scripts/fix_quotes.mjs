import { readFileSync, writeFileSync } from "fs";

const file = "client/src/pages/Story.tsx";
let src = readFileSync(file, "utf8");

// The previous sed turned curly quotes into literal \u201c \u201d text sequences.
// Convert those literal sequences back to actual characters first, then escape
// them properly inside JSX string literals.

// Normalize any leftover literal escapes to actual chars
src = src.replace(/\\u201[cC]/g, "\u201c").replace(/\\u201[dD]/g, "\u201d");

// Now escape curly quotes inside JSX:
// Case 1: inside quoted strings "..." -> replace with escaped sequences
src = src.replace(/"([^"\n]*?[\u201c\u201d][^"\n]*?)"/g, (m, inner) => {
  return '"' + inner.replace(/\u201c/g, "\\u201c").replace(/\u201d/g, "\\u201d") + '"';
});
// Case 2: inside single-quoted strings '...'
src = src.replace(/'([^'\n]*?[\u201c\u201d][^'\n]*?)'/g, (m, inner) => {
  return "'" + inner.replace(/\u201c/g, "\\u201c").replace(/\u201d/g, "\\u201d") + "'";
});
// Case 3: unquoted JSX text nodes (between > and <) keep actual characters — valid JSX
// Any remaining unescaped curly quotes in template literals `...`
src = src.replace(/`([^`\n]*?[\u201c\u201d][^`\n]*?)`/g, (m, inner) => {
  return "`" + inner.replace(/\u201c/g, "\\u201c").replace(/\u201d/g, "\\u201d") + "`";
});

writeFileSync(file, src);
console.log("done");
