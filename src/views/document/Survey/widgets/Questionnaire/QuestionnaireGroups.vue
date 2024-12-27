<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  GetAnswers,
  GetGroup,
  ISurveyConstrains,
  ISurveyTablesEqual,
  IUseQuestionnaireAlgorithm,
  IUseQuestionnaireAlgorithmTables
} from "../../types";
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import { GetQuestions } from "../../types";
import {
  ANSWERS_KEY,
  QUESTIONNAIRE_GROUP_DESCRIPTION,
  QUESTIONNAIRE_GROUP_ID_2,
  QUESTIONNAIRE_GROUP_TITLE,
  QUESTIONS_KEY,
  QUESTION_ANSWER_ID_2,
  QUESTION_ANSWER_ID_2_STR,
  QUESTION_QUESTION_ID_2,
  QUESTION_QUESTION_ID_2_STR
} from "../../SurveyConstants";
import { SurveyService } from "../../service/Survey.service";
import { PlusIcon } from "vue-tabler-icons";
import { useAuth } from "@/app/config/store/auth";
import DeleteAnswer from "./DeleteAnswer.vue";
import { useQuestionnaireValidation } from "./useQuestionnaireValidation";

interface IProps {
  isView?: boolean;
  data: GetGroup[];
  algorithms: IUseQuestionnaireAlgorithm[];
  endAt?: string | null;
}

const { makeGuid } = useGlobal();
const { user } = useAuth();
const { onlyNumberRules, requiredRules, getFalseValues } = useQuestionnaireValidation();

const pendingForms = new WeakMap();

const emits = defineEmits(["update:data"]);
const props = withDefaults(defineProps<IProps>(), {});

const groups = computed({
  get() {
    return props.data;
  },
  set(newValue) {
    emits("update:data", newValue);
  }
});

const algorithms = computed(() => props.algorithms);
const cachedAnswers = ref<string | null | undefined>(null);

const getVisibleQuestion = computed(() => (q: GetQuestions[]) => q.filter((e: GetQuestions) => e.isVisible));
const allQuestions = computed(() => groups.value.map((g) => g[QUESTIONS_KEY]).flat());

const getVisibleQuestions = computed(() => {
  let visibleCount = 0;

  if (groups.value) {
    for (let index = 0; index < groups.value.length; index++) {
      for (let j = 0; j < groups.value[index][QUESTIONS_KEY].length; j++) {
        const element = groups.value[index][QUESTIONS_KEY][j];

        if (element.answerTypeId == 3) {
          for (let k = 0; k < groups.value[index][QUESTIONS_KEY][j][ANSWERS_KEY].length; k++) {
            if (!groups.value[index][QUESTIONS_KEY][j][ANSWERS_KEY][k].textAnswer) {
              groups.value[index][QUESTIONS_KEY][j][ANSWERS_KEY][k].isChecked = false;
            }
          }
        }

        constraintAnswer(groups.value[index][QUESTIONS_KEY][j]);
      }
    }
  }

  return {
    groups: groups.value,
    visibleCount: visibleCount
  };
});

const answeredQuestionCount = computed(() => {
  let count = 0;
  let all = 0;
  let percentage = 0;

  if (getVisibleQuestions.value) {
    /* get all visible questions count */
    all = getVisibleQuestions.value.groups.reduce((acc, group) => {
      return acc + group[QUESTIONS_KEY].filter((q) => q.isVisible).length;
    }, 0);

    /* count answered questions count */
    count = allQuestions.value
      .map((q) => {
        const hasNonEmptyTextAnswer = q[ANSWERS_KEY].some((a) => a.textAnswer && String(a.textAnswer).length > 0);
        if (q.answerTypeId == 3) {
          return hasNonEmptyTextAnswer ? q : null;
        } else {
          return getFalseValues(q[ANSWERS_KEY], "isChecked");
        }
      })
      .filter((e) => e).length;

    percentage = (count / all) * 100;

    updateVisibleOfQuestion();
  }

  return {
    count: count,
    all: all,
    percentage: percentage
  };
});

