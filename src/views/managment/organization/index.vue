<script setup lang="ts">
import { IFields, IFilter } from "@/models/basic";
import OrganizationService from "@/services/managment/organization.service";
import { reactive } from "vue";

const permission = "Organization";
const routeName = "Organization";

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
  { key: "inn", label: "inn" },
  { key: "region", label: "region" },
  { key: "district", label: "district" },
  { key: "state", label: "status" }
];

</script>
<template>
  <ui-parent-card>
    <form-table :fields="fields" :permission="permission" :router-name="routeName" :service="OrganizationService" :filter="filter">
      <template #header="{ getData, refresh }">
        <form-table-header :filter="filter" @get-data="getData" @refresh="refresh"> </form-table-header>
      </template>
    </form-table>
  </ui-parent-card>
</template>
