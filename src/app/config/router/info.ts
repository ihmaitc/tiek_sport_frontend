import { QuestionAnswerTemplateRoutes } from "@/views/info/QuestionAnswerTemplate/Routes";
import { QuestionnaireRoutes } from "@/views/info/Questionnaire/Routes";

export default [
  ...QuestionAnswerTemplateRoutes,
  ...QuestionnaireRoutes,
  {
    path: "/info/sector",
    name: "Sector",
    component: () => import("@/views/info/sector/index.vue"),
    meta: {
      pageTitle: "sector",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "sector",
          active: true
        }
      ]
    }
  },

  {
    path: "/info/sector/edit/id=:id",
    name: "EditSector",
    component: () => import("@/views/info/sector/edit.vue"),
    meta: {
      pageTitle: "sector",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "sector",
          active: true
        }
      ]
    }
  },
  {
    path: "/info/mfy",
    name: "Mfy",
    component: () => import("@/views/info/mfy/index.vue"),
    meta: {
      pageTitle: "mfy",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "mfy",
          active: true
        }
      ]
    }
  },

  {
    path: "/info/mfy/edit/id=:id",
    name: "EditMfy",
    component: () => import("@/views/info/mfy/edit.vue"),
    meta: {
      pageTitle: "mfy",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "mfy",
          active: true
        }
      ]
    }
  },
  {
    path: "/info/mfy/view/id=:id",
    name: "ViewMfy",
    component: () => import("@/views/info/mfy/view.vue"),
    meta: {
      pageTitle: "mfy",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "mfy",
          active: true
        }
      ]
    }
  },
  {
    path: "/info/district",
    name: "District",
    component: () => import("@/views/info/district/index.vue"),
    meta: {
      pageTitle: "Region",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "Region",
          active: true
        }
      ]
    }
  },
  {
    path: "/info/district/edit/id=:id",
    name: "EditDistrict",
    component: () => import("@/views/info/district/edit.vue"),
    meta: {
      pageTitle: "district",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "district",
          active: true
        }
      ]
    }
  },
  {
    path: "/info/region",
    name: "Region",
    component: () => import("@/views/info/region/index.vue"),
    meta: {
      pageTitle: "Oblast",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "Oblast",
          active: true
        }
      ]
    }
  },
  {
    path: "/info/region/edit/id=:id",
    name: "EditRegion",
    component: () => import("@/views/info/region/edit.vue"),
    meta: {
      pageTitle: "region",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "region",
          active: true
        }
      ]
    }
  },

  {
    path: "/info/sevenly",
    name: "Sevenly",
    component: () => import("@/views/info/sevenly/index.vue"),
    meta: {
      pageTitle: "Sevenly",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "Sevenly",
          active: true
        }
      ]
    }
  },
  {
    path: "/info/sevenly/edit/:id",
    name: "EditSevenly",
    component: () => import("@/views/info/sevenly/edit.vue"),
    meta: {
      pageTitle: "Sevenly",
      breadcrumb: [
        {
          text: "Info"
        },
        {
          text: "Sevenly",
          active: true
        }
      ]
    }
  }
];
