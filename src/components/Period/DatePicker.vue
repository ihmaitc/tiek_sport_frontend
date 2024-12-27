<script setup lang="ts">
import { computed, ref } from "vue";
import DatePicker from "vue-datepicker-next";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

interface IProps {
  modelValue: string | null;
  minDate?: string | null;
  maxDate?: string | null;
  mask?: string;
  required?: boolean;
  disabledDate?: Object;
  type?: string;
  format?: string;
}

const lang_UzLatn = {
  formatLocale: {
    // MMMM
    months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "August", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    // MMM
    monthsShort: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
    // dddd
    weekdays: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
    // ddd
    weekdaysShort: ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"],
    // dd
    weekdaysMin: ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"],
    // first day of week
    firstDayOfWeek: 1,
    /* QUARTER */
    quarters: ["1-chorak", "2-chorak", "3-chorak", "4-chorak"]
  }
};

const lang_Ru = {
  formatLocale: {
    // MMMM
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    // MMM
    monthsShort: ["Янв", "Фев", "Март", "Апрь", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    // dddd
    weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    // ddd
    weekdaysShort: ["Вос", "Пон", "Вто", "Сре", "Чет", "Пят", "Суб"],
    // dd
    weekdaysMin: ["Во", "По", "Вт", "Ср", "Че", "Пят", "Су"],
    // first day of week
    firstDayOfWeek: 1,
    /* QUARTER */
    quarters: ["1-чорак", "2-чорак", "3-чорак", "4-чорак"]
  }
};

const lang_UzCyrl = {
  formatLocale: {
    // MMMM
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    // MMM
    monthsShort: ["Янв", "Фев", "Март", "Апрь", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    // dddd
    weekdays: ["Якшанба", "Душанба", "Сешанба", "Чоршанба", "Пайшанба", "Жума", "Шанба"],
    // ddd
    weekdaysShort: ["Якш", "Ду", "Се", "Чор", "Пай", "Жу", "Шан"],
    // dd
    weekdaysMin: ["Якш", "Ду", "Се", "Чор", "Пай", "Жу", "Шан"],
    // first day of week
    firstDayOfWeek: 1,
    /* QUARTER */
    quarters: ["1-четверг", "2-четверг", "3-четверг", "4-четверг"]
  }
};

const lang = ref<any>({});

if (locale.value === "ru") {
  lang.value = lang_Ru;
} else if (locale.value === "uz_latn") {
  lang.value = lang_UzLatn;
} else {
  lang.value = lang_UzCyrl;
}

const props = withDefaults(defineProps<IProps>(), {
  format: "DD.MM.YYYY",
  type: "date"
});

const emits = defineEmits(["update:model-value"]);

const model = computed({
  get(): string | null {
    return props.modelValue;
  },
  set(newValue) {
    emits("update:model-value", newValue);
  }
});

const disabledBeforeStartDay = (date: any) => {
  if (props.maxDate) {
    // const dFormat1 = props.maxDate.slice(0, 10).split(".").reverse().join("-");
    const dFormat1 = props.maxDate.split(".").reverse().join("/");
    const endDate = new Date(dFormat1);
    return date > endDate;
  }
  if (props.maxDate && props.minDate) {
    // const dFormat = props.minDate.slice(0, 10).split(".").reverse().join("-");
    const dFormat = props.minDate.split(".").reverse().join("/");
    // const dFormat1 = props.maxDate.slice(0, 10).split(".").reverse().join("-");
    const dFormat1 = props.maxDate.split(".").reverse().join("/");
    const startDate = new Date(dFormat);
    const endDate = new Date(dFormat1);
    return date > endDate || date < startDate;
  }
  if (props.minDate) {
    // const dFormat = props.minDate.slice(0, 10).split(".").reverse().join("-");
    const dFormat = props.minDate.split(".").reverse().join("/");
    const startDate = new Date(dFormat);
    return date < startDate;
  }
};
</script>

<template>
  <DatePicker
    style="width: 100%"
    v-model:value="model"
    :format="format"
    value-type="format"
    :type="type"
    :lang="lang"
    :disabled-date="disabledDate ? disabledDate : disabledBeforeStartDay"
  />
</template>
