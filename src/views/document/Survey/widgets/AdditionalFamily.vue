<script setup lang="ts">
import { useSurvey } from "../store/useSurvey";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

interface IProps {
  selectedTab: number;
}

defineProps<IProps>();

const store = useSurvey();
const { data, showFamilies, houseHold } = storeToRefs(store);

const router = useRouter();

const emits = defineEmits(["update:selectedTab"]);

const viewAdditionalFamily = (id: number | null) => {
  const query = { surveyDocId: data.value?.id, createdChild: "true" };
  router.push({
    name: "EditSurvey",
    params: {
      id: id
    },
    query: query
  });

  router.afterEach(() => {
    window.location.reload();
  });
};
</script>

<template>
  <v-card
    class="border my-2"
    elevation="0"
    color="success"
    @click="
      () => {
        emits('update:selectedTab', 0);
        showFamilies = false;
      }
    "
  >
    <v-card-title>
      <v-row class="align-center">
        <v-col cols="auto">
          <v-icon>mdi-account-group</v-icon>
        </v-col>
        <v-col>
          <div class="d-flex flex-column">
            <span>
              {{
                $t("sFamily", {
                  name: data?.applicantPerson?.fullName
                })
              }}
            </span>
            <span class="font-weight-medium text-subtitle-2">
              {{
                $t("familyMembers", {
                  count: data?.countOfFamilyMembers ? data?.countOfFamilyMembers - 1 : 0
                })
              }}</span
            >
          </div>
        </v-col>
      </v-row>
    </v-card-title>
  </v-card>
  <v-card class="border my-2" elevation="0" v-for="(item, _) in houseHold">
    <v-card-title>
      <v-row class="align-center">
        <v-col cols="auto">
          <v-icon>mdi-account-group</v-icon>
        </v-col>
        <v-col>
          <div class="d-flex flex-column">
            <span>
              {{
                $t("sFamily", {
                  name: item.applicantPerson?.fullName
                })
              }}
            </span>
            <span class="font-weight-medium text-subtitle-2">
              {{
                $t("familyMembers", {
                  count: item.countOfFamilyMembers ? item.countOfFamilyMembers - 1 : 0
                })
              }}</span
            >
          </div>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn v-if="item.id !== data?.id" @click="viewAdditionalFamily(item.id)" color="info">
            {{ $t("View") }}
          </v-btn>
          <div v-else class="dot"></div>
        </v-col>
      </v-row>
    </v-card-title>
  </v-card>
</template>

<style lang="scss" scoped>
.dot {
  width: 0.5rem;
  height: 0.5rem;
  flex: 0 0 0.5rem;
  border-radius: 50%;
  background-color: rgb(var(--v-theme-success));
}
</style>