const getQuestions = computed(() => {
  let list: GetGroup[] = [];
  if (groups.value) {
    list = groups.value;
    list.forEach((group) => {
      group[QUESTIONS_KEY].forEach((question) => {
        if (question.answerTypeId == 3 && question[ANSWERS_KEY].length === 0) {
          question[ANSWERS_KEY].push({
            textAnswer: "",
            id: 0,
            [QUESTION_ANSWER_ID_2]: makeGuid(),
            isDisabled: false,
            ball: 0,
            hasText: false
          });
        }
      });
    });
  }

  return list;
});

const checkHasText = (question: GetQuestions) => {
  if (!question)
    return {
      visible: false,
      index: null
    };

  let hasTextAnswerIndex = 0;
  const hasTextValue = question[ANSWERS_KEY].find((el) => el.hasText && el.isChecked);
  const visible = question[ANSWERS_KEY].some((el) => el.hasText && el.isChecked);
  if (hasTextValue) {
    hasTextAnswerIndex = question[ANSWERS_KEY].indexOf(hasTextValue);
  }

  return {
    visible: visible,
    index: hasTextAnswerIndex
  };
};

const changeRadioButton = (question: GetQuestions, answer: GetAnswers) => {
  const data = {
    ...question,
    isAnswered: true
  };

  if (question.answerTypeId === 1) {
    data[ANSWERS_KEY] = question[ANSWERS_KEY].map((el) => {
      if (el[QUESTION_ANSWER_ID_2] === answer[QUESTION_ANSWER_ID_2]) {
        el.isChecked = true;
      } else {
        el.isChecked = false;
      }
      return el;
    });
    //men tuzatdim shu joyini
    saveAnswer(data, question);
  } else if (question.answerTypeId === 2) {
    data[ANSWERS_KEY] = question[ANSWERS_KEY].map((el) => {
      if (el[QUESTION_ANSWER_ID_2] === answer[QUESTION_ANSWER_ID_2]) {
        el.isChecked = answer.isChecked;
      } else {
        el.isChecked ? (el.isChecked = true) : (el.isChecked = false);
      }
      return el;
    });
    saveAnswer(data, question);
  } else if (question.answerTypeId == 3) {
    data[ANSWERS_KEY] = question[ANSWERS_KEY].map((el) => {
      if (el[QUESTION_ANSWER_ID_2] === answer[QUESTION_ANSWER_ID_2]) {
        if (question.isNumber && el.textAnswer) {
          el.textAnswer = el.textAnswer.replace(/\D+/g, "");
        }
      }
      return el;
    });
  }
};

const saveAnswer = (data: any, question: GetQuestions) => {
  const previousController = pendingForms.get(data);
  if (previousController) {
    previousController.abort();
  }

  const controller = new AbortController();
  pendingForms.set(data, controller);

  SurveyService.SaveAnswers(data, {
    signal: controller.signal
  }).then((res) => {
    for (let index = 0; index < groups.value.length; index++) {
      for (let j = 0; j < groups.value[index][QUESTIONS_KEY].length; j++) {
        const element = groups.value[index][QUESTIONS_KEY][j];
        if (element[QUESTION_QUESTION_ID_2] == question[QUESTION_QUESTION_ID_2]) {
          groups.value[index][QUESTIONS_KEY][j] = res.data;
        }
      }
    }
  });
};

