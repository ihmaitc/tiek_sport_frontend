<script setup lang="ts">
import { IFields } from "@/models/basic";
import { InvSurveyComparisionService } from "../service/InvSurveyComparision.service";
import { ref, toRefs } from "vue";
interface IProps {
  item: any;
  isSurvey?: boolean;
}
const props = defineProps<IProps>();
const emits = defineEmits(["close"]);
const { item, isSurvey } = toRefs(props);
const compareList = ref<any>(null);
const comment = ref<string>("");
const fields = ref<IFields[]>([
  { key: "questionText", label: "questionText", tdClass: "border", thClass: "border" },
  { key: "oldAnswer", label: "socialEmployeeAnswer", tdClass: "border", thClass: "border" },
  { key: "newAnswer", label: "inspectorAnswer", tdClass: "border", thClass: "border" }
]);
const addComment = () => {
  if (item.value.surveyId) {
    InvSurveyComparisionService.SetCommit({
      applicationPersonId: item.value?.applicationPersonId,
      comment: comment.value,
      surveyId: item.value.surveyId,
      isSurvey: isSurvey.value ?? false
    }).then((res) => {
      compareList.value = res.data.result;
      comment.value = res.data?.comment ?? "";
      emits("close");
    });
  }
};
const getCompare = () => {
  if (item.value.surveyId) {
    InvSurveyComparisionService.GetResut({
      surveyId: item.value.surveyId,
      isSurvey: isSurvey.value ?? false
    }).then((res) => {
      compareList.value = res.data.result;
      comment.value = res.data?.comment ?? "";
    });
  }
};
getCompare();
</script>

<template>
  <v-card elevation="0">
    <v-card-title>
      <h4>{{ $t("SurveyCompare") }}</h4>
    </v-card-title>
    <v-card-text class="px-1">
      <template v-if="compareList && compareList.length">
        <form-tab-row :items="compareList" :fields="fields" class="mb-4"> </form-tab-row>
        <form-input type="textarea" :label="$t('comment')" v-model="comment" />
      </template>
      <div v-else>
        <h3 class="text-center">
          {{ $t("compareNotFound") }}
        </h3>
      </div>
    </v-card-text>
    <v-card-actions class="justify-end px-1">
      <v-btn :text="$t('close')" color="error" variant="flat" @click="$emit('close')" />
      <v-btn :text="$t('addComment')" color="success" variant="flat" @click="addComment" />
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped></style>
