<script setup lang="ts">
import { ref, toRefs } from "vue";
import { GetAnswers, GetQuestions } from "../../types";
import { SurveyService } from "../../service/Survey.service";
import { ANSWERS_KEY } from "../../SurveyConstants";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { MinusIcon } from "vue-tabler-icons";

interface IProps {
  question: GetQuestions;
  answerIndex: number;
  answer: GetAnswers;
}

const props = defineProps<IProps>();
const { question, answer, answerIndex } = toRefs(props);

const { setError } = useErrorToast();
const loading = ref(false);

const deleteAnswer = () => {
  if (answer.value.id) {
    loading.value = true;
    SurveyService.RemoveAnswer(answer.value.id)
      .then(() => {
        question.value[ANSWERS_KEY].splice(answerIndex.value, 1);
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

<template>
  <v-btn
    v-if="question.invSurveyAnswers.length > 1"
    class="ml-2"
    variant="outlined"
    color="info"
    :icon="MinusIcon"
    :loading="loading"
    rounded
    size="small"
    @click="deleteAnswer"
  >
  </v-btn>
</template>

<style lang="scss" scoped></style>
