<script setup lang="ts">
import FormTabRow from "@/components/form/FormTabRow.vue";
import FormCanButtons from "@/components/FormCanButtons.vue";
import { IFields } from "@/models/basic";
import MfyService from "@/services/info/mfy.service";
import MfyCommissionMemberService from "@/services/info/MfyCommissionMember.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { ref } from "vue";
import { useRoute } from "vue-router";

const { setError } = useErrorToast();
const route = useRoute();
const fields: IFields[] = [
  { key: "fullName", label: "fullName" },
  { key: "passportSeriaNumber", label: "passportSeriaNumber" },
  { key: "pinfl", label: "pinfl" },
  { key: "phoneNumber", label: "phoneNumber" },
  { key: "position", label: "position" }
];
const skFields: IFields[] = [
  { key: "fullName", label: "fullName" },
  { key: "phoneNumber", label: "phoneNumber" },
  { key: "position", label: "position" }
];

const data = ref<any>(null);
const loading = ref<boolean>(true);
const permission = "Mfy";

const id = route.params.id as string;

const get = () => {
  loading.value = true;
  MfyService.Get(id)
    .then((res) => {
      data.value = res.data;
    })
    .catch((error) => {
      setError(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

get();
</script>
<template>
  <div>
    <ui-parent-card class="text-center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </ui-parent-card>
    <template v-else-if="data && !loading">
      <ui-parent-card>
        <v-row>
          <v-col lg="3" cols="12">
            <form-input :label="$t('orderCode')" v-model="data.code" disabled></form-input>
          </v-col>
          <v-col lg="3" cols="12">
            <form-input :label="$t('shortName')" v-model="data.shortName" disabled></form-input>
          </v-col>
          <v-col lg="3" cols="12">
            <form-input :label="$t('fullName')" v-model="data.fullName" disabled></form-input>
          </v-col>
          <v-col lg="3" cols="12">
            <form-input :label="$t('Sector')" v-model="data.sector" disabled></form-input>
          </v-col>
          <v-col lg="3" cols="12">
            <form-input :label="$t('region')" v-model="data.region" disabled></form-input>
          </v-col>
          <v-col lg="3" cols="12">
            <form-input :label="$t('district')" v-model="data.district" disabled></form-input>
          </v-col>
        </v-row>
      </ui-parent-card>

      <FormTabRow v-if="data && data.commissionMembers && data.commissionMembers.length" :fields="fields" :items="data.commissionMembers">
        <template #passportSeriaNumber="{ item }">
          <td>{{ item.docSeria }} {{ item.docNumber }}</td>
        </template>
      </FormTabRow>
      <FormTabRow v-if="data && data.sxkCommissionMembers && data.sxkCommissionMembers.length" :fields="skFields" :items="data.sxkCommissionMembers">
      </FormTabRow>

      <FormCanButtons :permission="permission" :service="MfyCommissionMemberService" :data="data" class="pt-5">
        <template #default="{ openModal }">
          <v-btn
            color="info"
            @click="
              openModal({
                title: $t('UpdateMembers'),
                cb: 'ReloadFromGatewayById',
                id: data.id
              })
            "
            v-if="data.canUpdateMembers || true"
            :text="$t('UpdateMembers')"
          />
        </template>
      </FormCanButtons>
    </template>
  </div>
</template>
