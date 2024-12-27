<script setup lang="ts">
import { useGlobal } from "@/composables/useGlobal";
import { ITable } from "@/models/vuetify/types";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import axios from "axios";
import { onMounted } from "vue";
import { nextTick, watch } from "vue";
import { ref, computed } from "vue";
import { ArrowDownIcon, ArrowUpIcon } from "vue-tabler-icons";

const props = withDefaults(defineProps<ITable>(), {
  permission: "",
  hasPagination: true,
  apiName: "GetList",
  tableHeight: "540",
  resData: "rows",
  density: "compact",
  fixedHeader: true,
  identifier: true,
  removeKeys: () => [],
  params: {}
});

const emits = defineEmits(["createRouteQuery", "rowClick", "rowDblClick"]);
const { parseNumber, getColor,getStateColor } = useGlobal();

const data = ref<any[]>([]);
const allData = ref<any>();
const { setError } = useErrorToast();

const loading = ref<boolean>(true);

const firstNumber = computed(() => {
  if (props.filter) {
    return (props.filter.page - 1) * props.filter.pageSize + 1;
  }
  return 0;
});

const lastNumber = computed(() => {
  if (props.filter) {
    if (props.filter.totalRows < props.filter.pageSize) {
      return props.filter.totalRows;
    } else {
      if (props.filter.page * props.filter.pageSize > props.filter.totalRows) {
        return props.filter.totalRows;
      } else {
        return props.filter.page * props.filter.pageSize;
      }
    }
  }
  return 0;
});

const getData = async () => {
  loading.value = true;
  emits("createRouteQuery", {
    filter: props.filter,
    params: props.params,
    removeKeys: props.removeKeys
  });
  await nextTick();
  try {
    props.service[props.apiName](props.filter)
      .then((res: any) => {
        allData.value = res.data;
        if (props.resData.length > 0) {
          data.value = res.data[props.resData];
        } else {
          data.value = res.data;
        }
        props.filter.totalRows = res.data.total;
        loading.value = false;
      })
      .catch((error: any) => {
        if (axios.isCancel(error)) {
          loading.value = true;
          return;
        }
        setError(error);
        loading.value = false;
      });
  } catch (e) {
    throw new Error(`что то пошло не так, подробности: ${e}`);
  }
};

const refresh = () => {
  loading.value = true;
  try {
    // props.filter.page = 1;
    emits("createRouteQuery", {
      filter: props.filter,
      params: props.params,
      removeKeys: props.removeKeys
    });
    data.value = [];
    props.service[props.apiName](props.filter)
      .then((res: any) => {
        if (props.resData.length > 0) {
          data.value = res.data[props.resData];
        } else {
          data.value = res.data;
        }
        props.filter.totalRows = res.data.total;
        loading.value = false;
      })
      .catch((error: any) => {
        if (axios.isCancel(error)) {
          loading.value = true;
          return;
        }
        setError(error);
        loading.value = false;
      });
  } catch (e) {
    throw new Error(`что то пошло не так, подробности: ${e}`);
  }
};

const sort = (item: any) => {
  if (props.filter) {
    props.filter.sortBy = item.key;
    if (props.filter.orderType == "asc") {
      props.filter.orderType = "desc";
    } else {
      props.filter.orderType = "asc";
    }
    refresh();
  }
};

defineExpose({
  refresh,
  sort,
  getData
});

watch(
  () => props.manualRefresh,
  () => {
    refresh();
  }
);
watch(
  () => props.identifier,
  (val) => {
    if (val) {
      refresh();
    }
  }
);

