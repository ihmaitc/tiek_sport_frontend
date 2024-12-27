import i18n from "@/app/config/i18n";

export const useCheckPhoneNumber = () => {
  let regex = /[(),-]/g;

  const set = (value: string | null) => {
    return value && value.toString().split(" ").join("").replace(regex, "");
  };

  const mobileCodes = [
    "20",
    "33",
    "36",
    "50",
    "55",
    "61",
    "62",
    "65",
    "66",
    "67",
    "69",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "88",
    "90",
    "91",
    "93",
    "94",
    "95",
    "97",
    "98",
    "99"
  ];

  const phoneNumberRules = [
    (value: any) => {
      if (value) {
        const newValue = String(value).split("+998");
        const phone = set(newValue[1]);
        if (phone?.length !== 9) {
          return i18n.global.t("invalidFormatPhoneNumber");
        }
        return true;
      }

      return i18n.global.t("fieldNotEmpty");
    }
  ];
  const phoneNumberRulesWithCode = [
    (value: any) => {
      if (value) {
        const newValue = String(value).split("+998");
        const phone = set(newValue[1]);

        if (phone?.length !== 9) {
          return i18n.global.t("invalidFormatPhoneNumber");
        }

        if (phone.length == 9 && !mobileCodes.includes(phone.substring(0, 2))) {
          return i18n.global.t("invalidaMobileCode");
        }

        return true;
      }

      return i18n.global.t("fieldNotEmpty");
    }
  ];
  const notRequiredPhoneNumberRules = [
    (value: any) => {
      if (value) {
        if (String(value).length > 4) {
          const newValue = String(value).split("+998");
          const phone = set(newValue[1]);
          if (phone?.length !== 9) {
            return i18n.global.t("invalidFormatPhoneNumber");
          }
          return true;
        }

        return i18n.global.t("fieldNotEmpty");
      }

      return true;
    }
  ];

  const setIsRequiredPhoneNumber = (value: any) => {
    const val = value ?? "";
    if (String(val).length > 0) {
      return true;
    }
    return false;
  };

  return {
    phoneNumberRules,
    notRequiredPhoneNumberRules,
    phoneNumberRulesWithCode,
    setIsRequiredPhoneNumber,
    set,
    mobileCodes
  };
};
