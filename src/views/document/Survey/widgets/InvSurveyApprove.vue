<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSurvey } from "../store/useSurvey";

const store = useSurvey();
const { data } = storeToRefs(store);
</script>

<template>
  <v-expansion-panels v-if="data && data.invSurveyApprove && data.invSurveyApprove.tables && data.invSurveyApprove.tables.length">
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{ $t("surveyApproveMembers") }}
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-table fixed-header max-height="300px" density="compact">
          <tr>
            <th class="border pa-2">{{ $t("№") }}</th>
            <th class="border pa-2 text-left">{{ $t("fullName") }}</th>
            <th class="border pa-2 text-left">{{ $t("phoneNumber") }}</th>
            <th class="border pa-2 text-left">{{ $t("position") }}</th>
            <th class="border pa-2 text-left">{{ $t("decision") }}</th>
          </tr>
          <tr v-for="(member, ind) in data.invSurveyApprove.tables">
            <td class="border pa-2 text-center">
              {{ ind + 1 }}
            </td>
            <td class="border pa-2">
              {{ member.mfyCommissionMember }}
            </td>
            <td class="border pa-2">
              {{ member.phoneNumber }}
            </td>
            <td class="border pa-2">
              {{ member.position }}
            </td>
            <td class="border pa-2">
              {{ member.decision }}
            </td>
          </tr>
        </v-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style lang="scss" scoped></style>
