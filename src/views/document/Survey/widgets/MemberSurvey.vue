<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { invSurveyMembers } from "../types";
import { useRoute, useRouter } from "vue-router";
import { useSurvey } from "../store/useSurvey";
import SurveyComparision from "./SurveyComparision.vue";

interface IProps {
  modelValue: invSurveyMembers;
  isView?: boolean;
}

const props = defineProps<IProps>();

const { modelValue } = toRefs(props);
const emits = defineEmits(["update:modelValue"]);
const router = useRouter();
const route = useRoute();
const store = useSurvey();

const model = computed({
  get() {
    return modelValue.value;
  },
  set(newValue) {
    emits("update:modelValue", newValue);
  }
});

const loading = ref(false);
const saveLoading = ref(false);
const isModal = ref(false);
const refresh = (id: number) => {
  store.$reset();
  loading.value = true;
  setTimeout(() => {
    store.refresh({
      returnId: id,
      query: route.query
    });
  }, 400);
};

const goSurvey = () => {
  if (model.value.surveyId) {
    router.push({
      query: {
        ...route.query,
        surveyId: model.value.surveyId
      }
    });

    refresh(model.value.surveyId);
  }
};
</script>
<template>
  <slot v-if="model?.id && !isView" name="actions"></slot>
  <v-dialog v-model="isModal">
    <template #activator="{ props }">
      <v-btn v-if="store?.getData?.canCompareGetResult" color="info" variant="outlined" class="mr-3" v-bind="props">
        {{ $t("SurveyCompare") }}
      </v-btn>
    </template>
    <SurveyComparision class="pa-4" :item="{ surveyId: model.surveyId, applicationPersonId: model?.person?.id }" @close="isModal = false" />
  </v-dialog>
  <v-btn v-if="model?.surveyId" @click="goSurvey" color="info" variant="outlined" v-bind="props" :loading="saveLoading || loading">
    {{ $t("goSurvey") }}
  </v-btn>
</template>
