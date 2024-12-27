const { LATIN_CHARACTERS } = require("./character");

function isLowerCase(char) {
  return char.toLowerCase() === char;
}

function normalizeCase(char, assimilateTo) {
  return isLowerCase(assimilateTo) ? char.toLowerCase() : char.toUpperCase();
}
function transliterateBigram(word, matcher, cyrillicBigram) {
  return word.replace(matcher, (matchString) => {
    return normalizeCase(cyrillicBigram, matchString[0]);
  });
}

function transliterateApostrophe(word) {
  const apostrophe = "ъ";

  return word.replace(/[ʻʼ’'`‘´]/g, (_, index) => {
    const assimilator = word[index + 1] || word[index - 1];

    if (assimilator) {
      return normalizeCase(apostrophe, assimilator);
    }

    return apostrophe.toLowerCase();
  });
}

function transliterateSpecialLetters(word) {
  word = word.replace(/tsi(on|ya)/gi, (matchString) => {
    return transliterateBigram(matchString, /ts/i, "ц");
  });

  /* 
  Replace with 'Э' if:
    1. word starts with 'E'
    2. 'E' comes after non-letter symbol
    3. cyrillic letter 
  */
  word = word.replace(/^e|[\W]e/gi, (matchString) => {
    return transliterateBigram(matchString, /e/i, "э");
  });

  word = word.replace(/e{2}/gi, (matchString) => {
    return matchString[0] + normalizeCase("э", matchString[1]);
  });

  word = transliterateBigram(word, /ch/gi, "ч");
  word = transliterateBigram(word, /sh/gi, "ш");
  word = transliterateBigram(word, /g[ʻʼ’'`‘´]/gi, "ғ");
  word = transliterateBigram(word, /o[ʻʼ’'`‘´]/gi, "ў");
  word = transliterateBigram(word, /ye/gi, "е");
  word = transliterateBigram(word, /yo/gi, "ё");
  word = transliterateBigram(word, /yu/gi, "ю");
  word = transliterateBigram(word, /ya/gi, "я");

  // handle non-bigram "S'H" => "СҲ" combination
  word = word.replace(/s[ʻʼ’'`‘´]h/gi, (matchString) => {
    const s = LATIN_CHARACTERS[matchString[0]] || matchString[0];
    const h = LATIN_CHARACTERS[matchString[2]] || matchString[2];

    return s + h;
  });

  word = transliterateApostrophe(word);

  return word;
}

function detectWordType(word) {
  const interpolationRegex = /\{[^}]+\}/;
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  const nameRegex = /^#\w+/;

  if (interpolationRegex.test(word)) {
    return "Interpolate";
  } else if (htmlRegex.test(word)) {
    return "HTML";
  } else if (nameRegex.test(word)) {
    return "Name";
  } else {
    return "None";
  }
}

function latinToCyrillic(word) {
  const escapedWord = transliterateSpecialLetters(word);

  let out = "";
  for (const char of escapedWord) {
    if (char in LATIN_CHARACTERS) {
      out += LATIN_CHARACTERS[char];
    } else {
      out += char;
    }
  }
  return out;
}

function processString(str) {
  if (typeof str == "string") {
    const words = str.split(/(\s+|<\/?[a-z][^>]*>|\$\{[^}]+\}|\{[^}]+\})/i).filter(Boolean);
    return words
      .map((word) => {
        const type = detectWordType(word);
        if (type === "None") {
          return latinToCyrillic(word);
        } else if (type === "Name") {
          return word.slice(1);
        } else {
          return word;
        }
      })
      .join(" ");
  }
  return str;
}

module.exports = {
  processString
};
