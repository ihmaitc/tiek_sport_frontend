<script setup lang="ts">
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { ref } from "vue";
import { onMounted } from "vue";

interface IProps {
  options?: any;
}

const props = defineProps<IProps>();

const container = ref<HTMLElement>();
onMounted(() => {
  if (container.value) {
    Fancybox.bind(container.value, "[data-fancybox]", {
      ...(props.options || {})
    });
  }
});
</script>

<template>
  <div class="img-fancy-box" ref="container" style="max-height: 80vh">
    <slot></slot>
  </div>
</template>
<style lang="scss">
.img-fancy-box {
  :deep() img {
    width: 100%;
  }
}
</style>
