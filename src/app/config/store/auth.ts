import { defineStore } from "pinia";

export interface ILogin {
  phoneNumber: string;
  requestId: string;
  requiredPhoneNumber: boolean;
  secretKey: string;
  token: string;
  trusteDevie: boolean;
  user: IUser;
}

export interface IUser {
  districtId: number | null;
  email: string | null;
  fullName: string | null;
  id: number | null;
  inn: string | null;
  language: string | null;
  languageId: number | null;
  modules: string[];
  roles: string[];
  organization: string | null;
  parentOrganization: string | null;
  organizationId: number | null;
  parentOrganizationId: number | null;
  stateId: number | null;
  regionId: number | null;
  phoneNumber: string | null;
  pinfl: string | null;
  position: string | null;
  shortName: string | null;
  userName: string | null;
}

const getParsed = () => {
  let obj: any = null;
  try {
    let p: string | null = localStorage.getItem("user_info");
    if (p != null) {
      obj = JSON.parse(p) || null;
    }
  } catch {
    Object.assign(obj, null);
  }

  return obj;
};

export const useAuth = defineStore("auth", {
  state: () => ({
    permissions: (getParsed()?.modules || []) as string[],
    user: (getParsed() || null) as IUser | null
  }),
  actions: {
    LogIn(data: ILogin) {
      this.user = data?.user;
      this.permissions = data.user.modules || [];
    },
    LogOut() {
      this.user = null;
      this.permissions = [];
    },
    can(item: string) {
      if (this.permissions && this.permissions.includes(item)) {
        return true;
      }
      return false;
    }
  }
});
