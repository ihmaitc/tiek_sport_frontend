import { BuildingBankIcon, CircleDotIcon, SettingsIcon, UserIcon } from "vue-tabler-icons";

export default [
  {
    title: "Management",
    icon: SettingsIcon,
    visible: ["OrganizationView", "UserView", "RoleView", "AppErrorView"],
    isCollapse: true,
    children: [
      {
        title: "Organization",
        to: "/managment/organization",
        visible: "OrganizationView",
        icon: BuildingBankIcon
      },
      {
        title: "User",
        to: "/managment/user",
        visible: "UserView",
        icon: UserIcon
      },
      {
        title: "role",
        to: "/managment/role",
        visible: "RoleView",
        icon: CircleDotIcon
      },
      // {
      //   title: "AppError",
      //   to: "/managment/app-error",
      //   visible: "AppErrorView",
        
      // }
    ]
  }
];
