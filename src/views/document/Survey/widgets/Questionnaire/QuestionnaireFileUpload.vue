<script setup lang="ts">
import Camera from "@/Feature/Camera.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Share2Icon, TrashIcon, XIcon } from "vue-tabler-icons";

interface IProps {
  modelValue: boolean;
  sendLoading?: boolean;
}

defineProps<IProps>();

const emits = defineEmits(["update:modelValue", "send"]);

const err = ref();
// const API_TOKEN = "1ee6b3502bd64964a7f3b604bbf709ae";

const cameras = ref<MediaDeviceInfo[]>([]);
const loading = ref(false);

const cameraRef = ref<InstanceType<typeof Camera>>();

const snapshotImage = ref<File | null>(null);
const snapshotImageBlob = ref<string | null>(null);

const start = async () => {
  err.value = null;
  
  cameraRef.value?.start();

  try {
    const res = await cameraRef.value?.devices(["videoinput"]);
    if (res) {
      cameras.value = res;
    }
  } catch (e) {}
};

const upadteLoading = (val: boolean) => {
  loading.value = val;
};

const snapshot = async () => {
  const blob = await cameraRef.value?.snapshot();
  if (blob?.blob) {
    snapshotImageBlob.value = URL.createObjectURL(blob.blob);
    snapshotImage.value = blob.file;
  }
};

const stop = () => {
  if (cameraRef.value) {
    cameraRef.value.stop();
    emits("update:modelValue", false);
  }
};

const send = () => {
  emits("send", snapshotImage.value);
};

onMounted(() => {
  start();
});

onBeforeUnmount(() => {
  stop();
});
</script>

<template>
  <div class="camera-container">
    <div class="camera-container-inner">
      <div class="camera-top-controller">
        <div></div>
        <div></div>
        <v-btn :icon="XIcon" size="small" color="info" variant="tonal" @click="stop"> </v-btn>
      </div>
      <div class="camera-loading" v-if="loading">
        <v-progress-circular indeterminate color="#fff"></v-progress-circular>
      </div>
      <span v-if="err" class="d-flex align-center justify-center text-light">
        {{ err }}
      </span>
      <Camera @loading="upadteLoading" :resolution="{ width: 375, height: 844 }" @error="(e) => (err = e)" ref="cameraRef" :autoplay="false">
        <img v-if="snapshotImageBlob" :src="snapshotImageBlob" alt="" />

        <div class="camer-controller">
          <div>
            <TrashIcon color="red" @click="snapshotImageBlob = null" v-if="snapshotImageBlob && !sendLoading" />
          </div>
          <button class="start">
            <div :class="['start-inner', { ['active']: snapshotImageBlob }]" @click="snapshot"></div>
            {{ cameras?.length }}
          </button>
          <div>
            <v-progress-circular size="20" indeterminate color="#fff" v-if="sendLoading"></v-progress-circular>
            <Share2Icon color="#fff" v-if="snapshotImageBlob && !sendLoading" @click="send" />
          </div>
        </div>
      </Camera>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.camera-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  &-inner {
    max-width: 414px;
    width: 100%;
    height: 100%;
    position: relative;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .camera-top-controller {
    padding: 5px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 3;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .camera-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .camer-controller {
    height: 50px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 3;
    backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;

    .start {
      border: 1px solid white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      overflow: hidden;
      padding: 3px;

      .start-inner {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 50%;
        transition: all 0.4s;

        &.active {
          background: rgb(var(--v-theme-warning));
          transform: scale(0.8);
        }
      }
    }
  }
}
</style>