const addAnswer = (group: GetGroup, question: GetQuestions) => {
  for (let index = 0; index < groups.value.length; index++) {
    if (group[QUESTIONNAIRE_GROUP_ID_2] == groups.value[index][QUESTIONNAIRE_GROUP_ID_2]) {
      for (let j = 0; j < groups.value[index][QUESTIONS_KEY].length; j++) {
        const element = groups.value[index][QUESTIONS_KEY][j];

        if (element[QUESTION_QUESTION_ID_2] == question[QUESTION_QUESTION_ID_2]) {
          groups.value[index][QUESTIONS_KEY][j][ANSWERS_KEY].push({
            textAnswer: "",
            id: 0,
            [QUESTION_ANSWER_ID_2]: makeGuid(),
            isDisabled: false,
            ball: 0,
            hasText: false
          });

          saveAnswer(groups.value[index][QUESTIONS_KEY][j], question);
        }
      }
    }
  }
};

const onFocus = (answer: GetAnswers) => {
  cachedAnswers.value = answer.textAnswer;
};

const onBlur = (question: GetQuestions, answer: GetAnswers) => {
  if (cachedAnswers.value == answer.textAnswer) return;

  cachedAnswers.value = null;

  const data = {
    ...question,
    isAnswered: true
  };

  saveAnswer(data, question);
};

/* Conditions */
const resetHiddenAnswers = (question: GetQuestions) => {
  question[ANSWERS_KEY].forEach((a) => {
    a.isChecked = false;
  });
};

function Any<T>(array: T[], x: (e: T) => boolean) {
  return array.some((el) => x(el));
}

function All<T>(array: T[], x: (e: T) => boolean) {
  return array.every((el) => x(el));
}

const answerIsAny = (el: IUseQuestionnaireAlgorithm) => {
  return (el.isAny ? Any : All)<IUseQuestionnaireAlgorithmTables>(el.tables, (t) => {
    const q = allQuestions.value.find((x) => x[QUESTION_QUESTION_ID_2] === t[QUESTION_QUESTION_ID_2_STR]);
    const a = q?.[ANSWERS_KEY].find((a2) => a2[QUESTION_ANSWER_ID_2] === t[QUESTION_ANSWER_ID_2_STR]);
    return a?.isChecked === t.isEqual;
  });
};

const updateVisibleOfQuestion = () => {
  const matchingAlgorithms = algorithms.value.filter((algorithm) => {
    return allQuestions.value.some((q) => q[QUESTION_QUESTION_ID_2] == algorithm[QUESTION_QUESTION_ID_2_STR]);
  });

  matchingAlgorithms.forEach((a) => {
    /* qaysi savolning isVisible polyasi o'zgarishi keraligini topib olamiza */
    const question = allQuestions.value.find((q) => a[QUESTION_QUESTION_ID_2_STR] == q[QUESTION_QUESTION_ID_2]);

    /* qaysi savolning isVisible polyasi o'zgarishi kerakligining gruppa index va question index topib olish */
    const groupIndex = groups.value.findIndex((g) => g[QUESTIONS_KEY].some((q) => q[QUESTION_QUESTION_ID_2] == question?.[QUESTION_QUESTION_ID_2]));
    const qIndex = groups.value[groupIndex]?.[QUESTIONS_KEY].findIndex((q) => q[QUESTION_QUESTION_ID_2] == question?.[QUESTION_QUESTION_ID_2]);

    /* tekshirish kerak sovol bormi yoki yo'qligini */
    if (groups.value[groupIndex][QUESTIONS_KEY][qIndex]) {
      groups.value[groupIndex][QUESTIONS_KEY][qIndex].isVisible = answerIsAny(a);
    }

    /* agar algorithmdegi savolni ko'rsatib va uni qiymatini o'zgartirgandan kgn sovolni yana bekitib qo'ysa shu sovolning qiymatini o'chirib tashlash */
    if (!answerIsAny(a) && question) {
      resetHiddenAnswers(question);
    }
  });
};

// CONSTRAINT
const resetDisabledAnswers = (answers: GetAnswers[]) => {
  answers.forEach((el) => {
    el.isDisabled = false;
  });
};

