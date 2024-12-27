<script setup lang="ts">
import FormInput from "@/components/form/FormInput.vue";
import { IFields } from "@/models/basic";
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { XIcon } from "vue-tabler-icons";

interface IProps {
  columnName: string;
  value: string;
  translates: any[];
  languageList: any[];
  hideX?: boolean;
  hidePlus?: boolean;
  hideTranslate?: boolean;
  required?: boolean;
  rules?: any;
  placeholder?: string;
  label?: string;
  orderCode?: number | string | IOrderCode[];
  view?: boolean;
  disabled?: boolean;
  isNumber?: boolean;
}

interface ITranslatedItems {
  languageId: number;
  language?: string;
  columnName: string;
  translateText: string;
}

const props = withDefaults(defineProps<IProps>(), {});
const { t } = useI18n();

const emits = defineEmits<{
  (e: "update:translates", value: any): void;
  (e: "update:value", value: any): void;
  (e: "deleteTabRow"): void;
}>();

const customRules = ref<any>([]);
const wordPattern = /^\d+$/;

const onlyNumberRules = [
  (value: any) => {
    if (!value) return t("fieldNotEmpty");
    if (value && wordPattern.test(value)) return true;
    return t("StringNotAssignToNumber");
  }
];

const setRules = () => {
  if (props.required) {
    if (props.rules && props.rules.length > 0) {
      customRules.value = props.rules;
      return;
    }
    if (props.isNumber && props.required) {
      customRules.value = onlyNumberRules;
      return;
    }
    customRules.value = [
      (value: any) => {
        if (value) return true;
        return t("fieldNotEmpty");
      }
    ];
  } else {
    customRules.value = [];
  }
};

const model = computed({
  get(): string {
    return props.value;
  },
  set(value: string) {
    emits("update:value", value);
  }
});
const deleteModal = ref(false);
const translateFields: IFields[] = [
  {
    key: "language",

    label: t("languagename")
  },
  {
    key: "translateText",
    label: t("translateText")
  }
];

const translateItems = ref<ITranslatedItems[]>([]);

translateItems.value = props.translates;

const translateModal = ref<boolean>(false);
const getTranslateItem = (columnname: string) => {
  translateItems.value = [];

  props.languageList.forEach((language) => {
    const translationItem = props.translates.find((item: ITranslatedItems) => item.columnName === columnname && item.languageId === language.value);
    translateItems.value.push({
      languageId: language.value,
      language: language.text,
      columnName: columnname,
      translateText: translationItem ? translationItem.translateText : ""
    });
  });
};
const openTranslateModal = (name: string) => {
  translateModal.value = true;
  getTranslateItem(name);
};

const anotherTranslates = computed(() => props.translates.filter((e) => e.columnName != props.columnName));

const saveTranslate = () => {
  let list: ITranslatedItems[] = [];
  translateItems.value.forEach((translatedItem) => {
    const existingTranslationIndex = props.translates.findIndex(
      (item: ITranslatedItems) => item.columnName === translatedItem.columnName && item.languageId === translatedItem.languageId
    );

    if (existingTranslationIndex > -1) {
      props.translates[existingTranslationIndex].translateText = translatedItem.translateText;
    } else {
      translateItems.value.push({
        ...translatedItem,
        columnName: props.columnName
      });
    }
  });
  const key = "languageId";
  list = [...new Map(translateItems.value.map((item) => [item[key], item])).values()];

  emits("update:translates", [...anotherTranslates.value, ...list.filter((e) => e.translateText)]);
  translateModal.value = false;
};

interface IOrderCode {
  parent: number;
  child?: IOrderCode[];
}

watch(
  () => [props.required, props.rules, props.isNumber],
  () => {
    setRules();
  },
  { immediate: true }
);
</script>

<template>
  <div class="w-100">
    <v-label v-if="label" :class="['mb-2 font-weight-medium']">
      {{ label }}
      <span v-if="required" style="color: red">*</span>
    </v-label>

    <div class="d-flex align-center w-100" v-if="!view">
      <v-label v-if="!Array.isArray(orderCode) && orderCode" :class="['mx-2', { 'mb-4': required }]"> {{ orderCode }}. </v-label>
      <v-label v-if="Array.isArray(orderCode)" :class="['mx-2', { 'mb-4': required }]">
        <template v-for="coder in orderCode">
          {{ coder.parent }}.
          <template v-if="coder.child" v-for="ch in coder.child">
            {{ ch.parent }}.

            <template v-if="ch.child" v-for="child in ch.child"> {{ child.parent }}. </template>
          </template>
        </template>
      </v-label>
      <v-text-field
        style=""
        :rules="customRules"
        :hide-details="!required"
        v-model="model"
        :placeholder="placeholder"
        :disabled="disabled"
        :validate-on="isNumber ? 'input lazy' : 'submit lazy'"
        label=""
      >
        <template #append-inner>
          <v-sheet class="cursor-pointer" @click="openTranslateModal(props.columnName)">
            <v-tooltip activator="parent" location="top">
              {{ $t("Translates") }}
            </v-tooltip>
            <v-icon size="18">mdi-earth</v-icon>
          </v-sheet>
          <slot name="delete" v-if="!view">
            <v-sheet v-if="!hideX" class="cursor-pointer" @click="deleteModal = true">
              <v-tooltip activator="parent" location="top">
                {{ $t("Delete") }}
              </v-tooltip>
              <v-icon>mdi-delete</v-icon>
            </v-sheet>
          </slot>
          <slot name="action"></slot>
        </template>
      </v-text-field>
    </div>
    <div class="d-flex align-center" v-if="view">
      <v-label v-if="!Array.isArray(orderCode) && orderCode" :class="['mx-2']"> {{ orderCode }}. </v-label>
      <v-label v-if="Array.isArray(orderCode)" :class="['mx-2']">
        <template v-for="coder in orderCode">
          {{ coder.parent }}.
          <template v-if="coder.child" v-for="ch in coder.child">
            {{ ch.parent }}.

            <template v-if="ch.child" v-for="child in ch.child"> {{ child.parent }}. </template>
          </template>
        </template>
      </v-label>
      <h4 class="font-weight-bold">{{ value }}</h4>
      <span class="text-error ml-1" v-if="required">*</span>

      <slot name="action"></slot>
    </div>

    <v-dialog v-model="translateModal" width="800">
      <v-card class="px-5 py-5">
        <v-card-title>
          <v-row>
            <v-col>
              {{ $t("Translates") }}
            </v-col>
            <v-col class="text-right">
              <v-btn @click="translateModal = false">
                <XIcon />
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-table fixed-header>
          <thead>
            <tr>
              <th v-for="item in translateFields">
                {{ item.label }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr class="" v-for="item in translateItems">
              <td class="py-2 border">
                {{ item.language }}
              </td>
              <td class="bg- py-2 pr-0 border" style="width: 600px">
                <form-input :placeholder="$t('fullName')" v-model="item.translateText"></form-input>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-row class="mt-3">
          <v-col class="text-right">
            <v-btn @click="saveTranslate" color="success" variant="flat">{{ $t("Save") }}</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <!-- MODALS -->
    <v-dialog v-model="deleteModal" width="300">
      <v-card>
        <v-card-text>
          {{ $t("wantDelete") }}
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn
                color="error"
                variant="flat"
                block
                @click="
                  () => {
                    deleteModal = false;
                  }
                "
              >
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                color="success"
                variant="flat"
                block
                @click="
                  () => {
                    emits('deleteTabRow');
                    deleteModal = false;
                  }
                "
              >
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
