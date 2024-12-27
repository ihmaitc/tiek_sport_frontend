<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

interface IProps {
  values: any[];
  options: any[];
  value: any;
  required?: boolean;
  disabled?: boolean;
  name: string;
  id: string;
  returnObject?: boolean;
}

const props = defineProps<IProps>();
const emits = defineEmits(["change", "update:value"]);

const items = ref<any[]>([]);
const filteredItems = ref<any[]>([]);
const collapse = ref<HTMLDivElement | null>(null);
const inner = ref<HTMLDivElement | null>(null);
const dropDown = ref<HTMLDivElement | null>(null);
const isOpen = ref<boolean>();
const searchValue = ref<string>("");
const cachedSearchValue = ref<string>("");
const loading = ref<boolean>(false);
const isFocused = ref<boolean>(false);

const search = () => {
  if (!isOpen.value) {
    isOpen.value = true;
  }
  filteredItems.value = items.value.filter((item) => String(item?.text).toLowerCase().includes(String(searchValue.value).toLowerCase()));
};

const fieldValue = ref<any>(props.value);

const processItems = () => {
  loading.value = true;
  items.value = [];
  filteredItems.value = [];
  for (let index = 0; index < props.values.length; index++) {
    items.value.push({ value: props.values[index], text: props.options[index] });
    filteredItems.value.push({ value: props.values[index], text: props.options[index] });
  }
  const obj = filteredItems.value.find((el) => el.value === fieldValue.value);
  if (obj) {
    searchValue.value = obj?.text;
    cachedSearchValue.value = obj?.text;
  }
};

const onChangeCallback = (item: any) => {
  if (props.returnObject) {
    fieldValue.value = item;
  } else {
    fieldValue.value = item.value;
  }

  emits("change", fieldValue.value);
  isOpen.value = false;
  const obj = filteredItems.value.find((el) => el.value === fieldValue.value);
  if (obj) {
    searchValue.value = obj?.text;
    cachedSearchValue.value = obj?.text;
  }
};

const open = () => {
  if (loading.value) return;

  isOpen.value = !isOpen.value;
};

const clickOutSide = (e: Event) => {
  if (isOpen.value) {
    if (dropDown.value && collapse.value) {
      if (!e.composedPath().includes(dropDown.value)) {
        isOpen.value = false;
        if (filteredItems.value.find((el) => el.value !== +String(searchValue.value))) {
          searchValue.value = cachedSearchValue.value;
          filteredItems.value = items.value;
        }
        if (filteredItems.value.length == 0) {
        }
      }
    }
  }
};

processItems();

watch(
  () => [collapse.value, filteredItems.value],
  (value) => {
    setTimeout(() => {
      loading.value = false;
    }, 1000);

    if (value[1]) {
      setTimeout(() => {
        if (collapse.value && isOpen.value) {
          collapse.value.setAttribute("style", `height: ${inner.value?.offsetHeight}px`);
        }
      }, 0);
    }
  }
);

watch(
  () => props.values,
  () => {
    processItems();
    setTimeout(() => {
      loading.value = false;
    }, 0);
  }
);

watch(
  () => props.value,
  (value) => {
    fieldValue.value = value;
    processItems();

    setTimeout(() => {
      loading.value = false;
    }, 0);
  }
);

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("click", clickOutSide);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("click", clickOutSide);
  }
});
</script>

