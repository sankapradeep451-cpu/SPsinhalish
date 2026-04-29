export type ConvertMode = "unicode" | "legacy";

const unicodeMap: Record<string, string> = {
  "aae": "ඈ",
  "aaee": "ඈ",
  "aa": "ආ",
  "ae": "ඇ",
  "ai": "ඓ",
  "au": "ඖ",
  "ee": "ඒ",
  "ii": "ඊ",
  "oo": "ඕ",
  "uu": "ඌ",
  "a": "අ",
  "e": "එ",
  "i": "ඉ",
  "o": "ඔ",
  "u": "උ",
  "R": "ඍ",
};

const consonantMap: Record<string, string> = {
  "kh": "ඛ",
  "gh": "ඝ",
  "ng": "ඟ",
  "ch": "ච",
  "Ch": "ඡ",
  "jh": "ඣ",
  "ny": "ඤ",
  "Th": "ඨ",
  "Dh": "ඪ",
  "th": "ත",
  "dh": "ද",
  "ph": "ඵ",
  "bh": "භ",
  "sh": "ශ",
  "Sh": "ෂ",
  "Ng": "ඞ",
  "Ny": "ඥ",
  "k": "ක",
  "g": "ග",
  "j": "ජ",
  "T": "ට",
  "D": "ඩ",
  "N": "ණ",
  "t": "ත",
  "d": "ද",
  "n": "න",
  "p": "ප",
  "b": "බ",
  "m": "ම",
  "y": "ය",
  "r": "ර",
  "l": "ල",
  "L": "ළ",
  "w": "ව",
  "v": "ව",
  "s": "ස",
  "h": "හ",
  "f": "ෆ",
  "z": "ස",
  "x": "ක්ස",
  "q": "ක",
  "c": "ක",
};

const vowelSignMap: Record<string, string> = {
  "aae": "ෑ",
  "aaee": "ෑ",
  "aa": "ා",
  "ae": "ැ",
  "ai": "ෛ",
  "au": "ෞ",
  "ee": "ේ",
  "ii": "ී",
  "oo": "ෝ",
  "uu": "ූ",
  "a": "",
  "e": "ෙ",
  "i": "ි",
  "o": "ො",
  "u": "ු",
  "R": "ෘ",
};

const HAL = "්";
const ZWJ = "\u200D";

const compoundMap: Record<string, string> = {
  "nda": "ඳ",
  "mba": "ඹ",
  "nga": "ඟ",
  "ndha": "ඳ",
};

const sortedUnicodeKeys = Object.keys(unicodeMap).sort((a, b) => b.length - a.length);
const sortedConsonantKeys = Object.keys(consonantMap).sort((a, b) => b.length - a.length);
const sortedVowelSignKeys = Object.keys(vowelSignMap).sort((a, b) => b.length - a.length);
const sortedCompoundKeys = Object.keys(compoundMap).sort((a, b) => b.length - a.length);

function isLetter(ch: string): boolean {
  return /[A-Za-z]/.test(ch);
}

function matchAt(text: string, pos: number, keys: string[], map: Record<string, string>): { key: string; value: string } | null {
  for (const key of keys) {
    if (text.startsWith(key, pos)) {
      return { key, value: map[key] };
    }
  }
  return null;
}

function convertUnicodeToken(token: string): string {
  let result = "";
  let i = 0;

  while (i < token.length) {
    const compound = matchAt(token, i, sortedCompoundKeys, compoundMap);
    if (compound) {
      result += compound.value;
      i += compound.key.length;
      const after = i;
      const vowelAfter = matchAt(token, after, sortedVowelSignKeys, vowelSignMap);
      if (vowelAfter) {
        result += vowelAfter.value;
        i += vowelAfter.key.length;
      }
      continue;
    }

    if (i === 0) {
      const vowel = matchAt(token, i, sortedUnicodeKeys, unicodeMap);
      if (vowel) {
        result += vowel.value;
        i += vowel.key.length;
        continue;
      }
    }

    const consonant = matchAt(token, i, sortedConsonantKeys, consonantMap);
    if (consonant) {
      result += consonant.value;
      i += consonant.key.length;

      if (i < token.length && (token[i] === "h" || token[i] === "y" || token[i] === "r")) {
        if (token[i] === "y") {
          result += HAL + ZWJ + "ය";
          i += 1;
        } else if (token[i] === "r") {
          result += HAL + ZWJ + "ර";
          i += 1;
        }
      }

      const vowelSign = matchAt(token, i, sortedVowelSignKeys, vowelSignMap);
      if (vowelSign) {
        if (vowelSign.key !== "a") {
          result += vowelSign.value;
        }
        i += vowelSign.key.length;
      } else {
        result += HAL;
      }
      continue;
    }

    result += token[i];
    i += 1;
  }

  return result;
}

