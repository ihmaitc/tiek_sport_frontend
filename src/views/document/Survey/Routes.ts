import { RouteRecordRaw } from "vue-router";

export const SurveyRoutes: RouteRecordRaw[] = [
  {
    path: "/documents/Survey",
    name: "Survey",
    component: () => import("./SurveyIndex.vue"),
    meta: {
      pageTitle: "Survey",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "Survey",
          disabled: true,
          href: "#"
        }
      ]
    }
  },
  {
    path: "/documents/Survey/edit/:id",
    name: "EditSurvey",
    component: () => import("./SurveyEdit.vue"),
    meta: {
      pageTitle: "Survey",
      stopReloading: true,
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "Survey",
          disabled: false,
          href: "/documents/Survey"
        }
      ]
    }
  },
  {
    path: "/documents/Survey/view/:id",
    name: "ViewSurvey",
    component: () => import("./ViewQuestions.vue"),
    meta: {
      pageTitle: "Survey",
      breadcrumbs: [
        {
          title: "Document",
          disabled: false,
          href: "#"
        },
        {
          title: "Survey",
          disabled: false,
          href: "/documents/Survey"
        }
      ]
    }
  }
];
