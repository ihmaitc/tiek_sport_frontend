<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { ref } from "vue";
import PeriodModal from "./PeriodModal.vue";
import { useCalendar } from "./constants";

interface IProps {
  startDate: any;
  endDate: any;
  localStorageKeyName?: string;
  isClear?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {});
const emits = defineEmits(["update:startDate", "update:endDate", "submit"]);
const { periodStorage, formatDMY, getQuarter } = useCalendar();

const current = new Date();
const isShow = ref(false);
const period_format = ref(0);

const items = computed({
  get() {
    return {
      startDate: props.startDate,
      endDate: props.endDate,
      active: period_format.value
    };
  },
  set(newValue) {
    if (newValue) {
      period_format.value = newValue.active;
    }
    emits("update:startDate", newValue.startDate);
    emits("update:endDate", newValue.endDate);
  }
});

const defaultDate = computed(() => {
  const currentYear = current.getFullYear();
  const parts = new Date(currentYear, 0, 1);
  let day = String(parts.getDate()).padStart(2, "0");
  let month = String(parts.getMonth() + 1).padStart(2, "0");
  let year = parts.getFullYear();
  return `${day}.${month}.${year}`;
  // return `${year}-${month}-${day}`;
});

const defaultEndDate = computed(() => {
  let day = String(current.getDate()).padStart(2, "0");
  let month = String(current.getMonth() + 1).padStart(2, "0");
  let year = current.getFullYear();
  if (parseInt(month) > 12) {
    month = "01";
    year++;
  }
  return `${day}.${month}.${year}`;
  // return `${year}-${month}-${day}`;
});

const dateFormat = (date: any) => {
  let dFormat;

  switch (period_format.value) {
    case 1:
      dFormat = formatDMY(date, "MM YYYY").date;
      break;
    case 2:
      dFormat = formatDMY(date, "QQQQ YYYY")?.date;
      break;
    case 3:
      dFormat = formatDMY(date, "YYYY")?.date;
      break;
    default:
      dFormat = formatDMY(date, "DD.MM.YYYY").date;
      break;
  }
  return dFormat;
};

const checkToIsEqual = (startDate: string, endDate: string) => {
  const formattedStartDate = startDate?.split(".").reverse().join("/");
  const formattedEndDate = endDate?.split(".").reverse().join("/");
  let isEqual;

  switch (period_format.value) {
    case 1:
      isEqual = new Date(formattedStartDate).getMonth() == new Date(formattedEndDate).getMonth();
      break;
    case 2:
      isEqual = getQuarter(startDate) == getQuarter(endDate);
      break;
    case 3:
      isEqual = new Date(formattedStartDate).getFullYear() == new Date(formattedEndDate).getFullYear();
      break;
    default:
      isEqual = new Date(formattedStartDate).getTime() === new Date(formattedEndDate).getTime();
      break;
  }

  return isEqual;
};

watch(
  () => props.startDate,
  (val) => {
    if (!val) {
      emits("update:startDate", !props.startDate || props.startDate?.length === 0 ? defaultDate.value : props.startDate);
      emits("update:endDate", !props.endDate || props.endDate?.length === 0 ? defaultEndDate.value : props.endDate);
    }
  },
  { immediate: true }
);
watch(
  () => props.isClear,
  (val) => {
    if (!val) {
      if (periodStorage.value) {
        emits("update:startDate", periodStorage.value.startDate);
        emits("update:endDate", periodStorage.value.endDate);
        period_format.value = periodStorage.value.active;
        return;
      }
      emits("update:startDate", !props.startDate || props.startDate?.length === 0 ? defaultDate.value : props.startDate);
      emits("update:endDate", !props.endDate || props.endDate?.length === 0 ? defaultEndDate.value : props.endDate);
    }
  }
);

onMounted(() => {
  setTimeout(() => {
    if (periodStorage.value) {
      emits("update:startDate", periodStorage.value.startDate);
      emits("update:endDate", periodStorage.value.endDate);
      period_format.value = periodStorage.value.active;
    } else {
      emits("update:startDate", !props.startDate || props.startDate?.length === 0 ? defaultDate.value : props.startDate);
      emits("update:endDate", !props.endDate || props.endDate?.length === 0 ? defaultEndDate.value : props.endDate);
    }
  }, 0);
});
</script>