export function convertUnicode(input: string): string {
  let result = "";
  let buffer = "";

  const flush = () => {
    if (buffer) {
      result += convertUnicodeToken(buffer);
      buffer = "";
    }
  };

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (isLetter(ch)) {
      buffer += ch;
    } else {
      flush();
      result += ch;
    }
  }
  flush();

  return result;
}

const legacyConsonantMap: Record<string, string> = {
  "kh": "L",
  "gh": "G",
  "ng": "z`",
  "ch": "p",
  "Ch": "P",
  "jh": "c",
  "ny": "[a",
  "Th": "g",
  "Dh": "v",
  "th": ";",
  "dh": "o",
  "ph": "*",
  "bh": "N",
  "sh": "I",
  "Sh": "I",
  "k": "l",
  "g": ".",
  "j": "c",
  "T": "g",
  "D": "v",
  "N": "K",
  "t": ";",
  "d": "o",
  "n": "k",
  "p": "m",
  "b": "n",
  "m": "u",
  "y": "h",
  "r": "r",
  "l": "[",
  "L": "<",
  "w": "j",
  "v": "j",
  "s": "i",
  "h": "y",
  "f": "*",
  "z": "i",
  "c": "l",
  "q": "l",
};

const legacyVowelSignMap: Record<string, string> = {
  "aae": "Eෑ",
  "aaee": "Eෑ",
  "aa": "d",
  "ae": "e",
  "ai": "ෛ",
  "au": "ෞ",
  "ee": "S",
  "ii": "S",
  "oo": "ෝ",
  "uu": "Q",
  "a": "",
  "e": "fe",
  "i": "s",
  "o": "fo",
  "u": "q",
  "R": "DD",
};

const legacyVowelMap: Record<string, string> = {
  "aae": "weෑ",
  "aaee": "weෑ",
  "aa": "wd",
  "ae": "we",
  "ai": "ඓ",
  "au": "ඖ",
  "ee": "ta",
  "ii": "B",
  "oo": "ඕ",
  "uu": "W",
  "a": "w",
  "e": "t",
  "i": "b",
  "o": "T",
  "u": "W",
  "R": "DD",
};

const legacyHal = "a";

const sortedLegacyConsonantKeys = Object.keys(legacyConsonantMap).sort((a, b) => b.length - a.length);
const sortedLegacyVowelSignKeys = Object.keys(legacyVowelSignMap).sort((a, b) => b.length - a.length);
const sortedLegacyVowelKeys = Object.keys(legacyVowelMap).sort((a, b) => b.length - a.length);

function convertLegacyToken(token: string): string {
  let result = "";
  let i = 0;

  while (i < token.length) {
    if (i === 0) {
      const vowel = matchAt(token, i, sortedLegacyVowelKeys, legacyVowelMap);
      if (vowel) {
        result += vowel.value;
        i += vowel.key.length;
        continue;
      }
    }

    const consonant = matchAt(token, i, sortedLegacyConsonantKeys, legacyConsonantMap);
    if (consonant) {
      result += consonant.value;
      i += consonant.key.length;

      const vowelSign = matchAt(token, i, sortedLegacyVowelSignKeys, legacyVowelSignMap);
      if (vowelSign) {
        if (vowelSign.key !== "a") {
          result += vowelSign.value;
        }
        i += vowelSign.key.length;
      } else {
        result += legacyHal;
      }
      continue;
    }

    result += token[i];
    i += 1;
  }

  return result;
}

export function convertLegacy(input: string): string {
  let result = "";
  let buffer = "";

  const flush = () => {
    if (buffer) {
      result += convertLegacyToken(buffer);
      buffer = "";
    }
  };

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (isLetter(ch)) {
      buffer += ch;
    } else {
      flush();
      result += ch;
    }
  }
  flush();

  return result;
}

export function convert(input: string, mode: ConvertMode): string {
  if (!input) return "";
  return mode === "unicode" ? convertUnicode(input) : convertLegacy(input);
}
