import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

export const DATE_TRANSLATES: {
  [key: string]: {
    [key: string]: {
      [key: string]: any;
    };
  };
} = {
  cyrl: {
    default: {
      dateWarning: "Бошланиш санаси ҳар доим тугаш санасидан кичик бўлиши керак",
      one_date: "Бир кун",
      one_month: "Бир ой",
      one_quarter: "Бир чорак",
      one_year: "Бир йил",
      day: "Кун",
      month: "Ой",
      quarter: "Чорак",
      year: "Йил",
      startDate: "Бошланиш санаси",
      endDate: "Тугаш санаси",
      y: "й",
      q: "ч",
      d: "кун",
      m: "ой"
    },
    months: {
      0: "Январ",
      1: "Феврал",
      2: "Март",
      3: "Апрел",
      4: "Май",
      5: "Июн",
      6: "Июл",
      7: "Август",
      8: "Сентябр",
      9: "Октябр",
      10: "Ноябр",
      11: "Декабр"
    },
    quarters: ["1 чорак", "2 чорак", "3 чорак", "4 чорак"]
  },
  latn: {
    default: {
      dateWarning: "Boshlanish sanasi har doim tugash sanasidan kichik bo'lishi kerak",
      one_date: "Bir kun",
      one_month: "Bir oy",
      one_quarter: "Bir chorak",
      one_year: "Bir yil",
      day: "Kun",
      month: "Oy",
      quarter: "Chorak",
      year: "Yil",
      startDate: "Boshlanish sanasi",
      endDate: "Tugash sanasi",
      y: "y",
      q: "ch",
      d: "kun",
      m: "oy"
    },
    months: {
      0: "Yanvar",
      1: "Fevral",
      2: "Mart",
      3: "Aprel",
      4: "May",
      5: "Iyun",
      6: "Iyul",
      7: "Avgust",
      8: "Sentyabr",
      9: "Oktyabr",
      10: "Noyabr",
      11: "Dekabr"
    },
    quarters: ["1 chorak", "2 chorak", "3 chorak", "4 chorak"]
  },
  ru: {
    default: {
      dateWarning: "Начальная дата всегда должна быть меньше конечной даты",
      one_date: "Один день",
      one_month: "Один месяц",
      one_quarter: "Один квартал",
      one_year: "Один год",
      day: "День",
      month: "Меяц",
      quarter: "Квартал",
      year: "Год",
      startDate: "Дата начало",
      endDate: "Дата окончания",
      y: "г",
      q: "к",
      d: "д",
      m: "м"
    },
    months: {
      0: "Январь",
      1: "Февраль",
      2: "Март",
      3: "Апрель",
      4: "Май",
      5: "Июнь",
      6: "Июль",
      7: "Август",
      8: "Сентябрь",
      9: "Октябрь",
      10: "Ноябрь",
      11: "Декабрь"
    },
    quarters: ["1 квартал", "2 квартал", "3 квартал", "4 квартал"]
  }
};