const checkSelectedTables = (constraint: ISurveyConstrains, answers: GetAnswers[]) => {
  /* Find answers exists in array selected Tables of constraint */
  const isDisabled = constraint.selectedTables.some((el) =>
    answers.some((answer) => el[QUESTION_ANSWER_ID_2_STR] === answer[QUESTION_ANSWER_ID_2] && answer.isChecked === el.isEqual)
  );
  /* If we have exiting answers update value */
  if (isDisabled) {
    updateAnswers(constraint.conditionedTables, answers);
  }
};

const updateAnswers = (conditionedTables: ISurveyTablesEqual[], answers: GetAnswers[]) => {
  answers.forEach((el) => {
    if (conditionedTables.some((c) => c[QUESTION_ANSWER_ID_2_STR] === el[QUESTION_ANSWER_ID_2])) {
      el.isDisabled = true;
      el.isChecked = false;
    }
  });
};

const existAllAnswers = (constraint: ISurveyConstrains, answers: GetAnswers[]) => {
  // 1. Found ids of answers in selected table
  const selectedTableIds = constraint.selectedTables.map((el) => el[QUESTION_ANSWER_ID_2_STR]);
  // 2. Found answers exiting in selectedTableIds && check item of  returned array to id and isEqual
  const exitingAnswers = constraint.selectedTables.every(
    (el) =>
      answers
        .filter((answer) => selectedTableIds.includes(answer[QUESTION_ANSWER_ID_2]))
        .filter((answer1) => answer1[QUESTION_ANSWER_ID_2] == el[QUESTION_ANSWER_ID_2_STR] && answer1.isChecked == el.isEqual).length > 0
  );

  /* 3. If we have exitingAnswers update answers value */
  if (exitingAnswers) {
    updateAnswers(constraint.conditionedTables, answers);
  }
};

const constraintAnswer = (question: GetQuestions) => {
  /* reset all disabled answers in first step */
  resetDisabledAnswers(question[ANSWERS_KEY]);
  /* ITERATE ALL CONSTRAINTS */
  question.constraints.forEach((constraint) => {
    if (constraint.isAny) {
      /* Find answers exists in array selected Tables of constraint */
      checkSelectedTables(constraint, question[ANSWERS_KEY]);
    } else {
      /* Exists all answers  */
      existAllAnswers(constraint, question[ANSWERS_KEY]);
    }
  });
};

/* FOR PROGRAMMERS */
const includedUsers: string[] = ["998123456780"];

const setAnswerForProgrammers = () => {
  if (groups.value && user?.userName) {
    if (includedUsers.includes(user.userName)) {
      groups.value.forEach((group) => {
        group[QUESTIONS_KEY].forEach((question) => {
          if (question.answerTypeId == 3) {
            question[ANSWERS_KEY].forEach((answer) => {
              if (question.isNumber) {
                answer.textAnswer = "123";
              } else {
                answer.textAnswer = "DBCLICK";
              }
            });
          } else {
            question[ANSWERS_KEY][0].isChecked = true;
          }

          saveAnswer(question, question);
        });
      });
    }
  }
};

onMounted(() => {
  window.addEventListener("dblclick", setAnswerForProgrammers);
});
</script>

