<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { DATE_TRANSLATES, useCalendar } from "./constants";
import SelectList from "./SelectList.vue";

interface IProps {
  minYear?: number;
  maxYear?: number;
  modelValue: any;
  defaultDate?: any;
  minDate?: any;
  maxDate?: any;
  allowPast?: boolean;
  disabled?: boolean;
  allowFuture?: boolean;
  defaultDateFormat?: any;
  yearLabel?: string;
  monthLabel?: string;
  quarterLabel?: string;
  quarterValue?: number;
  sortYear?: string;
  monthFormat?: string;
  displayFormat: string;
  submitFormat?: string;
  onYearChange?: Function | null;
}

const props = withDefaults(defineProps<IProps>(), {
  defaultDateFormat: "DD.MM.YYYY",
  displayFormat: "my",
  submitFormat: "DD.MM.YYYY",
  sortYear: "desc",
  monthFormat: "long",
  onYearChange: null
});

const emits = defineEmits(["change", "input", "update:model-value", "update:quarter"]);

const current = new Date();

const years = ref<any[]>([]);
const yearsOptions = ref<any[]>([]);
const year = ref<any>(null);

const month = ref<any>(null);
const months = ref<any>([]);
const monthsOptions = ref<any[]>([]);

const quarterValues = ref<any[]>([]);
const quarterOptions = ref<any[]>([]);
// const quarter = ref<any>(props.quarterValue || null);

const end_day = ref<number | null>(null);
const end_month = ref<number | null>(null);
const day = ref<any>(null);
const days = ref<any[]>([]);
const daysOptions = ref<any[]>([]);

const minDateValue = ref(props.minDate || null);
const maxDateValue = ref(props.maxDate || null);
const { locale } = useI18n();
const { formatSubmitDate } = useCalendar();

const lang = computed(() => (locale.value.split("-")[1] ? locale.value.split("-")[1] : locale.value.split(" ")[0]));

const monthLongValues = computed<any>(() => DATE_TRANSLATES[lang.value].months);

const quartersArray = computed<any>(() => DATE_TRANSLATES[lang.value].quarters);

const quarterItem = computed({
  get(): number | null {
    if (props.quarterValue) {
      return props.quarterValue;
    }
    return null;
  },
  set(newValue) {
    emits("update:quarter", newValue);
  }
});

/* GENERATE */
const populateDefaultDate = () => {
  let parsedValue: any = null;

  if (props.defaultDate) {
    parsedValue = props.defaultDate.split(".").reverse().join("/");
    if (isNaN(Date.parse(parsedValue))) {
      return;
    }
    if (!props.allowPast && new Date().getTime() > new Date(parsedValue).getTime()) {
      return;
    }
    const parts = processDefaultDate();
    day.value = parseInt(parts[0]);
    month.value = parseInt(parts[1]);
    year.value = parseInt(parts[2]);
  }
};

const processDefaultDate = () => {
  const date = props.defaultDate;
  let parts: any = [];
  let day = "";
  let month = "";
  let year = "";

  switch (props.defaultDateFormat) {
    case "yyyy-mm-dd":
    default:
      parts = date.split("-");
      day = parts[2];
      month = parts[1];
      year = parts[0];
      break;

    case "dd/mm/yyyy":
      parts = date.split("/");
      day = parts[0];
      month = parts[1];
      year = parts[2];
      break;

    case "mm/dd/yyyy":
      parts = date.split("/");
      day = parts[1];
      month = parts[0];
      year = parts[2];
      break;
    case "DD.MM.YYYY":
      parts = date.split(".");
      day = parts[0];
      month = parts[1];
      year = parts[2];
      break;

    case "unix":
      parts = new Date();
      parts.setTime(date * 1000);
      day = parts.getDate() + "";
      month = parts.getMonth() + 1 + "";
      year = parts.getFullYear();

      if (day.length < 2) {
        day = "0" + day;
      }
      if (month.length < 2) {
        month = "0" + month;
      }
      break;
  }

  return [day, month, year];
};

const populateYears = () => {
  let minYear = props.minYear;
  let maxYear = props.maxYear;

  if (!minYear) {
    minYear = props.allowPast ? 1991 : current.getFullYear();
  } else {
    minYear = props.allowPast ? minYear : current.getFullYear();
  }

  if (minDateValue.value !== null) {
    minYear = new Date(minDateValue.value).getFullYear();
  }
  if (!maxYear) {
    maxYear = current.getFullYear() + 5;
  }

  if (!props.allowFuture) {
    maxYear = current.getFullYear() + 5;
  }
  if (maxDateValue.value !== null) {
    maxYear = new Date(maxDateValue.value).getFullYear();
  }

  years.value = [];
  yearsOptions.value = [];

  if (props.yearLabel) {
    years.value.push(null);
    yearsOptions.value.push(props.yearLabel);
  }

  if (props.sortYear == "desc") {
    for (let i = maxYear; i >= minYear; i--) {
      years.value.push(i);
      yearsOptions.value.push(i);
    }
  } else {
    for (let i = minYear; i <= maxYear; i++) {
      years.value.push(i);
      yearsOptions.value.push(i);
    }
  }
};

