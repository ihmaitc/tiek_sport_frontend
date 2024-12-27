<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import FormTable from "@/components/form/FormTable.vue";
import FormTableActions from "@/components/form/FormTableActions.vue";
import FormTableHeader from "@/components/form/FormTableHeader.vue";
import { IFields, IFilter, ITableActions } from "@/models/basic";
import { QuestionAnswerTemplateService } from "@/services/info/QuestionAnswerTemplate.service";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const fields: IFields[] = [
  { key: "id", label: "id" },
  { key: "code", label: "code" },
  { key: "shortName", label: "shortName" },
  { key: "fullName", label: "fullName" },
  { key: "state", label: "state" }
];

const filter: IFilter = reactive({
  orderType: "asc",
  page: 1,
  pageSize: 20,
  search: "",
  totalRows: 0,
  sortBy: ""
});

const permission = "InvQuestionAnswerTemplate";
const routerName = "QuestionAnswerTemplate";
const actions: ITableActions = {
  isEdit: true,
  isDelete: true
};

const edit = (item: any) => {
  router.push({
    name: `Edit${routerName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};
const view = (item: any) => {
  router.push({
    name: `View${routerName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};
</script>

<template>
  <UiParentCard>
    <FormTable
      :fields="fields"
      :filter="filter"
      :service="QuestionAnswerTemplateService"
      :permission="permission"
      :routerName="routerName"
      append-action
    >
      <template #header="{ refresh, getData }">
        <FormTableHeader :filter="filter" @refresh="refresh" @edit="edit" :permission="permission" @getData="getData" />
      </template>

      <template #actions="{ item, getData }">
        <FormTableActions
          :item="item"
          :actions="actions"
          :service="QuestionAnswerTemplateService"
          @refresh="getData"
          @edit="edit"
          :permission="permission"
          @view="view"
        />
      </template>
    </FormTable>
  </UiParentCard>
</template>

<style lang="scss" scoped></style>
