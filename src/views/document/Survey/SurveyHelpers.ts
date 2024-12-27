import ApiService from "@/services/api.service";
import { SurveyService } from "./service/Survey.service";
import { GetSurvey } from "./types";
import { useErrorToast } from "@/utils/helpers/useErrorToast";

const { setError } = useErrorToast();

let familyPromises = [];

export async function CreateSurveyMember(res: GetSurvey) {
  familyPromises = res.invSurveyMembers
    .map(async (f) => {
      if (!f.surveyId && f.id) {
        const getmember = SurveyService.GetBySurveyMemberId(f.id).then(async (res1) => {
          const post = ApiService.post("/InvSurvey/Create", res1.data)
            .then((res2) => res2.data)
            .catch((e) => {
              setError(e);
              return null;
            });

          return await post;
        });
        const getRes = await Promise.resolve(getmember);
        return getRes;
      }
      if (f.surveyId) {
        return Promise.resolve(null);
      }
    })
    .filter((e) => e);

  const promiseResolve = (await Promise.all(familyPromises)).filter((e) => e);

  return promiseResolve;
}
