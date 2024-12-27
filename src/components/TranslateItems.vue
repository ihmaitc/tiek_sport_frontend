<script setup lang="ts">
import { ref } from "vue";
import type { IFields } from "@/models/basic";
import { computed } from "vue";
import i18n from "@/app/config/i18n";
import { XIcon } from "vue-tabler-icons";
import { useManualStore } from "@/app/config/store/Manual";

interface ITranslatedItems {
  languageId: number;
  language?: string;
  columnName: string;
  translateText: string;
}
interface IProps {
  value: any;
  columnName: string;
  translates: ITranslatedItems[];
  required?: boolean;
  label?: string;
  placeholder?: string;
  isView?: boolean;
  isEditor?: boolean;
}

const props = defineProps<IProps>();
const store = useManualStore();
const emits = defineEmits<{
  (e: "update:translates", value: any): void;
  (e: "update:value", value: any): void;
}>();

const model = computed({
  get(): string {
    return props.value;
  },
  set(newValue: string): void {
    emits("update:value", newValue);
  }
});

const translateFields: IFields[] = [
  {
    key: "language",
    // @ts-ignore
    label: i18n.global.t("languagename")
  },
  {
    key: "translateText",
    label: i18n.global.t("translateText")
  }
];

const translateItems = ref<ITranslatedItems[]>([]);
const translateModal = ref<boolean>(false);
const anotherTranslates = computed(() => props.translates.filter((e) => e.columnName != props.columnName));

const getTranslateItem = () => {
  const list: ITranslatedItems[] = props.translates.filter((item) => item.columnName == props.columnName);

  store.LanguageList.forEach((lang) => {
    const index = list.findIndex((e) => e.languageId == lang.value);

    if (index == -1) {
      list.push({
        languageId: lang.value,
        columnName: props.columnName,
        language: lang.text,
        translateText: ""
      });
    } else {
      list.splice(index, 1, {
        languageId: lang.value,
        language: lang.text,
        columnName: props.columnName,
        translateText: list.find((e) => e.languageId == lang.value)?.translateText || ""
      });
    }
  });

  translateItems.value = list.sort((a, b) => a.languageId - b.languageId);
};

const openTranslateModal = () => {
  translateModal.value = true;
  getTranslateItem();
};

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

// store.fetchLanguageList();
</script>

<template>
  <div class="w-100">
    <template v-if="!isView">
      <form-input
        v-if="!isEditor"
        class="w-100"
        v-model="model"
        @append-inner="openTranslateModal()"
        append-inner-icon="mdi-earth"
        :label="label"
        :required="required"
        :placeholder="placeholder ? placeholder : label"
      />
      <div v-else>
        <v-label>
          {{ label }}
          <span v-if="required" style="color: red">*</span>
        </v-label>
        <div class="d-flex position-relative mt-3">
          <v-btn icon="mdi-earth" variant="text" color="grey200" class="position-absolute right-0" @click="openTranslateModal()" />
        </div>
      </div>
    </template>

    <div v-else class="d-flex justify-lg-space-between cursor-pointer w-100" @click="openTranslateModal()">
      <v-label> {{ model }}</v-label>
      <v-icon color="grey200 ml-auto"> mdi-earth </v-icon>
    </div>
    <!-- MODAL -->

    <v-dialog v-model="translateModal" :width="isEditor ? '90%' : 800">
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
              <td class="bg- py-2 pr-0 border" v-if="isEditor">
                <span v-if="isView" v-html="item.translateText"> </span>
              </td>
              <td class="bg- py-2 pr-0 border" style="width: 600px" v-else>
                <span v-if="isView">
                  {{ item.translateText || "-" }}
                </span>
                <form-input v-else :placeholder="$t('fullName')" v-model="item.translateText"></form-input>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-row class="mt-3" v-if="!isView">
          <v-col class="text-right">
            <v-btn @click="saveTranslate" color="success" variant="flat">{{ $t("Save") }}</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>
