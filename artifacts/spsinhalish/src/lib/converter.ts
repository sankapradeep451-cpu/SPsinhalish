export type ConversionMode = "unicode" | "legacy";

const UNICODE_CONSONANTS: Record<string, string> = {
  "nnd": "ඬ",
  "nng": "ඟ",
  "mmb": "ඹ",
  "nndh": "ඳ",
  "ksh": "ක්‍ෂ",
  "kh": "ඛ",
  "gh": "ඝ",
  "ng": "ඞ",
  "ch": "ච",
  "jh": "ඣ",
  "ny": "ඤ",
  "th": "ථ",
  "dh": "ධ",
  "ph": "ඵ",
  "bh": "භ",
  "sh": "ශ",
  "nd": "ඬ",
  "mb": "ඹ",
  "ng": "ඟ",
  "k": "ක",
  "g": "ග",
  "c": "ච",
  "j": "ජ",
  "t": "ට",
  "d": "ඩ",
  "n": "න",
  "p": "ප",
  "b": "බ",
  "m": "ම",
  "y": "ය",
  "r": "ර",
  "l": "ල",
  "w": "ව",
  "v": "ව",
  "s": "ස",
  "h": "හ",
  "f": "ෆ",
  "z": "ස",
  "T": "ත",
  "D": "ද",
  "N": "ණ",
  "L": "ළ",
  "S": "ෂ"
};

const UNICODE_VOWELS: Record<string, string> = {
  "au": "ෞ",
  "aa": "ා",
  "aae": "ෑ",
  "ae": "ැ",
  "ii": "ී",
  "uu": "ූ",
  "ee": "ේ",
  "ai": "ෛ",
  "oo": "ෝ",
  "a": "",
  "i": "ි",
  "u": "ු",
  "e": "ෙ",
  "o": "ො"
};

const UNICODE_INDEPENDENT_VOWELS: Record<string, string> = {
  "au": "ඖ",
  "aae": "ඈ",
  "aa": "ආ",
  "ae": "ඇ",
  "ii": "ඊ",
  "uu": "ඌ",
  "ee": "ඒ",
  "ai": "ඓ",
  "oo": "ඕ",
  "a": "අ",
  "i": "ඉ",
  "u": "උ",
  "e": "එ",
  "o": "ඔ"
};

// Simplified Legacy (FM-Abhaya) mapping for demonstration
// The legacy mapping uses single ascii characters to represent Sinhala glyphs in FM-Abhaya font.
const LEGACY_CONSONANTS: Record<string, string> = {
  "kh": "L",
  "gh": "> ",
  "ch": "p",
  "jh": "C",
  "ny": "[",
  "th": "N",
  "dh": "O",
  "ph": "P",
  "bh": "N",
  "sh": "Y",
  "nd": "|",
  "mb": "U",
  "ng": "X",
  "k": "l",
  "g": ".",
  "c": "p",
  "j": "c",
  "t": "g",
  "d": "v",
  "n": "k",
  "p": "m",
  "b": "n",
  "m": "u",
  "y": "h",
  "r": "r",
  "l": "e",
  "w": "j",
  "v": "j",
  "s": "i",
  "h": "y",
  "f": "* ",
  "z": "i",
  "T": "; ",
  "D": "o",
  "N": "K",
  "L": "E",
  "S": "I"
};

const LEGACY_VOWELS: Record<string, string> = {
  "au": "s! ",
  "aa": "d",
  "aae": "E",
  "ae": "D",
  "ii": "S",
  "uu": "Q",
  "ee": "A ",
  "ai": "ff ",
  "oo": "da ",
  "a": "",
  "i": "s",
  "u": "q",
  "e": "a ",
  "o": "d a"
};

const LEGACY_INDEPENDENT_VOWELS: Record<string, string> = {
  "au": "t!",
  "aae": "tE",
  "aa": "td",
  "ae": "tD",
  "ii": "B",
  "uu": "W",
  "ee": "ta",
  "ai": "tff",
  "oo": "tda",
  "a": "t",
  "i": "b",
  "u": "w",
  "e": "t",
  "o": "td"
};

const MODIFIERS = {
  unicode: {
    hal: "්",
    rakar: "්‍ර",
    yansaya: "්‍ය"
  },
  legacy: {
    hal: "a",
    rakar: "a ", // simplified
    yansaya: "H"
  }
};

function parseTokens(input: string) {
  let tokens = [];
  let i = 0;
  while (i < input.length) {
    let matched = false;
    // try 4, 3, 2, 1 length
    for (let len = 4; len > 0; len--) {
      if (i + len <= input.length) {
        let chunk = input.substring(i, i + len);
        if (UNICODE_CONSONANTS[chunk] || UNICODE_VOWELS[chunk]) {
          tokens.push(chunk);
          i += len;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      tokens.push(input[i]);
      i++;
    }
  }
  return tokens;
}

export function convert(input: string, mode: ConversionMode): string {
  let output = "";
  
  const tokens = parseTokens(input);
  
  let i = 0;
  
  while (i < tokens.length) {
    const t = tokens[i];
    
    const consonantsMap = mode === "unicode" ? UNICODE_CONSONANTS : LEGACY_CONSONANTS;
    const vowelsMap = mode === "unicode" ? UNICODE_VOWELS : LEGACY_VOWELS;
    const indVowelsMap = mode === "unicode" ? UNICODE_INDEPENDENT_VOWELS : LEGACY_INDEPENDENT_VOWELS;
    const mods = mode === "unicode" ? MODIFIERS.unicode : MODIFIERS.legacy;

    if (consonantsMap[t]) {
      // It's a consonant
      const nextT = i + 1 < tokens.length ? tokens[i + 1] : null;
      
      if (nextT && vowelsMap[nextT] !== undefined) {
        output += consonantsMap[t] + vowelsMap[nextT];
        i += 2;
      } else {
        output += consonantsMap[t] + mods.hal;
        i += 1;
      }
    } else if (indVowelsMap[t]) {
      output += indVowelsMap[t];
      i += 1;
    } else {
      output += t;
      i += 1;
    }
  }
  
  return output;
}
