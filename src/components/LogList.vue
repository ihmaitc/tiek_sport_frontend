<script setup lang="ts">
import { useGlobal } from "@/composables/useGlobal";
import { ILogList } from "@/models/basic";

interface IProps {
  logs: ILogList[];
  cols?: number | string;
}

defineProps<IProps>();
const { getColor } = useGlobal();
</script>

<template>
  <v-row :class="cols ? '' : 'mt-4'" v-if="logs && logs.length">
    <v-col cols="12" :lg="cols || 6" md="8">
      <v-expansion-panels>
        <v-expansion-panel elevation="10">
          <v-expansion-panel-title>
            <v-row no-gutters>
              <v-col cols="12" md="5" class="d-flex justify-start">
                <h6 class="text-h6">{{ $t("History") }}</h6>
              </v-col>
            </v-row>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card elevation="10">
              <v-card-text class="pb-sm-13">
                <v-timeline class="theme-timeline pt-3" density="compact" side="end" truncate-line="both">
                  <v-timeline-item v-for="(item, index) in logs" :key="index" class="mb-4" :dot-color="getColor(item.id)" fill-dot size="x-small">
                    <div class="d-flex justify-space-between">
                      <div>
                        <v-chip class="font-weight-bold px-2 mr-2" rounded="lg" size="small" :color="getColor(item.id)">
                          {{ item.status }}
                        </v-chip>
                      </div>
                      <div class="h5 font-weight-medium">
                        -
                        {{ JSON.parse(item.userInfo).FullName }}
                      </div>
                      <span class="text-medium-emphasis text-subtitle-1 font-weight-medium ml-auto text-no-wrap">
                        {{ item.dateAt }}
                      </span>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-expansion-panel-text>
          <v-divider></v-divider>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped></style>