export const useCalendar = () => {
  const { locale } = useI18n();
  const lang = computed(() => (locale.value.split("_")[1] ? locale.value.split("_")[1] : locale.value.split(" ")[0]));

  const periodStorageKeyName = ref<string | null>(null);
  const setPeriodStorageKeyName = (value: string) => {
    periodStorageKeyName.value = value;
  };
  const periodStorage = computed(() => {
    const periodStorage = localStorage.getItem(periodStorageKeyName.value || `period_${window.location.pathname}`);
    if (typeof periodStorage === "string") {
      return JSON.parse(periodStorage);
    } else {
      return null;
    }
  });

  const formatDMY = (val: any, format: string = "DD.MM.YYYY") => {
    if (val) {
      let value = String(val).split(".").reverse().join("/");
      let date;

      const dateObj = value !== "" ? new Date(value) : new Date();
      switch (format) {
        case "MM YYYY":
          date = format
            .replace("MM", DATE_TRANSLATES[lang.value].months[dateObj.getMonth()])
            .replace("YYYY", `${dateObj.getFullYear() + "-" + DATE_TRANSLATES[lang.value].default.y}`);
          break;
        case "YYYY":
          date = format.replace("YYYY", `${dateObj.getFullYear() + "-" + DATE_TRANSLATES[lang.value].default.y}`);
          break;
        case "QQQQ YYYY":
          date = format
            // .replace("QQQQ", DATE_TRANSLATES[lang.value].quarters[getQuarter(val) - 1])
            .replace("QQQQ", getQuarter(val) + "-" + String(DATE_TRANSLATES[lang.value].default.quarter).toLowerCase())
            .replace("YYYY", `${dateObj.getFullYear() + "-" + DATE_TRANSLATES[lang.value].default.y}`);
          break;

        default:
          date = format
            .replace("DD", ("0" + dateObj.getDate()).slice(-2))
            .replace("MM", ("0" + (dateObj.getMonth() + 1)).slice(-2))
            .replace("YYYY", `${dateObj.getFullYear()}`);
          break;
      }

      return {
        date,
        value
      };
    }
    return {
      date: "",
      value: 0
    };
  };
  const getFirstDay = (dateString: string) => {
    const formattedDate = String(dateString).split(".").reverse().join("/");
    const d = new Date(formattedDate);
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    return `${("0" + firstDay.getDate()).substr(-2)}.${("0" + (firstDay.getMonth() + 1)).substr(-2)}.${firstDay.getFullYear()}`;
  };

  const getLastDayOfYear = (dateString: string) => {
    const formattedDate = dateString.split(".").reverse().join("/");
    const d = new Date(formattedDate);
    const lastDayOfYear = new Date(d.getFullYear(), 11, 31);
    return `${("0" + lastDayOfYear.getDate()).substr(-2)}.${("0" + (lastDayOfYear.getMonth() + 1)).substr(-2)}.${lastDayOfYear.getFullYear()}`;
  };
  const getFirstDayOfYear = (dateString?: string) => {
    const formattedDate = (dateString && dateString.split(".").reverse().join("/")) || new Date();
    const d = new Date(formattedDate);
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    return `${("0" + firstDayOfYear.getDate()).substr(-2)}.${("0" + (firstDayOfYear.getMonth() + 1)).substr(-2)}.${firstDayOfYear.getFullYear()}`;
  };

  const getQuarter = (dateString: string) => {
    const formattedDate = dateString.split(".").reverse().join("/");
    const jsDate = new Date(formattedDate);
    const monthInt = jsDate.getMonth();
    const quarter = Math.ceil(Number(monthInt + 1) / 3);
    return quarter;
  };

  const getQuarterValue = (dateString: any, quarter: number) => {
    const submitFormat = "DD.MM.YYYY";
    const formattedDate = dateString.split(".").reverse().join("/");
    const date = new Date(formattedDate);
    const year = date.getFullYear();

    const now = year ? new Date(formattedDate) : new Date();
    const quarterM = quarter == 1 ? 0 : (quarter - 1) * 3;
    const firstDate = new Date(now.getFullYear(), quarterM, 1);

    // const day = firstDate.getDate();
    const month = firstDate.getMonth() + 1;

    const endDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0);
    const end_month = endDate.getMonth() + 1;
    const end_day = endDate.getDate();

    const formatDate = [formatSubmitDate(1, month, year, submitFormat), formatSubmitDate(end_day, end_month, year, submitFormat)];

    return {
      end: formatSubmitDate(end_day, end_month, year, submitFormat),
      start: formatSubmitDate(1, month, year, submitFormat),
      formatDate: formatDate
    };

    // day.value = firstDate.getDate();
    // month.value = firstDate.getMonth() + 1;
    // end_day.value = endDate.getDate();
    // end_month.value = endDate.getMonth() + 1;

    // qChangeCallback();
  };

  const formatSubmitDate = (day: any, month: any, year: any, submitFormat: any) => {
    day = day || 1;
    month = month || 1;
    let formattedDate, _date;

    switch (submitFormat) {
      case "unix":
        _date = new Date();
        _date.setDate(day);
        _date.setMonth(month - 1);
        // @ts-ignore
        _date.setYear(year);
        formattedDate = Math.round(_date.getTime() / 1000);
        break;

      default:
        formattedDate = submitFormat
          .replace("DD", ("0" + day).slice(-2))
          .replace("MM", ("0" + month).slice(-2))
          .replace("YYYY", year);
        break;
    }

    return formattedDate;
  };

  return {
    formatDMY,
    periodStorage,
    setPeriodStorageKeyName,
    getFirstDay,
    getLastDayOfYear,
    getFirstDayOfYear,
    getQuarter,
    getQuarterValue,
    formatSubmitDate,
    lang
  };
};
