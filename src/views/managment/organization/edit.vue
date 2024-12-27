<script setup lang="ts">
import i18n from "@/app/config/i18n";
import TranslateItems from "@/components/TranslateItems.vue";
import OrganizationService from "@/services/managment/organization.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SearchIcon } from "vue-tabler-icons";
import { SubmitEventPromise } from "vuetify";

const { setError } = useErrorToast();
const route = useRoute();
const router = useRouter();

const data = ref<any>();

const saveLoading = ref(false);
const innLoading = ref(false);

const id = route.params.id as string;

const get = () => {
  OrganizationService.Get(id).then((res) => {
    data.value = res.data;
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
    OrganizationService.Update(data.value)
      .then(() => {
        notify({
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });
        router.push({ name: "Organization" });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

function GetByInn() {
  innLoading.value = true;
  OrganizationService.GetByInn(data.value.inn)
    .then((res) => {
      data.value = res.data;
    })
    .catch((error) => {
      setError(error);
    });
}

get();
</script>
<template>
  <ui-parent-card>
    <v-form v-if="data" @submit.prevent="save">
      <v-row>
        <v-col lg="3" cols="12">
          <form-input :label="$t('inn')" mask="#########" :disabled="+String(route.params.id) != 0" required v-model:model-value="data.inn">
            <template #append-inner>
              <v-btn :loading="innLoading" color="info" class="pt-0" variant="tonal">
                <SearchIcon @click="GetByInn" />
              </v-btn>
            </template>
          </form-input>
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

<style>
.v-field__append-inner,
.v-field__clearable,
.v-field__prepend-inner {
  align-items: center !important;
  padding-top: 0 !important;
}
</style>
