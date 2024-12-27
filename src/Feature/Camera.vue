<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

interface IResolution {
  width: number;
  height: number;
}

export type MediaDeviceKind = "audioinput" | "audiooutput" | "videoinput";

interface IProps {
  resolution?: IResolution;
  facingMode?: string;
  autoplay?: boolean;
  playsinline?: boolean;
  constraints?: any;
}

const props = withDefaults(defineProps<IProps>(), {
  resolution() {
    return { width: 1920, height: 1080 };
  },
  facingMode: "environment",
  autoplay: true,
  playsinline: true,
  constraints: false
});

const emit = defineEmits(["loading", "started", "stopped", "paused", "resumed", "camera-change", "snapshot", "error"]);

const video = ref<HTMLVideoElement>();
const canvas = ref<HTMLCanvasElement>();
const stream = ref<MediaStream>();

const constraints = props.constraints || {
  video: {
    width: props.resolution.width,
    height: props.resolution.height,
    facingMode: props.facingMode,
    deviceId: {}
  },
  audio: false
};

const devices = async (kinds: MediaDeviceKind[] = ["audioinput", "videoinput"]): Promise<MediaDeviceInfo[]> => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => kinds.includes(device.kind));
};

const currentDeviceID = (): string | undefined => {
  if (!stream.value) return;

  const tracks = stream.value.getVideoTracks().map((track: MediaStreamTrack) => track.getSettings().deviceId);

  if (tracks.length > 0) return tracks[0];
};

const start = async (): Promise<void> => {
  emit("loading", true);

  try {
    stream.value = await navigator.mediaDevices?.getUserMedia(constraints);
    alert(`stream: ${stream.value}`);
    if (!video.value) throw new Error("Video ref is null");

    video.value.srcObject = stream.value;
    alert(`video: ${video.value}`);

    currentDeviceID();

    emit("started");
    emit("loading", false);
  } catch (err) {
    emit("loading", false);
    emit("error", err);
  }
};

interface SnapShotEmitData {
  blob: Blob | null;
  file: File | null;
}

const snapshot = (resolution: IResolution = props.resolution, type = "image/png", quality?: number): Promise<SnapShotEmitData | null> => {
  if (!video.value) throw new Error("Video ref is null");
  if (!canvas.value) throw new Error("Canvas ref is null");

  const { width, height } = resolution;

  canvas.value.width = width;
  canvas.value.height = height;

  canvas.value.getContext("2d")?.drawImage(video.value, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.value?.toBlob(
      (blob: Blob | null) => {
        if (blob) {
          const file = new File([blob], "snapshot.png", { type, lastModified: Date.now() });
          const emitData = {
            blob: blob,
            file: file
          };
          emit("snapshot", emitData);
          resolve(emitData);
        }
      },
      type,
      quality
    );
  });
};

const changeCamera = async (deviceID: string): Promise<void> => {
  stop();
  constraints.video.deviceId.exact = deviceID;
  await start();
  emit("camera-change", deviceID);
};

const resume = (): void => {
  video.value?.play();
  emit("resumed");
};

const pause = (): void => {
  video.value?.pause();
  emit("paused");
};

const stop = (): void => {
  stream.value?.getTracks().forEach((track) => track.stop());
  emit("stopped");
};

defineExpose({
  changeCamera,
  stop,
  start,
  pause,
  resume,
  snapshot,
  currentDeviceID,
  devices
});

onMounted(() => {
  if (!navigator.mediaDevices) throw new Error("Media devices not available");

  const videoElement = document.getElementById("video");

  if (props.playsinline && videoElement) {
    videoElement.setAttribute("playsinline", "");
  }

  if (props.autoplay) start();
});

onUnmounted(() => stop());
</script>

<template>
  <div id="camera-container">
    <video autoplay ref="video" id="video"></video>

    <div id="slot-container">
      <slot></slot>
    </div>
  </div>
  <canvas ref="canvas" id="canvas"></canvas>
</template>

<style lang="scss" scoped>
#camera-container {
  position: relative;
  width: 100%;
  height: 100%;
}

#slot-container {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

#video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}

#canvas {
  display: none;
}
</style>
