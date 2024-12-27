import { GlobeIcon, ReportIcon } from "vue-tabler-icons";

export default [
  {
    title: "Reports",
    icon: ReportIcon,
    visible: ["SurveyReportView", "SurveyReportViewByRegion", "SurveyReportViewByDistrict"],
    isCollapse: true,
    children: [
      {
        title: "GetSurveyReportByPublic",
        to: "/report/GetSurveyReportByPublic",
        visible: ["SurveyReportView", "SurveyReportViewByRegion", "SurveyReportViewByDistrict"],
        icon: GlobeIcon
      },
      {
        title: "LongRangeOperation",
        to: "/report/LongRangeOperation",
        visible: ["SurveyReportView", "SurveyReportViewByRegion", "SurveyReportViewByDistrict"],
        icon: GlobeIcon
      }
    ]
  }
];
