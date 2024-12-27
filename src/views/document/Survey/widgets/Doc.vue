<script setup lang="ts">
import { useSurvey } from "../store/useSurvey";
import { storeToRefs } from "pinia";
import SetPassportData from "@/components/UserInfo/SetPassportData.vue";
import { computed, ref, toRefs } from "vue";
import { ISetPassportData } from "@/components/UserInfo/types";
import UserInfo from "@/components/UserInfo/UserInfo.vue";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import PersonService from "@/services/others/person.service";
import { IPerson } from "@/models/basic";
import MemberSurvey from "./MemberSurvey.vue";
import { useRoute } from "vue-router";
import AddSurveyMembers from "./AddSurveyMembers.vue";
import { useI18n } from "vue-i18n";
import { invSurveyMembers } from "../types";
import { SurveyService } from "../service/Survey.service";
import { ALGORITHMS_KEY, GROUPS_KEY } from "../SurveyConstants";
import QuestionnaireGroups from "./Questionnaire/QuestionnaireGroups.vue";
import PhoneNumberWithMobileCode from "@/components/form/PhoneNumberWithMobileCode.vue";
import { useGlobal } from "@/composables/useGlobal";

interface IProps {
  isView?: boolean;
}
const props = defineProps<IProps>();
const emits = defineEmits(["start"]);
const { isView } = toRefs(props);
const store = useSurvey();
const route = useRoute();
const isEdit = computed(() => !!Number(String(route.params.id)));

const { data, members, memberType, familyMembersLoading, loading, showFamilies } = storeToRefs(store);
const { setError } = useErrorToast();
const { t } = useI18n();
const { getColor } = useGlobal();

const removeLoading = ref<boolean>(false);
const searchLading = ref(false);

const memberTypeSelectList = ref([
  { value: false, text: t("familyMember") },
  { value: true, text: t("additionalFamilyMember") }
]);

const checkKinshipDegree = computed(() => {
  if (data.value) {
    return data.value.invSurveyMembers?.find((item) => item.kinshipDegreeId == 7);
  }
  return false;
});

const isAdditionalFamily = computed(() => {
  if (members.value) {
    const isExist = members.value?.find((item) => item.id == +String(route.query.memberId) && item.addingFamily == 2);

    if (route.query && route.query.memberId && isExist) return true;
  }

  return false;
});

const filteredInvSurveyMembers = computed(() => {
  return (addingFamilyType?: number) => {
    if (!members.value) return [];
    if (addingFamilyType == 2) {
      return members.value.filter((item) => item.addingFamily == addingFamilyType) || [];
    } else {
      return members.value.filter((item) => item.addingFamily != 2) || [];
    }
  };
});

const getActivePersonFromMembers = computed(() => {
  return members.value && members.value.find((el) => el.person?.id == data.value?.applicantPerson?.id);
});

const searchPerson = (values: ISetPassportData) => {
  if (values) {
    searchLading.value = true;
    PersonService.GetByPassportData({
      ...values,
      documentTypeId: 2
    })
      .then((res) => {
        if (data.value) {
          data.value.applicantPerson = res.data;
          getPersonFamilyMembers();
          emits("start");
        }
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        searchLading.value = false;
      });
  }
};

const getPersonFamilyMembers = () => {
  familyMembersLoading.value = true;
  if (data.value) {
    members.value = [];
  }
  PersonService.GetPersonFamilyV2({
    pinfl: data.value?.applicantPerson?.pinfl
  })
    .then((res) => {
      if (data.value) {
        if (data.value.invQuestionnaireTypeId == 1) {
          members.value = res.data.map((element: IPerson) => {
            return {
              person: element,
              kinshipDegreeId: element.kinshipDegreeId,
              kinshipDegree: element.kinshipDegree,
              addingFamily: 1
            };
          });
        } else {
          members.value = res.data
            .map((element: IPerson) => {
              return {
                person: element,
                kinshipDegreeId: element.kinshipDegreeId,
                kinshipDegree: element.kinshipDegree,
                addingFamily: 1
              };
            })
            .filter((el: any) => el.person?.pinfl !== data.value?.applicantPerson?.pinfl);
        }
      }
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      familyMembersLoading.value = false;
    });
};

const updateMemberType = (val: boolean) => {
  store.setData({
    id: String(route.params.id),
    query: route.query,
    cb: () => {
      if (val) getPersonFamilyMembers();
    }
  });
};

const deleteRow = (member: invSurveyMembers) => {
  if (data.value) {
    removeLoading.value = true;
    SurveyService.RemoveSurveyMember({
      id: member.id
    })
      .then(() => {
        if (data.value) {
          members.value = members.value.filter((item) => item.id != member.id);
        }
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        removeLoading.value = false;
      });
  }
};
</script>

