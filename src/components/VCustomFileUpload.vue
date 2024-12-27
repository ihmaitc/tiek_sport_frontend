<script setup lang="ts">
import { useGlobal } from "@/composables/useGlobal";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import { AxiosError, AxiosResponse } from "axios";
import { computed, ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";
import { VInput } from "vuetify/lib/components/index.mjs";

interface IProps {
  required?: boolean;
  rules?: any[];
  showSize?: boolean;
  label?: string;
  placeholder?: string;
  fileName?: string;
  formDataKey?: string;
  size?: string;
  maxSize?: number;
  files: any[];
  id?: string;
  exstension?: string[];
  hide?: boolean;
  canDelete?: boolean;
  multiple?: boolean;
  isView?: boolean;
  isAny?: boolean;
  uploadOptions?: any;
  service: any;
  maxFileCount?: number;
  minFileCount?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: null,
  label: "",
  showSize: true,
  canDelete: true,
  fileName: "fileName",
  formDataKey: "files",
  id: "pic1",
  multiple: false,
  minFileCount: 1
});

const emits = defineEmits(["downloadFile", "deleteFile", "update:files", "update:required"]);

const { label, required, files, rules, isAny, exstension, service, formDataKey, maxSize, uploadOptions, maxFileCount, multiple, minFileCount } =
  toRefs(props);

const { setError } = useErrorToast();
const { forceFileDownload } = useGlobal();

const fileRef = ref<HTMLInputElement | null>(null);
const loading = ref(false);
const customRules = ref<any>([]);
const loadedFiles = ref<any[]>([]);

const { t } = useI18n();

const getFiles = computed(() => {
  loadedFiles.value = files.value;
  return files.value;
});

const normalizedRequire = computed(() => required.value);

const normalizedLabel = computed(() => {
  return (normalizedRequire.value ? t(label.value!) + " <span class='text-error ml-1' > * </span> " : t(label.value!)) as string;
});

const extension = computed(() => {
  let t: string = "";
  if (exstension.value) {
    t = exstension.value.map((el) => el).join(",");
  }
  return t;
});

const rules2: any[] = [
  (val: any[]) => {
    if (val?.length == 0) {
      return t("fieldNotEmpty");
    }

    if (maxFileCount.value && val?.length > maxFileCount.value) {
      return t("maxFileCount", { count: maxFileCount.value });
    }

    if (minFileCount.value && val?.length && val?.length < minFileCount.value) {
      return t("minFileCount", { count: minFileCount.value });
    }

    return true;
  }
];

const setRules = () => {
  if (isAny.value) {
    emits("update:required", true);
    customRules.value = [
      (v: any) => {
        if (v?.length) return true;
        return t("eachFileMustUpload");
      }
    ];
    return;
  } else {
    if (props.required) {
      customRules.value = [rules2].flat();

      if (props.rules && props.rules.length > 0) {
        customRules.value = [props.rules, rules2].flat();
        return;
      }
    } else {
      customRules.value = [];
    }
  }
};

const openInput = () => {
  if (fileRef.value) {
    fileRef.value.click();
  }
};

const updateFile = (event: Event, vInputSlot: Partial<typeof VInput>) => {
  const file = (event.target as HTMLInputElement).files || [];
  if (maxSize.value && checkFileSize(event)) {
    if (fileRef.value) {
      fileRef.value.value = "";
    }
    return;
  }

  if (extension.value?.length && checkFileTypeMatch(event)) {
    if (fileRef.value) {
      fileRef.value.value = "";
    }
    return;
  }

  if (file.length) {
    loading.value = true;
    const formData = new FormData();
    const file = (event.target as HTMLInputElement).files || [];
    if (formDataKey.value.length) {
      formData.append(formDataKey.value, file[0]);
      previewFiles(formData, vInputSlot);
    }
  }
};

const previewFiles = async (formData: FormData, vInputSlot: Partial<typeof VInput>) => {
  try {
    loading.value = true;
    service.value
      .UploadFile(formData)
      .then((res: AxiosResponse) => {
        const obj = {
          id: res.data.fileId,
          fileName: res.data.fileName,
          fileSize: res.data.fileSize,
          ...uploadOptions.value
        };

        if (multiple.value) {
          emits("update:files", [...getFiles.value, obj]);
          loadedFiles.value.push(obj);
        } else {
          emits("update:files", [obj]);
          loadedFiles.value = [obj];
        }

        if (vInputSlot) {
          vInputSlot.validate();
        }

        if (fileRef.value) {
          fileRef.value.value = "";
        }
      })
      .catch((e: AxiosError) => {
        setError(e);
      })
      .finally(() => {
        loading.value = false;
      });
  } catch (e) {
    console.log("file", e);
  }
};

const checkFileTypeMatch = (event: Event) => {
  if (!exstension.value) return;
  const files = (event.target as HTMLInputElement).files;
  const isFileTypeMatch = exstension.value.some((item) => item === files?.[0]?.type);

  if (!isFileTypeMatch) {
    notify({
      text: t("typeNotMatched"),
      type: "warn"
    });

    if (fileRef.value) {
      fileRef.value.value = "";
    }

    return;
  }

  return false;
};

