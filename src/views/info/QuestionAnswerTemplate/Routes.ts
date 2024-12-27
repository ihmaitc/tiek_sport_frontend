import { RouteRecordRaw } from "vue-router";

export const QuestionAnswerTemplateRoutes: RouteRecordRaw[] = [
  {
    path: "/info/QuestionAnswerTemplate",
    name: "QuestionAnswerTemplate",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "QuestionAnswerTemplate",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "QuestionAnswerTemplate",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/info/QuestionAnswerTemplate/edit/:id",
    name: "EditQuestionAnswerTemplate",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "QuestionAnswerTemplate",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "QuestionAnswerTemplate",
          disabled: false,
          href: "/info/QuestionAnswerTemplate"
        }
      ]
    }
  }
];
