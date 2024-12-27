<script setup lang="ts">
import { IFields, IFilter, ISelectList, ITableActions } from "@/models/basic";
import DistrictService from "@/services/info/district.service";
import MfyService from "@/services/info/mfy.service";
import RegionService from "@/services/info/region.service";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface ICustomFIlter extends IFilter {
  regionId: number | null;
  districtId: number | null;
}

const router = useRouter();

const permission = "Mfy";
const routeName = "Mfy";

const regionList = ref<ISelectList[]>([]);
const districtList = ref<ISelectList[]>([]);

const actions: ITableActions = {
  isDelete: true,
  isEdit: true,
  isView: true
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
    params: { id: item.id ? item.id : 0 }
  });
};
const view = (item: any) => router.push({ name: `View${routeName}`, params: { id: item.id ? item.id : 0 } });

const fetchRegions = () => {
  RegionService.GetAsSelectList().then((res) => {
    regionList.value = res.data;
  });
};
const fetchDistrict = (val: number | string) => {
  DistrictService.GetAsSelectList(val).then((res) => {
    districtList.value = res.data;
  });
};

fetchRegions();
</script>
<template>
  <ui-parent-card>
    <form-table :fields="fields" :permission="permission" :router-name="routeName" :service="MfyService" append-action :filter="filter">
      <template #header="{ getData, refresh }">
        <form-table-header :filter="filter" :permission="permission" @edit="edit" @get-data="getData" @refresh="refresh" has-menu :can-create="false">
          <template #menu-items>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <form-select :label="$t('region')" :list="regionList" v-model="filter.regionId" @update:model-value="fetchDistrict"></form-select>
                </v-col>
                <v-col cols="12">
                  <form-select :label="$t('district')" :list="districtList" v-model="filter.districtId"></form-select>
                </v-col>
              </v-row>
            </v-card-text>
          </template>
        </form-table-header>
      </template>
      <template #actions="{ item }">
        <form-table-actions @edit="edit" :actions="actions" :permission="permission" :item="item" @view="view"> </form-table-actions>
      </template>
    </form-table>
  </ui-parent-card>
</template>