onMounted(() => {
  if (props.identifier) {
    getData();
  } else {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <slot name="header" :refresh="refresh" :getData="getData" :loading="loading" :parseNumber="parseNumber" :data="allData"> </slot>
    <v-card class="border" elevation="0">
      <v-table
        class="month-table"
        :height="tableHeight"
        :density="density"
        :fixed-header="fixedHeader"
        :fixed-footer="fixedFooter"
        :class="tableClass"
        :hover="hover"
        :ref="tableRef"
      >
        <thead class="text-center">
          <tr>
            <th class="font-weight-bold text-center" v-if="prependAction">
              <v-label>{{ $t("actions") }}</v-label>
            </th>
            <template v-for="(field, index) in fields">
              <slot :name="`header-${field.key}`" :index="index" :field="field">
                <th class="font-weight-bold pa-0" @click="sort(field)" :class="field.thClass">
                  <div class="d-flex align-center cursor-pointer mx-2">
                    <v-label>
                      {{ $t(field.label) }}
                    </v-label>
                    <ArrowDownIcon size="20" v-if="filter && filter.sortBy == field.key && filter.orderType == 'desc' && field.sort" />
                    <ArrowUpIcon size="20" v-if="filter && filter.sortBy == field.key && filter.orderType == 'asc' && field.sort" />
                  </div>
                </th>
              </slot>
            </template>
            <th class="font-weight-bold text-center" v-if="appendAction">
              <v-label>{{ $t("actions") }}</v-label>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td class="px-0" :colspan="fields.length + 1">
              <div>
                <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
                <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
              </div>
            </td>
          </tr>

          <tr v-if="(!loading && data && data.length == 0) || (!loading && !data)">
            <td :class="[`font-weight-bold h5 text-center bg-light`]" :colspan="fields.length + 1">
              <div>
                {{ $t("NotFound") }}
              </div>
            </td>
          </tr>
          <template v-if="!loading && data">
            <tr v-for="(item, index) in data" :key="index" @click="emits('rowClick', item)" @dblclick="emits('rowDblClick', item)">
              <!-- ACTIONS -->
              <td v-if="prependAction">
                <slot name="prepend-action" :item="item" :refresh="refresh" :getData="getData"> </slot>
              </td>
              <template v-for="(field, fieldIndex) in fields">
                <slot :name="`item-${field.key}`" :item="item" :index="index" :field="field">
                  <td :key="fieldIndex" :class="[field.tdClass]">
                    <template v-if="field.key != 'status' && field.key != 'prtnContractStatus' && field.key != 'state'">
                      <slot :name="field.key" :item="item" :index="index" :field="field">
                        {{ field.isAmount ? parseNumber(item[field.key]) : item[field.key] }}
                      </slot>
                    </template>
                    <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" v-if="field.key == 'status'" :color="getColor(item)">
                      {{ item[field.key] }}
                    </v-chip>
                    <v-chip
                      class="font-weight-bold px-2 mr-2"
                      rounded="lg"
                      size="small"
                      v-if="field.key == 'prtnContractStatus'"
                      :color="getColor(item)"
                    >
                      {{ item[field.key] }}
                    </v-chip>
                    <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" v-if="field.key == 'state'" :color="getStateColor(item)">
                      {{ item[field.key] }}
                    </v-chip>
                  </td>
                </slot>
              </template>
              <!-- ACTIONS -->
              <td v-if="appendAction">
                <slot name="actions" :item="item" :refresh="refresh" :getData="getData"> </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>
    <slot name="pagination" :lastNumber="lastNumber" :firstNumber="firstNumber" :filter="filter" :refresh="refresh" :getData="getData">
      <v-row class="mt-1" v-if="props.filter && hasPagination">
        <v-col cols="12" lg="6" class="d-flex" style="align-items: center">
          <div class="mr-2">
            <v-select
              density="compact"
              class="mt-4"
              v-model="filter.pageSize"
              @update:modelValue="getData"
              :items="[20, 50, 100, 200, 500]"
              variant="solo-filled"
            />
          </div>
          <div>
            <v-label class="text-grey200">
              {{
                $t("RecordsFrom", {
                  current: parseNumber(firstNumber || 0),
                  pageSize: parseNumber(lastNumber || 0),
                  count: parseNumber(filter.totalRows || 0)
                })
              }}
            </v-label>
          </div>
        </v-col>
        <v-col cols="12" lg="6" class="text-right">
          <v-pagination
            @click="getData"
            rounded="circle"
            class="my-custom-pagination"
            v-model="filter.page"
            :length="Math.ceil(filter.totalRows / filter.pageSize)"
            :total-visible="4"
          ></v-pagination>
        </v-col>
      </v-row>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none;
  outline: none;
  background: transparent;
}
</style>
