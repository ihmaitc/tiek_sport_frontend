<script setup lang="ts">
import { ref } from "vue";
import { GetQuestionnaireAnswers, IConstrains } from "../types";
import UiParentCard from "@/components/UiParentCard.vue";
import ConstraintTables from "./ConstraintTables.vue";
import { TrashIcon, XIcon } from "vue-tabler-icons";

interface IProps {
  constrains?: IConstrains[];
  answers: GetQuestionnaireAnswers[];
  isView?: boolean;
}

const items = ref<IConstrains[]>([]);
const props = defineProps<IProps>();

const emits = defineEmits<{
  (e: "update:model-value", value: boolean): void;
  (e: "saveConstraints", value: IConstrains[]): void;
}>();

const constraint: IConstrains = {
  id: 0,
  conditionedTables: [],
  isAny: false,
  selectedTables: []
};

if (props.constrains && props.constrains.length > 0) {
  items.value = props.constrains;
}

const addConstraint = () => {
  items.value.push(JSON.parse(JSON.stringify(constraint)));
};
const deleteConstraint = (index: number) => {
  items.value.splice(index, 1);
};

const updateConstraint = (index: number, value: IConstrains) => {
  items.value[index] = value;
};
</script>

<template>
  <v-card height="100%" class="py-5 px-5">
    <v-card-title>
      <v-row>
        <v-col>
          <h4>{{ $t("constraints") }}</h4>
        </v-col>
        <v-col class="text-right">
          <XIcon
            class="cursor-pointer"
            @click="emits('update:model-value', false)"
          />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <UiParentCard v-for="(item, index) in items" :key="index">
        <v-row class="align-center">
          <v-col>
            <form-checkbox
              v-if="item"
              :label="$t('isAny')"
              v-model="item.isAny"
              :disabled="isView"
            />
          </v-col>
          <v-col cols="1" class="text-right" v-if="!isView">
            <div class="cursor-pointer" @click="deleteConstraint(index)">
              <v-tooltip activator="parent" location="top">
                {{ $t("Delete") }}
              </v-tooltip>
              <TrashIcon />
            </div>
          </v-col>
        </v-row>

        <ConstraintTables
          :constraint="item"
          :isView="isView"
          :answers="answers"
          @set-constraint="(val) => updateConstraint(index, val)"
        />
      </UiParentCard>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-btn
          @click="emits('update:model-value', false)"
          :text="$t('Back')"
          color="error"
          variant="flat"
        />
        <v-spacer />
        <v-btn
          v-if="!isView"
          :text="$t('AddConstraint')"
          color="info"
          @click="addConstraint"
          class="mt-auto"
          variant="flat"
        />
        <v-btn
          v-if="!isView"
          :text="$t('Save')"
          color="success"
          class="mt-auto"
          variant="flat"
          @click="emits('saveConstraints', items)"
        />
      </v-row>
    </v-card-actions>
  </v-card>
</template>
