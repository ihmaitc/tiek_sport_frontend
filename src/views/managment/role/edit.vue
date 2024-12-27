<script setup lang="ts">
import i18n from "@/app/config/i18n";
import TranslateItems from "@/components/TranslateItems.vue";
import RoleService from "@/services/managment/role.service";
import ManualService from "@/services/others/manual.service.";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify";

const { setError } = useErrorToast();
const route = useRoute();
const router = useRouter();

const data = ref<any>();
const moduleList = ref<any>();

const saveLoading = ref(false);

const id = route.params.id as string;

const get = () => {
  RoleService.Get(id).then((res) => {
    data.value = res.data;
    getModules();
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
    RoleService.Update(data.value)
      .then(() => {
        notify({
          text: i18n.global.t("SaveSuccess"),
          type: "success"
        });
        router.push({ name: "Role" });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

function getModules() {
  ManualService.GetModuleSelectList().then((response) => {
    moduleList.value = response.data;
  });
}

get();
</script>
<template>
  <v-form v-if="data" @submit.prevent="save">
    <ui-parent-card>
      <v-row>
        <v-col lg="6" cols="12">
          <TranslateItems
            column-name="short_name"
            required
            :label="$t('shortName')"
            v-model:translates="data.translates"
            v-model:value="data.shortName"
          />
        </v-col>
        <v-col lg="6" cols="12">
          <TranslateItems
            column-name="full_name"
            required
            :label="$t('fullName')"
            v-model:translates="data.translates"
            v-model:value="data.fullName"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col lg="3" cols="12">
          <form-checkbox v-model="data.isDefault" :label="$t('isdefault')" />
        </v-col>
        <v-col lg="3" cols="12">
          <form-checkbox v-model="data.isTopInspector" :label="$t('isadmin')" />
        </v-col>
      </v-row>
    </ui-parent-card>
    <ui-parent-card class="mt-4">
      <v-row>
        <v-col sm="12" md="12">
          <v-expansion-panels>
            <v-expansion-panel class="mt-3" v-for="value in moduleList">
              <v-expansion-panel-title>
                {{ value?.fullName }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-expansion-panels>
                  <v-expansion-panel class="mt-3" v-for="item in value.subGroups">
                    <v-expansion-panel-title>
                      {{ item?.fullName }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-row class="mt-1">
                        <v-col cols="12" lg="3" md="6" class="py-0" v-for="(child, el) in item.modules" :key="child.id + el">
                          <v-checkbox :label="child.fullName" v-model="data.modules" :id="'child' + child.id" :value="child.id"> </v-checkbox>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </ui-parent-card>
    <v-row class="mt-3 px-3">
      <v-btn color="error" variant="flat" @click="router.back()" :text="$t('Back')" />
      <v-spacer />
      <v-btn color="success" :loading="saveLoading" variant="flat" type="submit" :text="$t('Save')" />
    </v-row>
  </v-form>
</template>

<style scoped>
legend {
  background-color: #000;
  color: #fff;
  padding: 3px 6px;
}

.output {
  font: 1rem "Fira Sans", sans-serif;
}

input {
  margin: 0.4rem;
}
</style>
