<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import SelectorPicker from "./SelectorPicker.vue";
import { computed, watch } from "vue";
import DatePicker from "./DatePicker.vue";
import { DATE_TRANSLATES, useCalendar } from "./constants";
interface IProps {
  filter: any;
  hideQuarter?: boolean;
  hideYear?: boolean;
}

const props = defineProps<IProps>();
const emits = defineEmits(["update:show", "update:filter", "submit"]);

const { periodStorage, getFirstDay, getFirstDayOfYear, getLastDayOfYear, getQuarter, getQuarterValue, lang } = useCalendar();
const date = ref<any>();
const date_quarter = ref<any>();
const end_date = ref<any>();
const end_date_quarter = ref<any>();
const active = ref(0);
const oneDate = ref(false);
const loaded = ref(false);
const resetLoading = ref(true);
const isValidates = ref(true);
let firstVisit = false;

const getLastDayOfMonth = (dateString: string) => {
  if (date.value) {
    const formattedDate = dateString.split(".").reverse().join("/");
    const d = new Date(formattedDate);
    const year = d.getFullYear();
    const month = d.getMonth();

    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
    const yearString = lastDayOfMonth.getFullYear().toString();
    const monthString = (lastDayOfMonth.getMonth() + 1).toString().padStart(2, "0");
    const dayString = lastDayOfMonth.getDate().toString().padStart(2, "0");
    return `${dayString}.${monthString}.${yearString}`;
  }
};

const dateFormat = computed(() => {
  let format = "dmy";
  let key = "one_date";
  loaded.value = false;
  switch (active.value) {
    case 1:
      format = "my";
      key = "one_month";
      resetLoading.value = false;
      break;
    case 2:
      format = "qy";
      key = "one_quarter";
      break;
    case 3:
      format = "y";
      key = "one_year";
      break;
    default:
      format = "dmy";
      key = "one_date";
      break;
  }

  setTimeout(() => {
    loaded.value = true;
    resetLoading.value = true;
  }, 0);
  if (format !== "qy") {
    if (Array.isArray(date.value)) {
      date.value = date.value[0];
    }
  }
  if (format === "dmy") {
    if (Array.isArray(date.value)) {
      date.value = date.value[0];
    }
  }
  return {
    format,
    key
  };
});

const minDate = computed(() => {
  if (Array.isArray(date.value)) {
    return date.value[0];
  } else {
    return date.value;
  }
});

const search = async () => {
  let startQuarter = null;
  let endQuarter = null;

  if (!end_date.value) {
    if (active.value == 2) {
      date.value = getQuarterValue(parseArrayData(date.value, 0), getQuarter(parseArrayData(date.value, 0))).formatDate;
      setEndDateOnChangeDate(date.value);
    }
  }
  if (Array.isArray(date.value)) {
    date.value = date.value[0];

    startQuarter = getQuarter(date.value) || null;
    endQuarter = getQuarter(end_date.value) || null;
  } else {
    if (active.value == 2) {
      if (!end_date.value) {
        end_date.value = date.value[1];
      }
    }
    startQuarter = getQuarter(date.value) || null;
    if (end_date.value) {
      endQuarter = getQuarter(end_date.value) || null;
    }
  }

  await nextTick();
  emits("update:filter", {
    startDate: date.value,
    endDate: end_date.value,
    active: active.value
  });

  emits("submit");

  emits("update:show", false);
  localStorage.setItem(
    `period_${window.location.pathname}`,
    JSON.stringify({
      startDate: date.value,
      endDate: end_date.value,
      active: active.value,
      quarter: { startQuarter, endQuarter },
      oneDate: oneDate.value
    })
  );
};

const cleanFilter = () => {
  loaded.value = false;
  resetLoading.value = false;
  setTimeout(() => {
    loaded.value = true;
    resetLoading.value = true;
    date.value = props.filter.startDate;
    setEndDateOnChangeDate(props.filter.startDate);
  }, 0);
};

const setIsOneDate = () => {
  if (oneDate.value) {
    loaded.value = false;
    setTimeout(() => {
      loaded.value = true;
      if (active.value == 2) {
        date.value = getQuarterValue(parseArrayData(date.value, 0), getQuarter(parseArrayData(date.value, 0))).formatDate;
      }
      setEndDateOnChangeDate(date.value);
    }, 0);
  }
};

const parseArrayData = (item: any, numberOfEl: number) => {
  if (Array.isArray(item)) {
    return item[numberOfEl];
  }
  return item;
};

const onChange = () => {
  firstVisit = false;
  const startDate = new Date(parseArrayData(date.value, 0)?.split(".").reverse().join("/")).getTime();
  const endDate = new Date(parseArrayData(end_date.value, 1)?.split(".").reverse().join("/")).getTime();

  if (endDate && startDate) {
    isValidates.value = endDate >= startDate;
    if (oneDate.value) {
      isValidates.value = true;
    }
  }
};