<template>
  <div class="page-scroll mt-4" v-if="groups">
    <!-- COUNTERS -->
    <v-toolbar style="position: sticky; top: 0; z-index: 1005" flat rounded="10">
      <div class="d-flex flex-wrap justify-space-between align-center px-5 w-100" style="">
        <div>
          <h5
            style="width: max-content"
            :class="[
              {
                'text-success': answeredQuestionCount.percentage === 100,
                'text-warning': answeredQuestionCount.percentage < 100 && answeredQuestionCount.percentage >= 50,
                'text-error': answeredQuestionCount.percentage < 50
              }
            ]"
          >
            <v-label class="mb-2"> {{ $t("answeredQuestionsCount") }} </v-label> : {{ answeredQuestionCount.count }} /
            {{ answeredQuestionCount.all }}
          </h5>
        </div>
      </div>
    </v-toolbar>
    <!-- QUESTIONS -->
    <UiParentCard class="mt-4" v-for="(group, groupIndex) in getQuestions">
      <div class="mb-4">
        <h2 class="text-center">{{ group[QUESTIONNAIRE_GROUP_TITLE] }}</h2>
        <p class="text-center font-italic font-weight-semibold my-4">{{ group[QUESTIONNAIRE_GROUP_DESCRIPTION] }}</p>
      </div>
      <v-label :text="`${groupIndex + 1}. ${group.title}`" />
      <template v-for="(question, questionIndex) in getVisibleQuestion(group[QUESTIONS_KEY])">
        <v-card class="mt-4" elevation="0">
          <v-card-title :class="{ 'text-error': question.unAnswered }">
            {{ groupIndex + 1 }}.{{ questionIndex + 1 }}
            <span class="mr-1">.</span>
            {{ question.questionText }}
            <span class="text-error" v-if="question.isRequired"> * </span>
          </v-card-title>
          <v-card-subtitle v-if="question?.hint">
            <details class="ml-5" v-if="question?.hint">
              <summary>
                <span class="font-weight-bold">{{ $t("hint") }}</span>
              </summary>
              {{ question.hint }}
            </details>
          </v-card-subtitle>

          <v-card-text class="ml-4">
            <div v-for="(answer, answerIndex) in question[ANSWERS_KEY]" :key="answerIndex">
              <label class="mt-2 d-flex align-center cursor-pointer" v-if="question.answerTypeId == 1">
                <input
                  type="radio"
                  :name="String(question.questionText + question[QUESTION_QUESTION_ID_2])"
                  :value="answer[QUESTION_ANSWER_ID_2]"
                  class="mr-2"
                  :disabled="isView"
                  :checked="answer.isChecked"
                  @change="changeRadioButton(question, answer)"
                />
                {{ answer.answerText }}
              </label>
              <form-checkbox
                class="mt-n4"
                v-if="question.answerTypeId == 2"
                v-model="answer.isChecked"
                :disabled="isView || answer.isDisabled"
                :id="answer[QUESTION_ANSWER_ID_2]"
                :label="answer.answerText"
                @update:model-value="changeRadioButton(question, answer)"
              >
              </form-checkbox>

              <form-input
                v-if="question.answerTypeId == 3"
                :rules="question.isNumber ? onlyNumberRules : question.isRequired ? requiredRules : []"
                v-model="answer.textAnswer"
                validate-on="input lazy"
                :required="question.isRequired"
                :can-add-zero="true"
                :min="question.minLenght"
                :min-value="question.minValue"
                :max="question.maxLenght"
                :max-value="question.maxValue"
                @update:model-value="changeRadioButton(question, answer)"
                @blur="onBlur(question, answer)"
                @focus="onFocus(answer)"
                :disabled="isView"
                :label="$t('answerText')"
              >
                <template #append>
                  <v-btn variant="outlined" color="info" :icon="PlusIcon" rounded size="small" @click="addAnswer(group, question)"> </v-btn>
                  <DeleteAnswer :question="question" :answer="answer" :answer-index="answerIndex" />
                </template>
              </form-input>

              <form-input
                v-if="checkHasText(question).visible && checkHasText(question).index == answerIndex"
                v-model="answer.textAnswer"
                :disabled="isView"
                :max="question.maxLenght"
                :min="question.minLenght"
                :max-value="question.maxValue"
                :min-value="question.minValue"
                :can-add-zero="true"
                :label="$t('comment')"
                @blur="changeRadioButton(question, answer)"
              ></form-input>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </UiParentCard>

    <slot></slot>
  </div>
</template>
<style scoped>
.v-card-subtitle {
  white-space: inherit;
  word-break: break-word;
}
</style>
