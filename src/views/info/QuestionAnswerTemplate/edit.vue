<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { GetQuestionAnswerTemplate, GetQuestionAnswerTemplateTables } from "./types";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { QuestionAnswerTemplateService } from "@/services/info/QuestionAnswerTemplate.service";
import { SubmitEventPromise } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import i18n from "@/app/config/i18n";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { IFields, ISelectList, ITableActions } from "@/models/basic";
import TranslateItems from "@/components/TranslateItems.vue";
import ManualService from "@/services/others/manual.service.";

const data = ref<GetQuestionAnswerTemplate | null>(null);
const route = useRoute();
const router = useRouter();

const stateSelectList = ref<ISelectList[]>([]);

const fields: IFields[] = [
  {
    key: "answerText",
    // @ts-ignore
    label: "answerText",
    type: "input"
  },
  {
    key: "action",
    // @ts-ignore
    label: "actions",
    type: "input"
  }
];

const tabRow = ref<GetQuestionAnswerTemplateTables>({
  answerText: "",
  id: 0,
  translates: [],
  orderNumber: 1
});
const actions: ITableActions = {
  isDelete: true,
  isEdit: true
};
const editIndex = ref(-1);

const { setError } = useErrorToast();

const id = route.params.id as string;
const loading = ref<boolean>(false);
const saveLoading = ref<boolean>(false);

const fetchStateSelectList = () => {
  ManualService.StateSelectList().then((res) => {
    stateSelectList.value = res.data;
  });
};

const setData = () => {
  loading.value = true;
  QuestionAnswerTemplateService.Get(id)
    .then((res) => {
      data.value = res.data;
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      loading.value = false;
    });
};

const addRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (valid) {
    if (data.value) {
      if (editIndex.value > -1) {
        Object.assign(data.value?.tables[editIndex.value], JSON.parse(JSON.stringify(tabRow.value)));
      } else {
        if (data.value.tables.some((item) => item.answerText === tabRow.value.answerText)) {
          notify({
            // @ts-ignore
            text: i18n.global.t("answerTextIsAccepted"),
            type: "warn"
          });
          return;
        }
        data.value?.tables.push(tabRow.value);
      }
      clearTabRow();
      if (editIndex.value == -1) {
        tabRow.value.orderNumber = data.value?.tables.length + 1;
      }
      editIndex.value = -1;
    }
  }
};

const editRow = (item: GetQuestionAnswerTemplateTables) => {
  if (data.value) {
    editIndex.value = data.value.tables.indexOf(item);
    tabRow.value = JSON.parse(JSON.stringify(item));
  }
};
const deleteTabRow = (index: number) => {
  if (data.value) {
    data.value.tables.splice(index, 1);
  }
};

const setEditIndex = (value: number) => {
  editIndex.value = value;
  clearTabRow();
};

const clearTabRow = () => {
  if (data.value) {
    tabRow.value = {
      answerText: "",
      id: 0,
      translates: [],
      orderNumber: data.value.tables.length + 1
    };
  }
};

const saveData = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (valid) {
    if (data.value && data.value.tables.length === 0) {
      notify({
        // @ts-ignore
        text: i18n.global.t("mustAddTable"),
        type: "warn"
      });
      return;
    }
    saveLoading.value = true;
    QuestionAnswerTemplateService.Update(data.value)
      .then(() => {
        notify({
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });

        router.push({ name: "QuestionAnswerTemplate" });
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

setData();
fetchStateSelectList();
</script>

<template>
  <div>
    <UiParentCard v-if="loading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <v-form v-if="data" @submit.prevent="saveData">
      <UiParentCard>
        <v-row>
          <v-col cols="12" lg="3" md="6">
            <form-input mask="#####" v-model="data.orderNumber" :label="$t('orderNumber')" />
          </v-col>
          <v-col cols="12" lg="3" md="6">
            <form-input mask="#####" v-model="data.code" :label="$t('code')" />
          </v-col>
          <v-col cols="12" lg="3" md="6">
            <TranslateItems
              v-model:translates="data.translates"
              column-name="short_name"
              :label="$t('shortName')"
              v-model:value="data.shortName"
              required
            />
          </v-col>
          <v-col cols="12" lg="3" md="6">
            <TranslateItems
              v-model:translates="data.translates"
              column-name="full_name"
              :label="$t('fullName')"
              v-model:value="data.fullName"
              required
            />
          </v-col>

          <v-col cols="12" lg="3" md="6" class="py-0" v-if="+route.params.id !== 0">
            <form-select :list="stateSelectList" v-model:modelValue="data.stateId" :label="$t('status')"></form-select>
          </v-col>
        </v-row>
      </UiParentCard>

      <UiParentCard class="mt-4">
        <FormTabRow
          :items="data.tables"
          v-model:edit-index="editIndex"
          :fields="fields"
          :actions="actions"
          @update:edit-index="setEditIndex"
          @edit-tab-row="editRow"
          @delete-tab-row="deleteTabRow"
        >
          <template #default>
            <v-form @submit.prevent="addRow">
              <v-row class="align-center mb-3">
                <v-col cols="12" lg="3" md="6" class="py-0">
                  <TranslateItems
                    v-model:translates="tabRow.translates"
                    column-name="answer_text"
                    :label="$t('answerText')"
                    v-model:value="tabRow.answerText"
                    required
                  />
                </v-col>

                <div>
                  <v-btn type="submit" :color="editIndex > -1 ? 'success' : 'info'">
                    {{ editIndex > -1 ? $t("Save") : $t("AddRow") }}
                  </v-btn>
                </div>
              </v-row>
            </v-form>
          </template>
          <template #answerText="{ item }">
            <td>
              <div class="d-flex cursor-pointer">
                <TranslateItems
                  v-model:translates="item.translates"
                  column-name="answer_text"
                  :label="$t('answerText')"
                  v-model:value="item.answerText"
                  required
                  is-view
                />
              </div>
            </td>
          </template>
        </FormTabRow>
      </UiParentCard>

      <v-row class="mt-2 px-3">
        <v-btn color="error" variant="flat" @click="router.back()" :text="$t('Back')" />
        <v-spacer />
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit" :text="$t('Save')" />
      </v-row>
    </v-form>
  </div>
</template>