const setEndDateOnChangeDate = (val: any) => {
  if (oneDate.value) {
    if (active.value == 2) {
      // end_date_quarter.value = getQuarter(parseArrayData(val, 1));
      end_date.value = getQuarterValue(parseArrayData(val, 1), getQuarter(parseArrayData(val, 1))).end;
      end_date_quarter.value = getQuarter(parseArrayData(val, 1));
    } else if (active.value == 3) {
      end_date.value = getLastDayOfYear(parseArrayData(val, 1));
    } else {
      end_date.value = date.value;
    }
  }
};

watch(
  () => date.value,
  (val) => {
    if (val) {
      loaded.value = false;
      setTimeout(() => {
        loaded.value = true;
        if (firstVisit) {
          return;
        }
        setEndDateOnChangeDate(val);

        onChange();
      }, 0);
    } else {
      loaded.value = false;
      setTimeout(() => {
        loaded.value = true;
        date.value = getFirstDayOfYear();
      }, 0);
    }
  }
);

watch(
  () => end_date.value,
  (val) => {
    if (val) {
      setTimeout(() => {
        if (Array.isArray(val)) {
          end_date.value = getLastDayOfMonth(val[1]);
        }
        if (active.value === 1) {
          end_date.value = getLastDayOfMonth(parseArrayData(val, 1));
        }
        if (active.value == 3) {
          end_date.value = getLastDayOfYear(parseArrayData(val, 1));
        }
        onChange();
      }, 0);
    }
  }
);

onMounted(() => {
  firstVisit = true;
  setTimeout(() => {
    date.value = props.filter?.startDate;
    end_date.value = props.filter?.endDate;
  }, 0);

  if (periodStorage.value) {
    active.value = periodStorage.value.active;
    date_quarter.value = periodStorage.value.quarter.startQuarter;
    end_date_quarter.value = periodStorage.value.quarter.endQuarter;
    oneDate.value = periodStorage.value.oneDate;
  } else {
  }
});
</script>