<template>
  <div
    class="dropdown"
    ref="dropDown"
    :class="{
      show: isOpen
    }"
  >
    <div class="dropdown-header">
      <slot name="header" :open="open" :opened="isOpen">
        <div class="dropdown-header__input">
          <input
            type="text"
            @click="open"
            v-model="searchValue"
            @input="search"
            :disabled="loading || disabled"
            @focus="isFocused = true"
            @blur="isFocused = false"
          />
          <div
            class="input-icon"
            :class="{
              rotate: isOpen
            }"
          >
            <svg data-v-3bdfbb94="" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                data-v-3bdfbb94=""
                d="M1 1.5L6 6.5L11 1.5"
                stroke="#8A8B8F"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </div>
        </div>
      </slot>
      <div class="skeleton-parent" v-if="loading">
        <div class="skeleton">
          <div class="skeleton-light"></div>
        </div>
      </div>
    </div>
    <div
      class="collapse"
      ref="collapse"
      :style="{
        height: isOpen && inner ? `${inner.offsetHeight}px` : 0
      }"
    >
      <div class="collapse-wrapper-inner" ref="inner">
        <slot name="collapse" :open="open" :opened="isOpen" :onChangeCallback="onChangeCallback">
          <div v-for="item in filteredItems" :class="['item', { selected: item.value === fieldValue }]" :item="item" @click="onChangeCallback(item)">
            {{ item.text }}
          </div>
          <div class="item" v-if="filteredItems && filteredItems.length === 0">{{ $t("NotFound") }}</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
.dropdown {
  position: relative;
  font-weight: 400;
  font-style: normal;
  display: inline-flex;
  color: rgba(0, 0, 0, 0.87);
  margin: 0 5px;
  --bg: #fff;
  --border: #d8d8d8;
  display: flex;
  flex: 1;
  width: 100%;

  &-header {
    position: relative;
    width: 100%;
    overflow: hidden;
    // border: 1px solrgba(34, 94, 154, 0.15)15);
    // border: 1px solid rgba(20, 106, 193, 0.15);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding-right: 10px;
    background: var(--bg);

    .skeleton-parent {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
    }
    .skeleton {
      overflow: hidden;
      width: 100%;
      height: 100%;
      position: relative;
      background-color: rgb(231, 228, 228);
      &-light {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateX(-100%);
        background-color: rgb(234, 153, 4);
        animation: shimmer 1.5s infinite;
      }
    }

    .selected-item {
      position: absolute;
      top: 50%;
      left: 0.5rem;
      transform: translateY(-50%);
    }

    &__input {
      display: flex;
      align-items: center;
      justify-self: center;
      width: 100%;
      height: 100%;
      .input-icon {
        transition: transform 0.3s;
        width: 0.625rem;
        height: 0.625rem;
        position: relative;

        svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        &.rotate {
          transform: rotate(180deg);
        }
      }
    }
  }

  input {
    margin: 0;
    max-width: 100%;
    outline: 0;
    // -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    text-align: left;
    line-height: 1.21428571em;
    font-weight: 500;
    // font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
    padding: 0.67857143rem 0.5rem;
    color: rgba(0, 0, 0, 0.87);
    border-radius: 0.28571429rem;
    transition: box-shadow 0.1s ease, border-color 0.1s ease;
    box-shadow: none;
    width: 100%;

    &:disabled {
      opacity: 0.5;
    }
  }
  .collapse {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    background-color: var(--bg);
    overflow: hidden;
    height: 0;
    transition: all 0.4s ease;
    width: 100%;
    z-index: 99999;
    max-height: 300px;
    overflow-y: auto;
    border-radius: 10px;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgb(238, 238, 238);
    }
    &::-webkit-scrollbar-thumb {
      background: rgb(214, 214, 214);
      border-radius: 6px;
    }

    &-wrapper-inner {
      width: 100%;
    }

    .item {
      position: relative;
      cursor: pointer;
      display: block;
      border: none;
      height: auto;
      text-align: left;
      border-top: none;
      line-height: 1em;
      color: rgba(0, 0, 0, 0.87);
      padding: 0.78571429rem 1.14285714rem !important;
      font-size: 1rem;
      text-transform: none;
      font-weight: 400;
      box-shadow: none;
      -webkit-touch-callout: none;
      border-top: 1px solid #fafafa;
      padding: 0.78571429rem 1.14285714rem !important;
      white-space: normal;
      word-wrap: normal;
      transition: all 0.4s;

      &.selected {
        background: rgba(122, 122, 122, 0.2);
      }

      &:hover {
        background-color: rgba(142, 142, 142, 0.1);
      }
    }
  }
}
</style>
