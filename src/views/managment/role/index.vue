<script setup lang="ts">
import { IFields, IFilter, ITableActions } from "@/models/basic";
import RoleService from "@/services/managment/role.service";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const permission = "Role";
const routeName = "Role";

const actions: ITableActions = {
  isEdit: true,
  isDelete: true
};

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
  { key: "shortName", label: "shortName" },
  { key: "isDefault", label: "isdefault" },
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
    <form-table :fields="fields" :permission="permission" :router-name="routeName" :service="RoleService" :filter="filter" append-action>
      <template #header="{ getData, refresh }">
        <form-table-header :permission="permission" :filter="filter" @get-data="getData" @refresh="refresh" @click="edit(0)"> </form-table-header>
      </template>
      <template #actions="{ item, refresh }">
        <form-table-actions :item="item" @edit="edit" :actions="actions" :permission="permission" @refresh="refresh" :service="RoleService">
        </form-table-actions>
      </template>
      <template #isDefault="{ item }">
        {{ item.isDefault ? $t("yes") : $t("no") }}
      </template>
    </form-table>
  </ui-parent-card>
</template>