<template>
  <div v-if="data">
    <ui-parent-card>
      <v-row class="align-center">
        <v-col lg="3" :sm="isView ? 5 : 6" cols="12">
          <form-picker v-model="data.docOn" disabled> </form-picker>
        </v-col>
        <v-col lg="3" :sm="isView ? 5 : 6" cols="12">
          <form-input v-model="data.docNumber" disabled> </form-input>
        </v-col>
        <v-col lg="3" cols="12" v-if="data.parentId && data.applicantPerson">
          <v-btn color="secondary" @click="showFamilies = true"> {{ $t("goSurveyParent") }} </v-btn>
        </v-col>
        <v-col lg="3" cols="12" class="justify-center" v-if="data && data.statusId && isView">
          <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" :color="getColor(data)">
            {{ data.status }}
          </v-chip>
        </v-col>
      </v-row>
    </ui-parent-card>

    <ui-parent-card class="mt-4">
      <v-row>
        <v-col cols="12" v-if="[1, 4].includes(data.invQuestionnaireTypeId) && !route.query.surveyDocId">
          <h2>{{ $t("headFamily") }}</h2>
        </v-col>
        <v-col cols="12" v-if="route.query.surveyDocId">
          <h2>{{ $t("secondaryHeadFamily") }}</h2>
        </v-col>
        <v-col cols="12" v-if="![1, 4].includes(data.invQuestionnaireTypeId)">
          <v-label class="font-weight-bold"> {{ data.applicantPerson?.fullName }} - {{ getActivePersonFromMembers?.kinshipDegree }} </v-label>
        </v-col>
        <v-col cols="12">
          <SetPassportData
            v-if="!isEdit && !isView && [1, 4].includes(data.invQuestionnaireTypeId)"
            @set-person="searchPerson"
            :search-lading="searchLading"
          >
          </SetPassportData>
          <UserInfo :person="data.applicantPerson"></UserInfo>

          <v-row v-if="[1, 4].includes(data.invQuestionnaireTypeId)">
            <v-col lg="3" md="6" cols="12">
              <PhoneNumberWithMobileCode
                :disabled="isView"
                v-model:model-value="data.applicantPhoneNumber"
                required
                :label="$t('phoneNumber')"
              ></PhoneNumberWithMobileCode>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" v-if="isAdditionalFamily">
          <v-label class="mb-2 font-weight-medium">{{ $t("memberType") }}</v-label>
          <v-select
            v-model="memberType"
            item-title="text"
            :items="memberTypeSelectList"
            :placeholder="$t('memberType')"
            @update:model-value="updateMemberType"
          >
          </v-select>
        </v-col>
      </v-row>
    </ui-parent-card>

    <v-expansion-panels>
      <v-expansion-panel class="mt-4" v-if="data.applicantPerson && members?.length && [1, 4].includes(data.invQuestionnaireTypeId)">
        <v-expansion-panel-title>
          <h4>
            {{
              $t("familyMembers", {
                count: members?.length || 0
              })
            }}
          </h4>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" v-if="familyMembersLoading" class="text-center">
              <v-progress-circular indeterminate></v-progress-circular>
            </v-col>
            <v-col cols="12" v-for="(item, index) in filteredInvSurveyMembers(1)" :key="index">
              <UserInfo
                v-if="item.person"
                :person="{
                  ...item.person,
                  kinshipDegree: item.person && item.person.kinshipDegree ? item.person.kinshipDegree : item.kinshipDegree || ''
                }"
              />
              <v-row>
                <v-col class="text-right" cols="12">
                  <MemberSurvey v-if="isEdit" :is-view="isView" v-model="filteredInvSurveyMembers(1)[index]" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <ui-parent-card
      class="mt-4"
      v-if="
        ((isEdit && !isView && data.applicantPerson && [1, 4].includes(data.invQuestionnaireTypeId)) ||
          (isView && !!filteredInvSurveyMembers(2).length && [1, 4].includes(data.invQuestionnaireTypeId))) &&
        !checkKinshipDegree &&
        data.canAddAdditionalFamily
      "
    >
      <h2 class="my-3">{{ $t("additionPersonFamily") }}</h2>
      <AddSurveyMembers v-if="!isView" :data="data" class="mb-4" />
      <v-row>
        <v-col cols="12" v-for="(item, index) in filteredInvSurveyMembers(2)" :key="index">
          <UserInfo :person="item.person" />
          <v-row>
            <v-col class="text-right" cols="12">
              <MemberSurvey v-if="isEdit" :is-view="isView" v-model="filteredInvSurveyMembers(2)[index]">
                <template #actions>
                  <v-btn
                    @click="deleteRow(filteredInvSurveyMembers(2)[index])"
                    :loading="removeLoading"
                    class="mr-2"
                    color="error"
                    variant="outlined"
                    v-bind="props"
                  >
                    {{ $t("deleteMember") }}
                  </v-btn>
                </template>
              </MemberSurvey>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </ui-parent-card>

    <QuestionnaireGroups
      v-if="![1].includes(data.invQuestionnaireTypeId) && !loading && !!data?.startAt"
      :data="data[GROUPS_KEY]"
      :algorithms="data[ALGORITHMS_KEY]"
      :end-at="data.endAt"
      :is-view="isView"
    />
  </div>
</template>