<template>
  <div class="filter">
    <div class="filter__period-date" @click="isShow = true">
      <template v-if="!checkToIsEqual(items.startDate, items.endDate)">
        <div class="date">
          <input readonly :value="dateFormat(startDate)" />
          <div class="input-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
              class="dp__icon dp__input_icon dp__input_icons"
            >
              <path
                d="M29.333 8c0-2.208-1.792-4-4-4h-18.667c-2.208 0-4 1.792-4 4v18.667c0 2.208 1.792 4 4 4h18.667c2.208 0 4-1.792 4-4v-18.667zM26.667 8v18.667c0 0.736-0.597 1.333-1.333 1.333 0 0-18.667 0-18.667 0-0.736 0-1.333-0.597-1.333-1.333 0 0 0-18.667 0-18.667 0-0.736 0.597-1.333 1.333-1.333 0 0 18.667 0 18.667 0 0.736 0 1.333 0.597 1.333 1.333z"
              ></path>
              <path
                d="M20 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
              ></path>
              <path
                d="M9.333 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
              ></path>
              <path
                d="M4 14.667h24c0.736 0 1.333-0.597 1.333-1.333s-0.597-1.333-1.333-1.333h-24c-0.736 0-1.333 0.597-1.333 1.333s0.597 1.333 1.333 1.333z"
              ></path>
            </svg>
          </div>
        </div>
        <div class="date">
          <input :value="dateFormat(endDate)" />
          <div class="input-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
              class="dp__icon dp__input_icon dp__input_icons"
            >
              <path
                d="M29.333 8c0-2.208-1.792-4-4-4h-18.667c-2.208 0-4 1.792-4 4v18.667c0 2.208 1.792 4 4 4h18.667c2.208 0 4-1.792 4-4v-18.667zM26.667 8v18.667c0 0.736-0.597 1.333-1.333 1.333 0 0-18.667 0-18.667 0-0.736 0-1.333-0.597-1.333-1.333 0 0 0-18.667 0-18.667 0-0.736 0.597-1.333 1.333-1.333 0 0 18.667 0 18.667 0 0.736 0 1.333 0.597 1.333 1.333z"
              ></path>
              <path
                d="M20 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
              ></path>
              <path
                d="M9.333 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
              ></path>
              <path
                d="M4 14.667h24c0.736 0 1.333-0.597 1.333-1.333s-0.597-1.333-1.333-1.333h-24c-0.736 0-1.333 0.597-1.333 1.333s0.597 1.333 1.333 1.333z"
              ></path>
            </svg>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="date">
          <input readonly :value="dateFormat(startDate)" />
          <div class="input-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="currentColor"
              aria-hidden="true"
              class="dp__icon dp__input_icon dp__input_icons"
            >
              <path
                d="M29.333 8c0-2.208-1.792-4-4-4h-18.667c-2.208 0-4 1.792-4 4v18.667c0 2.208 1.792 4 4 4h18.667c2.208 0 4-1.792 4-4v-18.667zM26.667 8v18.667c0 0.736-0.597 1.333-1.333 1.333 0 0-18.667 0-18.667 0-0.736 0-1.333-0.597-1.333-1.333 0 0 0-18.667 0-18.667 0-0.736 0.597-1.333 1.333-1.333 0 0 18.667 0 18.667 0 0.736 0 1.333 0.597 1.333 1.333z"
              ></path>
              <path
                d="M20 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
              ></path>
              <path
                d="M9.333 2.667v5.333c0 0.736 0.597 1.333 1.333 1.333s1.333-0.597 1.333-1.333v-5.333c0-0.736-0.597-1.333-1.333-1.333s-1.333 0.597-1.333 1.333z"
              ></path>
              <path
                d="M4 14.667h24c0.736 0 1.333-0.597 1.333-1.333s-0.597-1.333-1.333-1.333h-24c-0.736 0-1.333 0.597-1.333 1.333s0.597 1.333 1.333 1.333z"
              ></path>
            </svg>
          </div>
        </div>
      </template>
    </div>
    <Teleport to="body">
      <PeriodModal v-model:filter="items" v-model:show="isShow" v-if="isShow" @submit="emits('submit')" />
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.filter {
  display: flex;
  --border: #d8d8d8;
  width: 100%;
  flex: 0 0 100%;
  &__period-date {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    flex: 0 0 100%;

    @media screen and (max-width: 1366px) {
      flex-wrap: wrap;
    }
  }

  .date {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.625rem;
    overflow: hidden;
    border: 0.0625rem solid var(--border);
    border-radius: 0.5rem;
    padding-right: 0.625rem;
    cursor: pointer;
    width: 100%;
  }

  input {
    margin: 0;
    max-width: 100%;
    outline: 0;
    text-align: left;
    line-height: 1.21428571em;
    font-weight: 500;
    padding: 0.67857143rem 0.5rem;
    color: rgba(0, 0, 0, 0.87);
    border-radius: 0.28571429rem;
    transition: box-shadow 0.1s ease, border-color 0.1s ease;
    box-shadow: none;
    pointer-events: none;
  }
  .input-icon {
    transition: transform 0.3s;
    width: 0.9375rem;
    height: 0.9375rem;
    position: relative;

    svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
