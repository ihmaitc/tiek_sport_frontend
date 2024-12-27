<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSurvey } from "../store/useSurvey";

const store = useSurvey();
const { data } = storeToRefs(store);
</script>

<template>
  <v-expansion-panels v-if="data && data.approveDecisionReasons?.length">
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{ $t("decisionReason") }}
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-table fixed-header max-height="300px" density="compact">
          <tr>
            <th class="border pa-2">{{ $t("№") }}</th>
            <th class="border pa-2 text-left">{{ $t("details") }}</th>
          </tr>
          <tr v-for="(err, ind) in data.approveDecisionReasons">
            <td class="border pa-2 text-center">
              {{ ind + 1 }}
            </td>
            <td class="border pa-2">
              {{ err }}
            </td>
          </tr>
        </v-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style lang="scss" scoped></style>
