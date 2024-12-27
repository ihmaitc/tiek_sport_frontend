<script setup lang="ts">
import i18n from "@/app/config/i18n";
import TranslateItems from "@/components/TranslateItems.vue";
import { ISelectList } from "@/models/basic";
import DistrictService from "@/services/info/district.service";
import RegionService from "@/services/info/region.service";
import SectorService from "@/services/info/sector.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify";

const { setError } = useErrorToast();
const route = useRoute();
const router = useRouter();

const data = ref<any>();
const saveLoading = ref(false);
const RegionList = ref<ISelectList[]>([]);
const DistrictList = ref<ISelectList[]>([]);

const id = route.params.id as string;

const get = () => {
  SectorService.Get(id).then((res) => {
    data.value = res.data;

    RegionService.GetAsSelectList()
      .then((res) => {
        RegionList.value = res.data;
      })
      .catch((error) => {
        setError(error);
      });

    if (data.value.regionId) {
      DistrictService.GetAsSelectList(data.value.regionId)
        .then((res) => {
          DistrictList.value = res.data;
        })
        .catch((error) => {
          setError(error);
        });
    }
  });
};

const save = async (values: SubmitEventPromise) => {
  const { valid, errors } = await values;
  if (errors && errors.length > 0) {
    document.getElementById(String(errors[0].id))?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });
  }

  if (valid) {
    saveLoading.value = true;
    SectorService.Update(data.value)
      .then(() => {
        notify({
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });
        router.push({ name: "Sector" });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

get();
</script>
<template>
  <ui-parent-card>
    <v-form v-if="data" @submit.prevent="save">
      <v-row>
        <v-col lg="3" cols="12">
          <form-input :label="$t('orderCode')" type="number" required v-model:model-value="data.code"></form-input>
        </v-col>
        <v-col lg="3" cols="12">
          <TranslateItems
            column-name="short_name"
            required
            :label="$t('shortName')"
            v-model:translates="data.translates"
            v-model:value="data.shortName"
          />
        </v-col>
        <v-col lg="3" cols="12">
          <TranslateItems
            column-name="full_name"
            required
            :label="$t('fullName')"
            v-model:translates="data.translates"
            v-model:value="data.fullName"
          />
        </v-col>
        <!-- <v-col lg="3" cols="12">
          <form-select :list="RegionList" v-model:model-value="data.regionId" :label="$t('region')" required @update:model-value="ChangeRegion">
          </form-select>
        </v-col>
        <v-col lg="3" cols="12">
          <form-select :list="DistrictList" v-model:model-value="data.districtId" :label="$t('district')" required> </form-select>
        </v-col> -->
      </v-row>

      <v-row class="mt-3 px-3">
        <v-btn color="error" variant="flat" @click="router.back()" :text="$t('Back')" />
        <v-spacer />
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit" :text="$t('Save')" />
      </v-row>
    </v-form>
  </ui-parent-card>
</template>
