<script setup lang="ts">
import { IFields, IFilter } from "@/models/basic";
import UserService from "@/services/managment/user.service";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const permission = "User";
const routeName = "User";

const filter: IFilter = reactive({
  page: 1,
  pageSize: 20,
  sortBy: "",
  search: "",
  orderType: "asc",
  totalRows: 0
});

const fields: IFields[] = [
  { key: "id", label: "id" },
  { key: "userName", label: "userName" },
  { key: "fullName", label: "fullName" },
  { key: "pinfl", label: "pinfl" },
  { key: "region", label: "region" },
  { key: "district", label: "district" },
  { key: "organizationInn", label: "organizationInn" },
  { key: "roles", label: "role" },
  { key: "state", label: "status" }
];

const edit = (item: any) => {
  router.push({
    name: `Edit${routeName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};
</script>
<template>
  <ui-parent-card>
    <filter-page :filter="filter">
      <form-table append-action :fields="fields" :permission="permission" :router-name="routeName" :service="UserService" :filter="filter">
        <template #header="{ getData, refresh }">
          <form-table-header :permission="permission" @edit="edit(0)" :filter="filter" @get-data="getData" @refresh="refresh"> </form-table-header>
        </template>
        <template #actions="{ getData, refresh, item }">
          <form-table-actions
            :actions="{
              isEdit: true
            }"
            :permission="permission"
            :item="item"
            @get-data="getData"
            @refresh="refresh"
            @edit="edit"
          >
          </form-table-actions>
        </template>
      </form-table>
    </filter-page>
  </ui-parent-card>
</template>
