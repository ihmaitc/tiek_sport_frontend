<script setup lang="ts">
import { useFilter } from "@/composables/useFilter";

interface IProps {
  filter: any;
  removeKeys?: string[];
  params?: object;
}

const emits = defineEmits(["changeStatus"]);
const props = defineProps<IProps>();
const { createRouteQuery, parseFilter } = useFilter();

parseFilter(props.filter);
createRouteQuery({ filter: props.filter, params: props.params, removeKeys: props.removeKeys });
emits("changeStatus");
</script>

<template>
  <div>
    <slot :createRouteQuery="createRouteQuery" :params="params" :removeKeys="removeKeys"></slot>
  </div>
</template>

<style lang="scss" scoped></style>
