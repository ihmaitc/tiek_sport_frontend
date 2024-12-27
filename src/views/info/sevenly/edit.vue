<script setup lang="ts">
import i18n from "@/app/config/i18n";
import TranslateItems from "@/components/TranslateItems.vue";
import SevenlyService from "@/services/info/sevenly.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify";

const { setError } = useErrorToast();
const route = useRoute();
const router = useRouter();

const data = ref<any>(null);
const saveLoading = ref(false);
const loading = ref(false);
const id = route.params.id as string;

const getData = () => {
  loading.value = true;
  SevenlyService.Get(id)
    .then((res) => {
      data.value = res.data;
    })
    .catch((err) => {
      setError(err);
    })
    .finally(() => {
      loading.value = false;
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
    SevenlyService.Update(data.value)
      .then(() => {
        notify({
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });
        router.push({ name: "Sevenly" });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

getData();
</script>
<template>
  <ui-parent-card v-if="loading" class="text-center">
    <v-progress-circular indeterminate></v-progress-circular>
  </ui-parent-card>
  <ui-parent-card v-if="!loading && data">
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
      </v-row>
      <v-row class="mt-3 px-3">
        <v-btn color="error" variant="flat" @click="router.back()" :text="$t('Back')" />
        <v-spacer />
        <v-btn color="success" :loading="saveLoading" variant="flat" type="submit" :text="$t('Save')" />
      </v-row>
    </v-form>
  </ui-parent-card>
</template>
