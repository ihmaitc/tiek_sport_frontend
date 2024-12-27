<script setup lang="ts">
import { IFields } from "@/models/basic";
import { useNotification } from "@kyvg/vue3-notification";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RefreshIcon, XIcon, EyeIcon } from "vue-tabler-icons";
import FormTable from "./form/FormTable.vue";

interface IFilter {
  search: string;
  sortBy: string;
  orderType: "asc" | "desc";
  page: number;
  pageSize: number;
  statusIds?: number[];
  totalRows: number;
}
const notification = useNotification();
const { t } = useI18n();

interface IProps {
  service: any;
}
const props = defineProps<IProps>();
const loader = ref<boolean>(false);
const isDetail = ref<boolean>(false);
const cleaningLoading = ref<boolean>(false);
const isModal = ref<boolean>(false);
const detail = ref<any>();
const formTableRef = ref<Partial<typeof FormTable>>();

const fields = ref<IFields[]>([
  {
    key: "id",
    label: "id"
  },
  {
    key: "title",
    label: "title",
    tdClass: "w-500"
  },
  {
    key: "requestPath",
    label: "requestPath"
  },
  {
    key: "requestTraceId",
    label: "requestTraceId"
  },
  {
    key: "hostName",
    label: "hostName"
  },
  {
    key: "type",
    label: "type"
  },
  {
    key: "createdAt",
    label: "createdAt"
  },
  {
    key: "statusCode",
    label: "statusCode"
  }
]);

const filter: IFilter = reactive({
  search: "",
  sortBy: "",
  orderType: "desc",
  page: 1,
  pageSize: 20,
  totalRows: 0
});

const setError = (err: any) => {
  if (err.response.data.errors) {
    let e = err.response.data.errors;

    for (const item in e) {
      notification.notify({
        type: "error",
        text: e[item].toString()
      });
    }
  }
};

const setDetail = (id: number | string) => {
  isDetail.value = true;
  loader.value = true;
  if (props.service) {
    props.service
      .Get(id)
      .then((res: any) => {
        detail.value = res.data;
        loader.value = false;
      })
      .catch((err: any) => {
        loader.value = false;
        setError(err);
      });
  }
};

const archiveAll = () => {
  try {
    cleaningLoading.value = true;
    props.service
      .ArchiveAll()
      .then(() => {
        isModal.value = false;
        notification.notify({
          text: t("cleanedSuccess")
        });
        if (formTableRef.value) {
          formTableRef.value.refresh();
        }
      })
      .catch((e: any) => {
        setError(e);
      })
      .finally(() => {
        cleaningLoading.value = false;
      });
  } catch (e) {
    cleaningLoading.value = false;
  }
};
</script>

<template>
  <div>
    <form-table :service="service" :filter="filter" :fields="fields" append-action ref="formTableRef">
      <template #header="{ getData, loading }">
        <v-row class="mb-3">
          <v-col md="4" class="text-right">
            <form-input v-model="filter.search" @appendInner="getData" appendInnerIcon="mdi-magnify" :placeholder="$t('enterText')"></form-input>
          </v-col>
          <v-col class="text-right">
            <v-btn @click="getData" :loading="loading" color="grey200" class="mx-3">
              <RefreshIcon class="mr-2" />
              {{ $t("refresh") }}
            </v-btn>
          </v-col>
        </v-row>
      </template>
      <template #actions="{ item }">
        <div @click="setDetail(item.id)">
          <EyeIcon size="20" style="cursor: pointer" />
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-end mt-3 mb-n2">
          <v-btn @click="isModal = true" :loading="cleaningLoading" color="secondary"> {{ $t("archiveAll") }} </v-btn>
        </div>
      </template>
    </form-table>
    <v-dialog v-model="isDetail" width="90%">
      <v-progress-circular indeterminate v-if="loader"></v-progress-circular>
      <v-card v-if="detail && !loader">
        <v-card-title>
          <v-row>
            <v-col cols="10">{{ detail.type }}</v-col>
            <v-col cols="2" @click="isDetail = false" class="text-right cursor-pointer">
              <XIcon />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <template v-for="key in Object.keys(detail)">
            <div class="d-flex">
              <h4>{{ key }}:</h4>
              <p class="ml-1 overflow-auto">{{ detail[key] }}</p>
            </div>
          </template>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col class="text-right">
              <v-btn color="error" @click="isDetail = false">
                {{ $t("close") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isModal" width="300">
      <v-card class="mx-2 my-2">
        <v-card-title>{{ $t("you_want_archive") }}</v-card-title>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn color="error" variant="flat" block @click="isModal = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :loading="cleaningLoading" color="success" variant="flat" block @click="archiveAll">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style>
.w-500 {
  max-width: 500px !important;
}
</style>
