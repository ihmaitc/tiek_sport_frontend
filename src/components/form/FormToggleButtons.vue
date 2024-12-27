<script setup lang="ts">
import { computed } from "vue";
import { IToggleIconButtons } from "@/models/vuetify/types";
import { useIsVisible } from "@/composables/useIsVisible";

const props = withDefaults(defineProps<IToggleIconButtons>(), {
  color: "primary",
  mandatory: true
});

const { isVisible } = useIsVisible();

const emits = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const model = computed({
  get(): string {
    return props.modelValue;
  },
  set(newValue: string): void {
    emits("update:modelValue", newValue);
  }
});
</script>

<template>
  <v-btn-toggle :divided="divided" v-model="model" :mandatory="mandatory" :color="color" class="text-center">
    <v-slide-group show-arrows selected-class="bg-primary">
      <v-slide-group-item class="border" v-for="(tab, index) in tabs" :key="index">
        <v-btn v-if="tab.visible ? isVisible(tab.visible) : true" v-bind="tab">
          <v-icon v-if="tab.icon"> {{ tab.icon }} </v-icon>
          <span v-if="tab.label"> {{ $t(tab.label) }}</span>
        </v-btn>
      </v-slide-group-item>
    </v-slide-group>
  </v-btn-toggle>
</template>
<style lang="scss">
.v-slide-group__next {
  border-left: 1px solid rgba(var(--v-border-color), 1);
}
.v-slide-group__prev {
  border-right: 1px solid rgba(var(--v-border-color), 1);
}
</style>
