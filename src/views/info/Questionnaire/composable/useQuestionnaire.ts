import { QuestionnaireService } from "@/services/info/Questionnaire.service";

export default function QuestionnaireComposable() {
  const fetchGuid = async () => {
    const res = await QuestionnaireService.GetGuid();
    return await res.data;
  };

  return {
    fetchGuid
  };
}
