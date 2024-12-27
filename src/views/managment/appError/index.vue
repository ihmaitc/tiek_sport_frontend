<script setup lang="ts">
import AppError from "@/components/AppError.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import AppErrorService from "@/services/managment/apperror.service";
</script>

<template>
  <UiParentCard>
    <AppError :service="AppErrorService" />
  </UiParentCard>
</template>
