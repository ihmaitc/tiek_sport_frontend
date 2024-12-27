import { CheckboxIcon, FileTextIcon } from "vue-tabler-icons";

export default [
  {
    title: "document",
    icon: FileTextIcon,
    visible: ["SurveyView"],
    isCollapse: true,
    children: [
      {
        title: "Survey",
        to: "/documents/Survey",
        visible: ["SurveyView"],
        icon: CheckboxIcon
      }
    ]
  }
];
