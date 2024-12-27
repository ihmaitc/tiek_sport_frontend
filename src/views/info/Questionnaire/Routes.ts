import { RouteRecordRaw } from "vue-router";

export const QuestionnaireRoutes: RouteRecordRaw[] = [
  {
    path: "/info/questionnaire",
    name: "Questionnaire",
    component: () => import("./index.vue"),
    meta: {
      pageTitle: "Questionnaire",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "Questionnaire",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/info/questionnaire/edit/:id",
    name: "EditQuestionnaire",
    component: () => import("./edit.vue"),
    meta: {
      pageTitle: "Questionnaire",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "Questionnaire",
          disabled: false,
          href: "/info/questionnaire"
        }
      ]
    }
  },
  {
    path: "/info/questionnaire/view/:id",
    name: "ViewQuestionnaire",
    component: () => import("./view.vue"),
    meta: {
      pageTitle: "Questionnaire",
      breadcrumbs: [
        {
          title: "Info",
          disabled: false,
          href: "#"
        },
        {
          title: "Questionnaire",
          disabled: false,
          href: "/info/questionnaire"
        }
      ]
    }
  }
];
