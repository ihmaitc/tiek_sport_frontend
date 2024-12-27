<script setup lang="ts">
import { SubmitEventPromise } from "vuetify";
import { IPerson, ISelectList } from "@/models/basic";
import { computed, reactive, ref } from "vue";
import { ISetPassportData } from "./types";
import { watch } from "vue";
import { SERIES_LIST } from "@/utils/constants";
import { useI18n } from "vue-i18n";
import { VForm } from "vuetify/components";

interface IProps {
  documentTypeList?: ISelectList[];
  person?: IPerson | null;
  searchLading: boolean;
  clear?: boolean | number;
  isDocumentType?: boolean;
  excludeDocumentTypes?: number[];
}

const props = withDefaults(defineProps<IProps>(), {
  isDocumentType: false
});

const emits = defineEmits<{
  (e: "setPerson", value: ISetPassportData): void;
}>();

const { t } = useI18n();

const form = ref<Partial<typeof VForm>>();

const sortedSeriaList = computed(() => {
  return SERIES_LIST.sort(function (a, b) {
    return a.id - b.id || a.text.localeCompare(b.text);
  });
});

const getDocumentTypeList = computed(() => {
  let newDocuments = props.documentTypeList || [];
  if (props.excludeDocumentTypes && props.documentTypeList) {
    newDocuments = props.documentTypeList.filter((el) => !props.excludeDocumentTypes?.includes(el.value));
  }
  return newDocuments;
});

const pinflRules = [
  (val: any) => {
    if (String(val).length && String(val).length !== 14) return t("notCorrectPinfl");
    return true;
  }
];

const checkPinflLength = (val: string | null) => {
  if (!val) return false;
  return true;
};

const filterPerson = reactive<ISetPassportData>({
  documentTypeId: null,
  seria: "",
  number: null,
  dateOfBirth: "",
  pinfl: ""
});

const clearData = () => {
  filterPerson.documentTypeId = null;
  filterPerson.dateOfBirth = "";
  filterPerson.number = "";
  filterPerson.seria = "";
};

const searchPerson = async (values: SubmitEventPromise) => {
  const { valid } = await values;
  if (valid) {
    emits("setPerson", filterPerson);
  }
};
watch(
  () => [props.clear, props.isDocumentType],
  (value) => {
    if (value[0]) {
      clearData();
    }

    if (!value[1]) {
      delete filterPerson["documentTypeId"];
    }
  },
  { immediate: true }
);

defineExpose({
  searchPerson,
  clearData,
  checkPinflLength,
  form:form
});
</script>

<template>
  <v-form @submit.prevent="searchPerson" ref="form">
    <v-row class="align-center">
      <v-col cols="12" lg="3" md="6" sm="6" class="py-0" v-if="isDocumentType">
        <form-select
          :list="getDocumentTypeList"
          v-model="filterPerson.documentTypeId"
          :label="$t('passportParams.documentType')"
          required
          :disabled="searchLading"
          :noSearch="true"
          style="z-index: 2500"
        />
      </v-col>
      <v-col
        v-if="!filterPerson.documentTypeId || (filterPerson.documentTypeId && ![4, 6, 1].includes(filterPerson.documentTypeId))"
        cols="12"
        lg="3"
        md="6"
        sm="6"
        class="py-0"
      >
        <form-input v-model="filterPerson.seria" :label="$t('passportParams.docSeries')" :disabled="searchLading" required mask="AA" />
      </v-col>
      <v-col cols="12" lg="2" md="6" sm="6" class="py-0" v-if="filterPerson.documentTypeId == 1">
        <form-select :list="sortedSeriaList" v-model="filterPerson.seria" :label="$t('passportParams.docSeries')" :disabled="searchLading" required />
      </v-col>
      <v-col cols="12" lg="2" md="6" sm="6" class="py-0" v-if="filterPerson.documentTypeId != 7">
        <form-input
          v-model="filterPerson.number"
          :label="$t('passportParams.documentNumber')"
          placeholder="#######"
          :mask="filterPerson.documentTypeId == 1 || filterPerson.documentTypeId == 3 ? '########' : '#######'"
          required
          :canAddZero="true"
          :disabled="searchLading"
        />
      </v-col>
      <v-col cols="12" lg="3" md="6" sm="6" class="py-0">
        <form-picker
          class="w-100"
          v-model:model-value="filterPerson.dateOfBirth"
          :label="$t('passportParams.birthOn')"
          required
          :disabled="searchLading"
        />
      </v-col>
      <v-col cols="12" lg="3" md="6" sm="6" class="py-0" v-if="filterPerson.documentTypeId == 1">
        <form-input
          mask="##############"
          class="w-100"
          v-model:model-value="filterPerson.pinfl"
          :label="$t('passportParams.pinfl')"
          :rules="pinflRules"
          :required="checkPinflLength(filterPerson.pinfl)"
          :disabled="searchLading"
        />
      </v-col>
      <v-col cols="12" lg="3" md="6" sm="6" class="py-0">
        <v-btn
          color="success"
          size="large"
          type="submit"
          prepend-icon="mdi-account-search"
          :loading="searchLading"
          @click="searchPerson"
          variant="flat"
        >
          {{ $t("passportParams.Search") }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
