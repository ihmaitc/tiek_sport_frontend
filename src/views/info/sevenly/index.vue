<script setup lang="ts">
import { IFields, IFilter, ITableActions } from "@/models/basic";
import SevenlyService from "@/services/info/sevenly.service";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface ICustomFIlter extends IFilter {
  regionId: number | null;
  districtId: number | null;
}

const router = useRouter();

const permission = "Sector";
const routeName = "Sevenly";

const actions: ITableActions = {
  isDelete: true,
  isEdit: true
};

const filter = ref<ICustomFIlter>({
  page: 1,
  pageSize: 20,
  sortBy: "",
  search: "",
  orderType: "asc",
  totalRows: 0,
  districtId: null,
  regionId: null
});

const fields: IFields[] = [
  { key: "id", label: "id" },
  { key: "code", label: "code" },
  { key: "shortName", label: "shortName" },
  { key: "fullName", label: "fullName" },
  { key: "region", label: "region" },
  { key: "district", label: "district" },
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
    <form-table :fields="fields" :permission="permission" :router-name="routeName" :service="SevenlyService" append-action :filter="filter">
      <template #header="{ getData, refresh }">
        <form-table-header :permission="permission" @edit="edit" :filter="filter" @get-data="getData" @refresh="refresh"> </form-table-header>
      </template>
      <template #actions="{ item }">
        <form-table-actions @edit="edit" :actions="actions" :permission="permission" :item="item" :service="SevenlyService"> </form-table-actions>
      </template>
    </form-table>
  </ui-parent-card>
</template>
