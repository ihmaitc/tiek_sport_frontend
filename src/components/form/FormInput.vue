<script setup lang="ts">
import { ref, watch, computed, toRefs } from "vue";
import type { FormInputTypes } from "@/models/vuetify/types";
import { VTextField } from "vuetify/components";
import { useI18n } from "vue-i18n";

const props = withDefaults(defineProps<FormInputTypes>(), {
  type: "text",
  mask: "",
  variant: "outlined",
  color: "primary",
  validateOn: "lazy submit",
  clearable: true
});

const customRules = ref<any>([]);
const { t } = useI18n();
const { max, required, rules, canAddZero, min, minValue, maxValue } = toRefs(props);

const minRules = [
  (value: any) => {
    if (value && min.value && +String(value).length < +min.value) {
      return t("minLengthError", { count: min.value });
    }
    return true;
  }
];
const maxRules = [
  (value: any) => {
    if (value && max.value && +String(value).length > +max.value) {
      return t("maxLengthError", { count: max.value });
    }
    return true;
  }
];

const minValueRules = [
  (value: any) => {
    if (value && minValue.value && +String(value) < +minValue.value) {
      return t("minValueError", { value: minValue.value });
    }
    return true;
  }
];

const maxValueRules = [
  (value: any) => {
    console.log(maxValue.value);
    if (value && maxValue.value && +String(value) > +maxValue.value) {
      return t("maxValueError", { value: maxValue.value });
    }
    return true;
  }
];

const setRules = () => {
  if (required.value) {
    if (rules.value && rules.value.length > 0) {
      customRules.value = [...rules.value, ...minRules, ...maxRules, ...minValueRules, ...maxValueRules];
      return;
    }
    customRules.value = [
      (value: any) => {
        if ((value && value.length === 0) || !value) return t("fieldNotEmpty");

        return true;
      },

      ...minRules,
      ...maxRules,
      ...minValueRules,
      ...maxValueRules
    ];
  } else {
    if (min.value || max.value) {
      customRules.value = [...minRules, ...maxRules];
      return;
    }
    if (minValue.value || maxValue.value) {
      customRules.value = [...minValueRules, ...maxValueRules];
      return;
    }
    customRules.value = [];
  }
};

const emits = defineEmits(["update:modelValue", "appendInner", "blur", "focus"]);

const model = computed({
  get(): string {
    let val = props.modelValue;

    if (val && max.value && +String(val).length > +String(max.value)) {
      val = val.slice(0, +String(max.value));
      emits("update:modelValue", val);
    }
    return canAddZero.value ? val : val == 0 ? null : val;
  },
  set(newValue: string): void {
    let val = newValue;
    if (max.value && +String(val).length > +max.value) {
      val = val.slice(0, +max.value);
    }
    if (props.upperCase) {
      emits("update:modelValue", val.toUpperCase());
    } else {
      emits("update:modelValue", val);
    }
  }
});

watch(
  () => props,
  () => {
    setRules();
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div>
    <v-label v-if="label" class="mb-2 font-weight-medium">
      {{ label }}
      <span v-if="required && !hideStar" style="color: red">*</span>
    </v-label>
    <v-text-field
      v-if="type !== 'textarea'"
      class="w-100"
      v-bind="props"
      :rules="customRules"
      label=""
      :clearable="!required && clearable"
      :placeholder="placeholder ? placeholder : label"
      v-mask="mask"
      v-model="model"
      :length="max"
      :hide-details="!required"
      @click:append-inner="emits('appendInner')"
      @keyup.enter="emits('appendInner')"
      @blur="() => $emit('blur', model)"
      @focus="() => $emit('focus', model)"
    >
      <template v-for="(_, name) in ($slots as Record<string, any>)" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </v-text-field>
    <v-textarea
      v-else
      class="w-100"
      v-bind="props"
      :rules="customRules"
      label=""
      :clearable="!required && clearable"
      :placeholder="placeholder ? placeholder : label"
      v-mask="mask"
      v-model="model"
      :hide-details="!required"
      @click:append-inner="emits('appendInner')"
      @keyup.enter="emits('appendInner')"
      @blur="() => $emit('blur', model)"
      @focus="() => $emit('focus', model)"
    >
      <template v-for="(_, name) in ($slots as Record<string, any>)" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </v-textarea>
  </div>
</template>
