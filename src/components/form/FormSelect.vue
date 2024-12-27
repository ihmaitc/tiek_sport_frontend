<script setup lang="ts">
import { FormSelectTypes } from "@/models/vuetify/types";
import { computed, watch, ref, useAttrs } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = withDefaults(defineProps<FormSelectTypes>(), {
  variant: "outlined",
  color: "primary",
  itemTitle: "text",
  itemValue: "value",
  disabled: false,
  hideDetails: true,
  placeholder: "ChooseBelow",
  validateOn: "lazy submit",
  clearable: true
});

const emits = defineEmits(["update:modelValue"]);

const attrs = useAttrs();
const listeners = Object.keys(attrs).reduce((acc: any, key) => {
  if (key.startsWith("on")) {
    acc[key] = attrs[key];
  }
  return acc;
}, {});

const model = computed({
  get(): string {
    return props.modelValue == 0 ? null : props.modelValue;
  },
  set(newValue: string): void {
    emits("update:modelValue", newValue);
  }
});
const customRules = ref<any>([]);

const setRules = () => {
  if (props.required) {
    if (props.rules && props.rules.length > 0) {
      customRules.value = props.rules;
      return;
    }
    customRules.value = [
      (value: any) => {
        if (value) return true;
        // @ts-ignore
        return t("fieldNotEmpty");
      }
    ];
  } else {
    customRules.value = [];
  }
};

watch(
  () => [props.required, props.rules],
  () => {
    setRules();
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <v-label class="mb-2 font-weight-medium" v-if="label">
      {{ label }}
      <span v-if="required && !hideStar" style="color: red">*</span>
    </v-label>
    <v-select
      v-if="noSearch"
      v-bind="{
        ...attrs,
        ...props
      }"
      v-on="listeners"
      v-model="model"
      :items="list"
      label=""
      :hideDetails="!required"
      :placeholder="t(placeholder)"
      :no-data-text="t('NoData')"
      :rules="customRules"
      :closable-chips="multiple"
      :clearable="!required && clearable"
    >
      <template v-slot:chip="{ props }" v-if="multiple">
        <v-chip v-bind="props"></v-chip>
      </template>
    </v-select>
    <v-autocomplete
      v-else
      v-bind="{
        ...attrs,
        ...props
      }"
      v-on="listeners"
      v-model="model"
      :items="list"
      label=""
      :placeholder="t(placeholder)"
      :no-data-text="t('NoData')"
      :rules="customRules"
      :clearable="!required && clearable"
      :closable-chips="multiple"
      :hideDetails="!required"
    >
      <template v-slot:chip="{ props }" v-if="multiple">
        <v-chip v-bind="props"></v-chip>
      </template>
    </v-autocomplete>
  </div>
</template>
