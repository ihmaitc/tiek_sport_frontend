<script setup lang="ts">
import { IFields, IFilter, ITableActions } from "@/models/basic";
import RegionService from "@/services/info/region.service";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const permission = "Region";
const routeName = "Region";

const actions: ITableActions = {
  isDelete: true,
  isEdit: true
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
  { key: "code", label: "code" },
  { key: "shortName", label: "shortName" },
  { key: "fullName", label: "fullName" },
  { key: "soato", label: "soato" },
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
    <form-table :fields="fields" :permission="permission" :router-name="routeName" :service="RegionService" append-action :filter="filter">
      <template #header="{ getData, refresh }">
        <form-table-header :filter="filter" :permission="permission" @edit="edit" @get-data="getData" @refresh="refresh"> </form-table-header>
      </template>
      <template #actions="{ item }">
        <form-table-actions @edit="edit" :actions="actions" :permission="permission" :item="item"> </form-table-actions>
      </template>
    </form-table>
  </ui-parent-card>
</template>
