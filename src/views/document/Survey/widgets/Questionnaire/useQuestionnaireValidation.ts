import { useI18n } from "vue-i18n";
import { ANSWERS_KEY, GROUPS_KEY, QUESTIONS_KEY } from "../../SurveyConstants";
import { notify } from "@kyvg/vue3-notification";
import { GetSurvey } from "../../types";

export const useQuestionnaireValidation = () => {
  const { t } = useI18n();
  const wordPattern = /^\d+$/;
  const onlyNumberRules = [
    (value: any) => {
      if (!value) return t("fieldNotEmpty");
      if (value && wordPattern.test(value)) return true;
      return t("StringNotAssignToNumber");
    }
  ];

  const requiredRules = [
    (value: any) => {
      if (value) return true;
      return t("fieldNotEmpty");
    }
  ];

  const getFalseValues = (list: any[], key: string): boolean => {
    return list.some((el) => el[key] === true);
  };

  const checkAllQuestionsAnswered = ({ data, questionnaireTypeId }: { data: GetSurvey; questionnaireTypeId: number[] }) => {
    let flag = true; // Tracks if all required answers are completed
    let groupPromises: any[] = []; // To hold the promises for each group

    if (data && questionnaireTypeId.includes(data.invQuestionnaireTypeId)) {
      groupPromises = data[GROUPS_KEY].map((group, groupIndex) => {
        const questionPromises = group[QUESTIONS_KEY].map((question, questionIndex) => {
          let notifications = [];
          question.unAnswered = false;

          // Condition for non-answerTypeId 3
          if (question.answerTypeId !== 3 && question.isVisible && question.isRequired && !getFalseValues(question[ANSWERS_KEY], "isChecked")) {
            question.unAnswered = true;
            flag = false; // Set flag to false if a required answer is missing
            notifications.push(
              notify({
                text: t("requiredAnswer", {
                  questionText: question.questionText,
                  questionNumber: `${groupIndex + 1}. ${questionIndex + 1}`
                }),
                type: "warn"
              })
            );
          }

          // Condition for answerTypeId 3 (text answer)
          if (
            question.answerTypeId === 3 &&
            question.isRequired &&
            question.isVisible &&
            question[ANSWERS_KEY].some((el) => el.textAnswer?.length === 0)
          ) {
            flag = false; // Set flag to false if a required text answer is missing
            question.unAnswered = true;
            notifications.push(
              notify({
                text: t("requiredAnswer", {
                  questionText: question.questionText,
                  questionNumber: `${groupIndex + 1}. ${questionIndex + 1}`
                }),
                type: "warn"
              })
            );
          }

          return Promise.all(notifications); // Return the notifications promise for each question
        });

        return Promise.all(questionPromises); // Return the promises for each group
      });
    }

    if (!groupPromises.length) {
      return Promise.resolve("success"); // If no groups were processed, return a resolved promise
    }

    return Promise.all(groupPromises)
      .then(() => {
        if (!flag) {
          console.log("Some required answers are missing.");
        }
        return flag;
      })
      .catch((error) => {
        console.error("Error while checking required answers:", error);
      });
  };

  return {
    onlyNumberRules,
    requiredRules,
    checkAllQuestionsAnswered,
    getFalseValues
  };
};
