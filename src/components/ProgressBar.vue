<script setup lang="ts">
interface IProgress {
  currentTime: number;
  duration: number;
  isSHowPercentage?: boolean;
}
defineProps<IProgress>();
</script>

<template>
  <div class="progress">
    <div class="timeline" ref="progress_holder">
      <div
        class="timeline-played"
        :style="{
          width: `${(currentTime / duration) * 100}%`
        }"
      >
        <span></span>
      </div>
    </div>
    <span v-if="isSHowPercentage" style="white-space: nowrap;"> {{ (currentTime / duration) * 100 }}%</span>
  </div>
</template>

<style lang="scss" scoped>
.progress {
  width: 100%;
  transition: all 0.4s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  .timeline {
    height: 0.3125rem;
    width: calc(100% - 2.25rem);
    margin: 0 auto;
    position: relative;
    background: rgba(249, 249, 249, 0.2);
    border-radius: 0.25rem;
    &-played {
      width: 0%;
      height: 100%;
      background: var(--success);
      border-radius: 0.5625rem;
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      span {
        position: absolute;
        right: 0;
        top: 50%;
        opacity: 0;
        transform: translate(50%, -50%);
        width: 1.5rem;
        height: 1.5rem;
        background: var(--success);
        display: block;
        border-radius: 50%;
        transition: all 0.4s ease;
        pointer-events: none;
      }
    }
  }
}
</style>
