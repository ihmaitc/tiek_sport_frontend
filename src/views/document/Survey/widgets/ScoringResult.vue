<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSurvey } from "../store/useSurvey";
import { useGlobal } from "@/composables/useGlobal";
import { CheckIcon, XIcon } from "vue-tabler-icons";

const store = useSurvey();
const { data } = storeToRefs(store);
const { parseNumber, getColor } = useGlobal();
</script>

<template>
  <v-expansion-panels v-if="data && data.srScoringResult">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <h4>{{ $t("ScoringResult") }}</h4>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row>
          <v-col cols="12" lg="4" sm="6">
            <b> {{ $t("averageIncome") }}: </b>
            <p>
              {{ parseNumber(data.srScoringResult.averageIncome) }}
            </p>
          </v-col>
          <v-col cols="12" lg="4" sm="6">
            <b> {{ $t("cutOfSalary") }}: </b>
            <p>
              {{ parseNumber(data.srScoringResult.cutOfSalary) }}
            </p>
          </v-col>
          <v-col cols="12" lg="4" sm="6">
            <b> {{ $t("totalIncome") }}: </b>
            <p>
              {{ parseNumber(data.srScoringResult.totalIncome) }}
            </p>
          </v-col>
          <v-col cols="12" lg="4" sm="6">
            <b> {{ $t("totalOfficialIncome") }}: </b>
            <p>
              {{ parseNumber(data.srScoringResult.totalOfficialIncome) }}
            </p>
          </v-col>
          <v-col cols="12" lg="4" sm="6">
            <b> {{ $t("incomeCheck") }}: </b>
            <div>
              <CheckIcon color="green" v-if="data.srScoringResult.incomeCheck" />
              <XIcon color="red" v-else />
            </div>
          </v-col>
          <v-col cols="12" lg="4" sm="6">
            <b> {{ $t("propertiesCheck") }}: </b>
            <div>
              <CheckIcon color="green" v-if="data.srScoringResult.propertiesCheck" />
              <XIcon color="red" v-else />
            </div>
          </v-col>
          <v-col cols="12" lg="4" sm="6">
            <b> {{ $t("vehiclesCheck") }}: </b>
            <div>
              <CheckIcon color="green" v-if="data.srScoringResult.vehiclesCheck" />
              <XIcon color="red" v-else />
            </div>
          </v-col>
          <v-col cols="12" lg="4" sm="6">
            <b> {{ $t("newVehicleCheck") }}: </b>
            <div>
              <CheckIcon color="green" v-if="data.srScoringResult.newVehicleCheck" />
              <XIcon color="red" v-else />
            </div>
          </v-col>
          <v-col cols="12" lg="4" sm="6">
            <b> {{ $t("externalStatus") }}: </b>
            <div>
              <v-chip :color="getColor(data.srScoringResult)"> {{ data.srScoringResult.externalStatus }} </v-chip>
            </div>
          </v-col>
          <v-col cols="12">
            <b> {{ $t("message") }}: </b>
            <p>
              {{ data.srScoringResult.message }}
            </p>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style lang="scss" scoped></style>
