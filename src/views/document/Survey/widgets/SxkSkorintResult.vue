<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSurvey } from "../store/useSurvey";
import { computed } from "vue";

const store = useSurvey();
const { data } = storeToRefs(store);

const sxkSkorintResult = computed(() => data.value && data.value.sxkSkoringResult?.filter((err) => err.errorMessage));
</script>

<template>
  <v-expansion-panels v-if="sxkSkorintResult?.length">
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{ $t("sxkSkorintResult") }}
      </v-expansion-panel-title>
      
      <v-expansion-panel-text>
        <v-table fixed-header max-height="300px" density="compact">
          <tr>
            <th class="border pa-2">{{ $t("id") }}</th>
            <th class="border pa-2">{{ $t("ownerId") }}</th>
            <th class="border pa-2">{{ $t("errorMessage") }}</th>
          </tr>
          <tr v-for="err in sxkSkorintResult">
            <td class="border pa-2" >
              {{ err.id }}
            </td>
            <td class="border pa-2">
              {{ err.ownerId }}
            </td>
            <td class="border pa-2">
              {{ err.errorMessage }}
            </td>
          </tr>
        </v-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style lang="scss" scoped></style>