const checkFileSize = (event: Event) => {
  const limitedSize = (event.target as HTMLInputElement).size;
  const files = (event.target as HTMLInputElement).files;

  if (files && limitedSize) {
    if (files[0].size > limitedSize) {
      notify({
        text: t("brokenLimitedSize", {
          size: (limitedSize / 1024 / 1024).toFixed(2)
        }),
        type: "warn"
      });

      if (fileRef.value) {
        fileRef.value.value = "";
      }
      return;
    }
  }
  return false;
};

const deleteFile = (event: Event, index: number, vInputSlot: Partial<typeof VInput>) => {
  event.stopImmediatePropagation();
  getFiles.value.splice(index, 1);
  emits("update:files", getFiles.value);

  if (vInputSlot) {
    vInputSlot.isValid = false;
  }

  if (vInputSlot) {
    vInputSlot.validate();
  }

  if (fileRef.value) {
    fileRef.value.value = "";
  }
};

const downloadFile = (file: any) => {
  if (file) {
    service.value.DownloadFile(file.id).then((res: AxiosResponse) => {
      forceFileDownload(res, file.fileName);
    });
  }
};

const isSetFile = () => {
  if (multiple.value) {
    if (maxFileCount.value) {
      return getFiles.value.length < maxFileCount.value;
    }
    return true;
  } else {
    return getFiles.value.length == 0;
  }
};

watch(
  () => [required.value, rules.value, files.value],
  () => {
    setRules();
  },
  { immediate: true }
);
</script>

<template>
  <div class="files">
    <v-label for="" class="ml-10 mb-2 font-weight-black" v-html="normalizedLabel"> </v-label>
    <v-input :rules="customRules" v-model:model-value="loadedFiles">
      <template #default="vInputProps">
        <div class="file">
          <div class="prepend">
            <slot name="prepend">
              <v-icon> mdi-file </v-icon>
            </slot>
          </div>
          <!-- {{ vInputProps }} -->
          <div
            class="controls align-center border px-2"
            :class="[
              {
                ['border-success']: vInputProps.isValid.value
              }
            ]"
            @click="openInput"
          >
            <div class="field w-100" v-if="!loading">
              <div class="field-field px-2">
                <template v-if="Array.isArray(files)">
                  <template v-for="(file, index) in files" :key="index">
                    <div class="d-flex flex-wrap w-100 align-center chip-container pa-1">
                      <slot name="fileName" :file="file" :index="index">
                        <span
                          class="v-chip flex-wrap h-auto w-100 px-4 v-chip--link text-primary v-chip--density-default v-chip--size-default v-chip--variant-tonal"
                          @click="downloadFile(file)"
                        >
                          <span class="v-chip__overlay"></span>
                          <span class="v-chip__underlay"></span>
                          <div class="v-chip__content">
                            <span class="chip-content w-100">
                              <slot>{{ file[fileName] }}</slot>
                            </span>
                            <slot v-if="canDelete" name="deleteFile" :deleteFile="deleteFile">
                              <button type="button" class="v-chip__close" @click="deleteFile($event, index, vInputProps)">
                                <i class="mdi-close-circle mdi v-icon notranslate v-theme--ORANGE_THEME v-icon--size-x-small" aria-hidden="true"></i>
                              </button>
                            </slot>
                          </div>
                          <slot name="actions" :file="file" :index="index"></slot>
                        </span>
                      </slot>
                      <slot name="fileSlot" :file="file" :index="index"></slot>
                    </div>
                  </template>
                </template>
              </div>
            </div>
            <div v-if="loading" class="field text-center w-100">
              <v-progress-circular indeterminate size="20" class="mr-2" />
            </div>
            <div class="append" v-if="isSetFile()">
              <v-btn color="info" variant="tonal" class="text-none">
                {{ t("selectFile") }}
              </v-btn>
            </div>
          </div>
          <input
            class="input"
            :size="maxSize"
            :accept="extension"
            type="file"
            :id="String(vInputProps.id)"
            ref="fileRef"
            @change="updateFile($event, vInputProps)"
          />
        </div>
      </template>
    </v-input>
  </div>
</template>

<style lang="scss" scoped>
.v-field__outline {
  border: none !important;
}
.input {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.files {
  padding: 4px;
}

.file {
  display: grid;
  grid-template-areas: "prepend control append";
  grid-template-columns: max-content minmax(0, 1fr) max-content;
  grid-template-rows: auto auto;

  align-items: center;
  width: 100%;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;

  .prepend {
    grid-area: prepend;
    margin-inline-end: 16px;
  }
  .controls {
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.4375rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    width: 100%;

    .field {
      position: relative;
      flex: 1 0;
    }
  }

  .append {
    grid-area: append;
  }
}
</style>