<template>
  <div class="period-modal period-modal-show">
    <div class="period-modal__dialog">
      <div class="period-modal__dialog-content">
        <div class="dialog-content__header">
          <button
            :class="{
              active: active == 0
            }"
            @click="
              active = 0;
              date = getFirstDay(parseArrayData(date, 0));
              end_date = getLastDayOfMonth(parseArrayData(end_date ? end_date : date, 1));
            "
          >
            {{ DATE_TRANSLATES[lang].default.day }}
          </button>
          <button
            :class="{
              active: active == 1
            }"
            @click="
              active = 1;
              date = getFirstDay(parseArrayData(date, 0));
              end_date = getLastDayOfMonth(parseArrayData(end_date ? end_date : date, 1));
            "
          >
            {{ DATE_TRANSLATES[lang].default.month }}
          </button>
          <button
            v-if="!hideQuarter"
            :class="{ active: active == 2 }"
            @click="
              active = 2;
              date = getQuarterValue(parseArrayData(date, 0), date_quarter ? date_quarter : parseArrayData(date, 0)).start || null;
            "
          >
            {{ DATE_TRANSLATES[lang].default.quarter }}
          </button>
          <button
            v-if="!hideYear"
            :class="{ active: active == 3 }"
            @click="
              active = 3;
              date = getFirstDayOfYear(parseArrayData(date, 0));
              end_date = getLastDayOfYear(parseArrayData(end_date, 1));
            "
          >
            {{ DATE_TRANSLATES[lang].default.year }}
          </button>
        </div>

        <div class="dialog-content__area">
          <div class="date">
            <label for="startDate" class="mb-1">
              <span v-if="!(active == 2)">{{ $t("startDate") }}</span>
              <span v-else> {{ DATE_TRANSLATES[lang].default.quarter }}</span>
            </label>
            <template v-if="resetLoading">
              <DatePicker v-model:model-value="date" v-if="active == 0" @update:model-value="onChange" />
              <SelectorPicker
                v-else
                id="startDate"
                v-model:model-value="date"
                :default-date="date"
                :year-label="DATE_TRANSLATES[lang].default.year"
                :quarter-label="DATE_TRANSLATES[lang].default.quarter"
                :day-label="DATE_TRANSLATES[lang].default.day"
                :month-label="DATE_TRANSLATES[lang].default.month"
                :min-year="1991"
                allow-past
                allow-future
                :display-format="dateFormat.format"
                @change="onChange"
                v-model:quarterValue="date_quarter"
              />
            </template>
          </div>

          <div class="date endDate">
            <label for="endDate" class="mb-1">{{ DATE_TRANSLATES[lang].default.endDate }} </label>
            <template v-if="loaded">
              <DatePicker v-model:model-value="end_date" v-if="active == 0" :min-date="minDate" :disabled="oneDate" @update:model-value="onChange" />
              <SelectorPicker
                v-else
                id="endDate"
                v-model:model-value="end_date"
                :default-date="end_date"
                :year-label="DATE_TRANSLATES[lang].default.year"
                :quarter-label="DATE_TRANSLATES[lang].default.quarter"
                :day-label="DATE_TRANSLATES[lang].default.day"
                :month-label="DATE_TRANSLATES[lang].default.month"
                :display-format="dateFormat.format"
                :disabled="oneDate"
                @change="onChange"
                v-model:quarterValue="end_date_quarter"
              />
            </template>
          </div>
          <p v-show="!isValidates" class="text-error" style="margin: 0; padding-left: 12px; font-size: 12px; white-space: wrap">
            {{ DATE_TRANSLATES[lang].default.dateWarning }}
          </p>

          <div class="params">
            <div class="one-date">
              <input id="isOneDate" class="checkbox" type="checkbox" v-model="oneDate" @change="setIsOneDate" />
              <label for="isOneDate"> {{ DATE_TRANSLATES[lang].default[dateFormat.key] }} </label>
            </div>
            <button class="btn btn-refresh" @click="cleanFilter">
              <svg
                data-v-917be9ed=""
                xmlns="http://www.w3.org/2000/svg"
                class="icon-tabler icon-tabler-refresh"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="dialog-content__footer">
          <button class="btn btn-cancel" @click="emits('update:show', false)">
            {{ $t("Cancel") }}
          </button>
          <button class="btn btn-search" @click="search" :disabled="!isValidates || !date">
            {{ $t("Search") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.period-modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4000;
  width: 100%;
  height: 100%;
  -webkit-backdrop-filter: saturate(90%) blur(4px);
  backdrop-filter: saturate(90%) blur(4px);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  --pm-radius: 20px;
  --btn-padding: 10px 20px;
  --btn-border-radius: 6px;
  --success: #05b187;

  &-show {
    opacity: 1;
    transition: all 0.4s ease;
  }

  &__dialog {
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    border-radius: var(--pm -radius);
    -webkit-box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.05);
    -webkit-box-shadow: 0 5px 30px 0 rgba(0, 0, 0, var(--vs-shadow-opacity));
    box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.05);
    // color: #2c3e50;
    // color: rgba(var(--vs-text), 1);
    // max-width: 800px;
    max-width: 360px;
    min-width: 360px;
    position: relative;
    -webkit-transition: all 0.25s ease;
    transition: all 0.25s ease;
    padding: 20px;

    &-content {
      display: flex;
      flex-direction: column;
    }
  }

  .btn {
    font-size: 16px;
    line-height: 1.2;
    padding: var(--btn-padding);
    border-radius: var(--btn-border-radius);
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    .icon {
      width: 16px;
      height: 16px;
      position: relative;
      svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    &-cancel {
      background: #ebeef0;
      color: #8592a3;
      transition: background 0.4s;
    }
    &-search {
      background: var(--success);
      color: #fff;
      transition: background 0.4s;
      &:disabled {
        opacity: 0.5;
      }
    }

    &-refresh {
      background: #7367f0;
      color: #fff;
      transition: all 0.4s;
      padding: 6px;
    }
  }

  /* DIALOG CONTENT */
  .dialog-content {
    &__header {
      display: flex;
      width: 1005;
      button {
        padding: 8px 16px;
        border-bottom: 3px solid #e6e6e6;
        transition: border-color 0.4s;
        flex: 1;
        outline: none;

        &.active {
          border-color: var(--success);
        }
      }
    }
    &__area {
      min-height: 260px;
      padding: 10px 0;
      width: 100%;
      margin-top: 20px;
      .date {
        display: flex;
        flex-direction: column;
        width: 100%;
        label {
          font-weight: 600;
          margin-bottom: 5px;
          color: #2c3e50;
          font-size: 14px;
        }

        &__date-picker {
          width: 100%;
          :deep() .mx-input-wrapper {
            input {
              height: 40px !important;
            }
          }
        }
      }

      .endDate {
        margin-top: 20px;
        height: 80px;

        &.hide {
          opacity: 0;
        }
      }

      .one-date {
        cursor: pointer;
        user-select: none;
        // margin-top: 20px;
        margin: 5px;
        label {
          display: inline-flex;
          align-items: center;
          user-select: none;
          cursor: pointer;
          // padding: 0.4375rem 0;
          margin: 0.5rem 0;
          font-size: 1.125rem;
          line-height: 1.2;

          &::before {
            content: "";
            display: inline-block;
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            flex-grow: 0;
            border: 1px solid orange;
            margin-right: 0.625rem;
            border-radius: 4px;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 70% 70%;
            transition: all 0.4s;
          }
        }

        input {
          margin-right: 10px;
          cursor: pointer;
          position: absolute;
          z-index: -1;
          opacity: 0;
        }
        input:checked + label::before {
          background-color: orange;
          background-image: url("data:image/svg+xml,%3Csvg  viewBox='0 0 13 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.91663 7L5.83329 9.91667L11.6666 4.08334' stroke='%23F9F9F9' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
        }
      }

      .params {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }
    }
    &__footer {
      display: flex;
      justify-content: space-between;
      gap: 5px;
      button {
        flex: 1;
      }
    }
  }
}
</style>
