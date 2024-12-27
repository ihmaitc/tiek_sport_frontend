const APOSTROPHE = "\u02bc";
const TURNED_COMMA = "\u2018";

const LATIN_CHARACTERS = {
  ["A"]: "А",
  ["a"]: "а",
  ["B"]: "Б",
  ["b"]: "б",
  ["D"]: "Д",
  ["d"]: "д",
  ["E"]: "Е",
  ["e"]: "е",
  ["F"]: "Ф",
  ["f"]: "ф",
  ["G"]: "Г",
  ["g"]: "г",
  ["H"]: "Ҳ",
  ["h"]: "ҳ",
  ["I"]: "И",
  ["i"]: "и",
  ["J"]: "Ж",
  ["j"]: "ж",
  ["K"]: "К",
  ["k"]: "к",
  ["L"]: "Л",
  ["l"]: "л",
  ["M"]: "М",
  ["m"]: "м",
  ["N"]: "Н",
  ["n"]: "н",
  ["O"]: "О",
  ["o"]: "о",
  ["P"]: "П",
  ["p"]: "п",
  ["Q"]: "Қ",
  ["q"]: "қ",
  ["R"]: "Р",
  ["r"]: "р",
  ["S"]: "С",
  ["s"]: "с",
  ["T"]: "Т",
  ["t"]: "т",
  ["U"]: "У",
  ["u"]: "у",
  ["V"]: "В",
  ["v"]: "в",
  ["X"]: "Х",
  ["x"]: "х",
  ["Y"]: "Й",
  ["y"]: "й",
  ["Z"]: "З",
  ["z"]: "з",
};

const CYRILLIC_LETTER = `\u0400-\u04FF`;
const CYRILLIC_VOVEL = `аоэеиуўёюя`;

const LATIN_LETTER = `a-z`;
const LATIN_VOVEL = `aeiou`;

module.exports = {
  APOSTROPHE,
  TURNED_COMMA,
  LATIN_CHARACTERS,
  CYRILLIC_LETTER,
  CYRILLIC_VOVEL,
  LATIN_LETTER,
  LATIN_VOVEL,
};
