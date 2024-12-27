<script setup lang="ts">
import { IPerson } from "@/models/basic";
import { storeToRefs } from "pinia";
import { computed, nextTick, ref, toRefs } from "vue";
import { useSurvey } from "../store/useSurvey";
import { SurveyService } from "../service/Survey.service";
import { SubmitEventPromise } from "vuetify";
import PersonService from "@/services/others/person.service";
import { ISetPassportData } from "@/components/UserInfo/types";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import SetPassportData from "@/components/UserInfo/SetPassportData.vue";
import { useManualStore } from "@/app/config/store/Manual";
import { CreateSurveyMember } from "../SurveyHelpers";
import { useRoute } from "vue-router";

interface IProps {
  isView?: boolean;
}

const props = defineProps<IProps>();
const { isView } = toRefs(props);

const store = useSurvey();
const manualStore = useManualStore();

const { data, members } = storeToRefs(store);
const { IdentityDocumentSelectList, kinshipDegreeSelectList } = storeToRefs(manualStore);

const { setError } = useErrorToast();
const { t } = useI18n();
const route = useRoute();

const isClear = ref(false);
const addLoading = ref(false);
const familyMember = ref<IPerson | null>(null);
const kinshipDegreeId = ref<number | null>(null);
const passportDataRef = ref<Partial<typeof SetPassportData> | null>(null);
const searchLading = ref(false);

const dataId = computed(() => {
  if (route.query?.surveyId) {
    return route.query.surveyId;
  } else if (route.query?.surveyCreatedId) {
    return route.query.surveyCreatedId;
  } else if (route.params?.id) {
    return route.params.id;
  } else {
    return null;
  }
});

const searchFamilyMember = (values: ISetPassportData) => {
  searchLading.value = true;
  PersonService.GetByPassportData({
    ...values
  })
    .then((res) => {
      if (data.value) {
        familyMember.value = res.data;
      }
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      searchLading.value = false;
    });
};

const setKinshipdegiree = (val: number) => {
  if (familyMember.value) {
    familyMember.value.kinshipDegreeId = val;
    kinshipDegreeId.value = val;
  }
};

const addRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    if (!familyMember.value) {
      notify({
        text: t("pleaseAddPerson"),
        type: "warn"
      });

      if (passportDataRef.value) {
        const { valid } = await passportDataRef.value.form.validate();

        if (valid) {
          passportDataRef.value.searchPerson(passportDataRef.value.form.value.validate());
        }
      }
      return;
    }

    // check famimyMember in data.invSurveyMembers
    if (members.value) {
      const isExist = members.value.find((item) => item.person?.pinfl === familyMember.value?.pinfl);

      if (isExist) {
        notify({
          text: t("personAlreadyAdded"),
          type: "warn"
        });

        return;
      }
    }

    if (data.value && data.value.id) {
      addLoading.value = true;
      SurveyService.AddSurveyMember({
        person: familyMember.value,
        kinshipDegreeId: kinshipDegreeId.value,
        ownerId: data.value.id
      })
        .then(async (res) => {
          if (data.value) {
            members.value.push({
              person: familyMember.value,
              kinshipDegreeId: kinshipDegreeId.value,
              ownerId: data.value.id,
              id: res.data.id,
              addingFamily: 2
            });
            if ((await CreateSurveyMember(res.data)).length) {
              store.refresh({
                returnId: dataId.value,
                query: route.query
              });
            }

            familyMember.value = null;
            kinshipDegreeId.value = null;
            isClear.value = true;
          }
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => {
          addLoading.value = false;
        });
    } else {
      if (data.value) {
        members.value.push({
          person: familyMember.value,
          kinshipDegreeId: kinshipDegreeId.value,
          addingFamily: 2
        });

        familyMember.value = null;
        kinshipDegreeId.value = null;
        isClear.value = true;

        addLoading.value = false;
      }
    }

    await nextTick();

    isClear.value = false;
  }
};

manualStore.fetchIdentityDocumentSelectList();
manualStore.fetchKinshipDegreeSelectList();
</script>

<template>
  <v-form v-if="data">
    <ui-parent-card>
      <v-row>
        <v-col cols="12">
          <v-form @submit.prevent="addRow">
            <set-passport-data
              ref="passportDataRef"
              v-if="!isView"
              :document-type-list="IdentityDocumentSelectList"
              is-document-type
              :clear="isClear"
              @set-person="searchFamilyMember"
              :search-lading="searchLading"
            >
            </set-passport-data>
            <user-info :person="familyMember" class="mt-4"></user-info>

            <v-row class="align-center mt-4" v-if="!isView">
              <v-col lg="3" cols="12">
                <form-select
                  required
                  :list="kinshipDegreeSelectList"
                  v-model="kinshipDegreeId"
                  :label="$t('kinshipdegree')"
                  @update:model-value="setKinshipdegiree"
                >
                </form-select>
              </v-col>
              <v-col lg="3" cols="12">
                <v-btn :loading="addLoading" type="submit" color="info"> {{ $t("addPerson") }} </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </ui-parent-card>
  </v-form>
</template>
