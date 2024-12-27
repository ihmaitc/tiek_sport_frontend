import { CircleDotIcon, InfoCircleIcon, ListIcon, QuestionMarkIcon } from "vue-tabler-icons";

export default [
  {
    title: "Info",
    icon: InfoCircleIcon,
    visible: ["InvQuestionAnswerTemplateView", "QuestionnaireView", "SectorView", "MfyView", "RegionView", "DistrictView"],
    isCollapse: true,
    children: [
      {
        title: "QuestionAnswerTemplate",
        to: "/info/QuestionAnswerTemplate",
        visible: "InvQuestionAnswerTemplateView",
        icon: ListIcon
      },
      {
        title: "Questionnaire",
        to: "/info/Questionnaire",
        visible: "QuestionnaireView",
        icon: QuestionMarkIcon
      },
      {
        title: "Sector",
        to: "/info/Sector",
        visible: "SectorView",
        icon: CircleDotIcon
      },
      {
        title: "Mfy",
        to: "/info/Mfy",
        visible: "MfyView",
        icon: CircleDotIcon
      },
      {
        title: "region",
        to: "/info/region",
        visible: "RegionView",
        icon: CircleDotIcon
      },
      {
        title: "district",
        to: "/info/District",
        visible: "DistrictView",
        icon: CircleDotIcon
      },
      {
        title: "Sevenly",
        to: "/info/sevenly",
        visible: "SevenlyView",
        icon: CircleDotIcon
      }
    ]
  }
];