const populateMonth = () => {
  let start = 1;
  let end = 12;

  if (!props.allowPast && year.value === current.getFullYear()) {
    start = current.getMonth() + 1;
  }

  if (!props.allowFuture && year.value === current.getFullYear()) {
    end = current.getMonth() + 1;
  }
  if (minDateValue.value !== null && new Date(minDateValue.value).getFullYear() === year.value) {
    start = start < new Date(minDateValue.value).getMonth() + 1 ? new Date(minDateValue.value).getMonth() + 1 : start;
  }
  if (maxDateValue.value !== null && new Date(maxDateValue.value).getFullYear() === year.value) {
    end = end > new Date(maxDateValue.value).getMonth() + 1 ? new Date(maxDateValue.value).getMonth() + 1 : end;
  }

  months.value = [];
  monthsOptions.value = [];
  if (props.monthLabel) {
    months.value.push(null);
    monthsOptions.value.push(props.monthLabel);
  }
  for (let monthNo = start; monthNo <= end; monthNo++) {
    months.value.push(monthNo);
    monthsOptions.value.push(monthLongValues.value[monthNo - 1]);
  }
};

const populateQuarter = () => {
  quarterValues.value = [null, 1, 2, 3, 4];
  quarterOptions.value = [];

  if (props.quarterLabel) {
    quarterOptions.value.push(props.quarterLabel);
  }
  quarterOptions.value.push(...quartersArray.value);
};

const getDatesBetweenDates = (startDate: any, endDate: any) => {
  let dates: number[] = [];
  const theDate = new Date(startDate);

  while (theDate < endDate) {
    dates = [...dates, new Date(theDate).getDate()];
    theDate.setDate(theDate.getDate() + 1);
  }
  dates = [...dates, endDate?.getDate()];

  return dates;
};

const populateDays = () => {
  // const formattedDate = dateString.split(".").reverse().join("/");
  const d = new Date(year.value, month.value - 1, 1);
  var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
  var lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  days.value = getDatesBetweenDates(firstDay, lastDay);
  daysOptions.value = getDatesBetweenDates(firstDay, lastDay);
};

/* UPDATE */

const changeCallBack = () => {
  if (year.value) {
    const formattedDate = formatSubmitDate(day.value, month.value, year.value, props.submitFormat);
    emits("input", formattedDate);
    emits("update:model-value", formattedDate);
    emits("change", ("0" + day.value).slice(-2), ("0" + month.value).slice(-2), year.value);
  }
};

const yearChangeCallBack = (value: any) => {
  if (value) {
    year.value = value;
    populateMonth();
    if (!months.value.includes(month.value)) {
      month.value = null;
    }
    changeCallBack();
  } else {
    emits("input", null);
    emits("update:model-value", null);
    emits("change", null);
  }
};

const quarterChangeCallback = (value: any) => {
  quarterItem.value = value;
  if (value) {
    const now = year.value ? new Date(year.value) : new Date();
    const quarterM = value == 1 ? 0 : (value - 1) * 3;
    const firstDate = new Date(now.getFullYear(), quarterM, 1);
    const endDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0);

    day.value = firstDate.getDate();
    month.value = firstDate.getMonth() + 1;
    end_day.value = endDate.getDate();
    end_month.value = endDate.getMonth() + 1;
    qChangeCallback();
    return;
  }

  emits("input", null);
  emits("update:model-value", null);
  emits("change", null);
};

const qChangeCallback = () => {
  if (year.value) {
    const formattedDate = [
      formatSubmitDate(day.value, month.value, year.value, props.submitFormat),
      formatSubmitDate(end_day.value, end_month.value, year.value, props.submitFormat)
    ];

    emits("input", formattedDate);
    emits("update:model-value", formattedDate);
    emits("change", ("0" + day.value).slice(-2), ("0" + month.value).slice(-2), year.value);
  }
};

const monthChangeCallBack = (value: any) => {
  if (value) {
    month.value = value;
    populateDays();
    if (!days.value.includes(+day.value)) {
      day.value = null;
    }

    changeCallBack();
  } else {
    emits("input", null);
    emits("update:model-value", null);
    emits("change", null);
  }
};

const init = () => {
  populateYears();
  populateMonth();
  populateQuarter();
  populateDays();
  populateDefaultDate();
};

watch(
  () => props.minDate,
  (value) => {
    minDateValue.value = value;
    init();
  }
);
watch(
  () => props.maxDate,
  (value) => {
    maxDateValue.value = value;
    init();
  }
);

onMounted(() => {
  setTimeout(() => {
    init();
  }, 600);
});
</script>

<template>
  <div class="lists">
    <SelectList
      v-if="displayFormat == 'my'"
      name="month"
      id="month"
      :options="monthsOptions"
      :values="months"
      :disabled="disabled"
      v-model:value="month"
      @change="monthChangeCallBack"
    />
    <SelectList
      v-if="displayFormat == 'qy'"
      name="quarter"
      id="quarter"
      :options="quarterOptions"
      :values="quarterValues"
      v-model:value="quarterItem"
      :disabled="disabled"
      @change="quarterChangeCallback"
    />
    <SelectList
      v-if="displayFormat == 'qy' || displayFormat == 'my' || displayFormat == 'y'"
      name="years"
      id="years"
      :options="yearsOptions"
      :values="years"
      :disabled="disabled"
      v-model:value="year"
      @change="yearChangeCallBack"
    />
  </div>
</template>
<style scoped lang="scss">
.lists {
  display: flex;
  max-width: 320px;
  align-items: center;
  justify-content: space-between;
}
</style>
