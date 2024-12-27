<script setup lang="ts">
import i18n from "@/app/config/i18n";
import FormPhoneNumber from "@/components/form/FormPhoneNumber.vue";
import SetPassportData from "@/components/UserInfo/SetPassportData.vue";
import { ISetPassportData } from "@/components/UserInfo/types";
import { ISelectList } from "@/models/basic";
import DistrictService from "@/services/info/district.service";
import RegionService from "@/services/info/region.service";
import OrganizationService from "@/services/managment/organization.service";
import RoleService from "@/services/managment/role.service";
import UserService from "@/services/managment/user.service";
import UserTypeService from "@/services/managment/usertype.service";
import AccountService from "@/services/others/account.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify";

const { setError } = useErrorToast();
const route = useRoute();
const router = useRouter();

const data = ref<any>();

const saveLoading = ref(false);
const searchLading = ref(false);
const OrganizationList = ref<ISelectList[]>([]);
const RoleList = ref<ISelectList[]>([]);
const userTypeList = ref<ISelectList[]>([]);
const regionsList = ref<ISelectList[]>([]);
const districtList = ref<ISelectList[]>([]);

const id = route.params.id as string;

const get = () => {
  UserService.Get(id).then((res) => {
    data.value = res.data;

    if (data.value.regionId) {
      changeRegion(data.value.regionId);
    }
  });
};

const save = async (values: SubmitEventPromise) => {
  const { valid, errors } = await values;
  if (errors && errors.length > 0) {
    document.getElementById(String(errors[0].id))?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });
  }

  if (valid) {
    saveLoading.value = true;
    UserService.Update({ ...data.value, userName: data.value.phoneNumber })
      .then(() => {
        notify({
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });
        router.push({ name: "User" });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

const searchPerson = (values: ISetPassportData) => {
  if (values) {
    searchLading.value = true;
    AccountService.GetByPassportData(String(values.seria?.toUpperCase()), String(values.number), String(values.dateOfBirth))
      .then((res) => {
        if (data.value) {
          data.value.person = res.data;
        }
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        searchLading.value = false;
      });
  }
};

const fetchOrganizations = () => {
  OrganizationService.GetAsSelectList().then((res) => {
    OrganizationList.value = res.data;
  });
};

const fetchRoles = () => {
  RoleService.GetAsSelectList().then((res) => {
    RoleList.value = res.data;
  });
};

const fetchUserType = () => {
  UserTypeService.GetAsSelectList().then((res) => {
    userTypeList.value = res.data;
  });
};

const fetchRegions = () => {
  RegionService.GetAsSelectList().then((res) => {
    regionsList.value = res.data;
  });
};

function changeRegion(id: number | string) {
  DistrictService.GetAsSelectList(id).then((res) => {
    districtList.value = res.data;
  });
}

get();
fetchOrganizations();
fetchRoles();
fetchUserType();
fetchRegions();
</script>
<template>
  <v-form @submit.prevent="save" v-if="data">
    <ui-parent-card>
      <SetPassportData @set-person="searchPerson" :search-lading="searchLading"> </SetPassportData>

      <user-info v-if="data.person && data.person?.fullName" :person="data.person"></user-info>
    </ui-parent-card>

    <ui-parent-card class="mt-4">
      <v-row>
        <v-col lg="4" cols="12">
          <form-input v-model="data.email" :label="$t('email')"></form-input>
        </v-col>
        <v-col lg="4" cols="12">
          <form-input v-model="data.email" :label="$t('Organization')"></form-input>
        </v-col>
        <v-col lg="4" cols="12">
          <FormPhoneNumber v-model="data.phoneNumber" required :label="$t('phoneNumber')"></FormPhoneNumber>
        </v-col>
        <v-col lg="4" cols="12">
          <form-input v-model="data.password" :label="$t('password')" type="password" autocomplete="new-password"></form-input>
        </v-col>
        <v-col lg="4" cols="12">
          <form-select :list="RoleList" v-model="data.roles" :label="$t('role')" multiple :disabled="!data.canEditRole"></form-select>
        </v-col>
        <v-col lg="4" cols="12">
          <form-select :list="userTypeList" v-model="data.userTypeId" :label="$t('userType')"></form-select>
        </v-col>
        <v-col lg="4" cols="12">
          <form-select :list="regionsList" v-model="data.regionId" :label="$t('region')" @update:model-value="changeRegion"></form-select>
        </v-col>
        <v-col lg="4" cols="12">
          <form-select :list="districtList" v-model="data.districtId" :label="$t('district')"></form-select>
        </v-col>
      </v-row>
    </ui-parent-card>

    <v-row class="mt-3 px-3">
      <v-btn color="error" variant="flat" @click="router.back()" :text="$t('Back')" />
      <v-spacer />
      <v-btn color="success" :loading="saveLoading" variant="flat" type="submit" :text="$t('Save')" />
    </v-row>
  </v-form>
</template>
