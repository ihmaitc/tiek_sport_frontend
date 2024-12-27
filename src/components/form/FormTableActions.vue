<script setup lang="ts">
import i18n from "@/app/config/i18n";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { useNotification } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { CheckboxIcon, ChecksIcon, EyeIcon, FilePlusIcon, PencilIcon, SendIcon, TrashIcon, XIcon, XboxXIcon } from "vue-tabler-icons";
import { useAuth } from "@/app/config/store/auth";
import { IModalProps, ITableActions } from "@/models/basic";

interface IProps {
  permission?: string;
  item: any;
  service?: any;
  actions?: ITableActions;
  showStatusActions?: boolean;
  customFilter?: any;
}
const auth = useAuth();
const props = defineProps<IProps>();
const emits = defineEmits<{
  (e: "refresh"): void;
  (e: "edit", item: any, options?: any): void;
  (e: "view", item: any): void;
}>();
const { setError } = useErrorToast();
const notify = useNotification();
const selectedDeleteItem = ref<number>(0);
const deleteModal = ref<boolean>(false);
const isModal = ref<boolean>(false);
const statusLoading = ref<boolean>(false);

const openDeleteModal = (item: any) => {
  selectedDeleteItem.value = item.id;
  deleteModal.value = true;
};

const edit = (item: any) => {
  emits("edit", item);
};
const clone = (item: any) => {
  emits("edit", item, {
    query: {
      clone: "true"
    }
  });
};
const view = (item: any) => {
  emits("view", item);
};
interface ICustomModalProps extends IModalProps {
  item: any;
}

const isModalProps = ref<ICustomModalProps>({
  cb: "",
  id: null,
  title: "",
  item: {}
});

const openModal = ({ title, id, cb }: { title: string; id: number; cb: string }) => {
  isModalProps.value.title = title;
  isModalProps.value.id = id;
  isModalProps.value.cb = cb;
  // isModalProps.value.item = item;
  isModal.value = true;
};

const sentRequest = (cb: string) => {
  if (isModalProps.value.id) {
    statusLoading.value = true;
    // @ts-ignore
    props.service[cb]({ id: isModalProps.value.id, ...props.customFilter })
      .then(() => {
        isModal.value = false;
        notify.notify({
          // @ts-ignore
          text: i18n.global.t("successfullyChanged"),
          type: "success",
          closeOnClick: true
        });
        emits("refresh");
      })
      .catch((e: any) => {
        setError(e);
        isModal.value = false;
        emits("refresh");
      })
      .finally(() => {
        statusLoading.value = false;
      });
  }
};

const deleteItem = () => {
  statusLoading.value = true;
  props.service
    .Delete(selectedDeleteItem.value)
    .then(() => {
      deleteModal.value = false;
      notify.notify({
        // @ts-ignore
        text: i18n.global.t("DeleteSuccess"),
        type: "success"
      });
      emits("refresh");
    })
    .catch((err: any) => {
      setError(err);
      deleteModal.value = false;
      emits("refresh");
    })
    .finally(() => {
      statusLoading.value = false;
    });
};

const isShow = ({ action, permission, itemAction }: { action?: boolean; permission: boolean; itemAction?: boolean }): boolean | undefined => {
  if (typeof itemAction === "boolean") {
    return itemAction;
  } else {
    if (action && permission) {
      return true;
    }
    if (!action || !permission) {
      return false;
    }
  }
  return true;
};
</script>

<template>
  <div>
    <div class="text-center d-flex align-center flex-wrap justify-center">
      <VMenu v-bind="$attrs" :closeOnContentClick="false">
        <template #activator="{ props }">
          <VBtn variant="text" size="small" v-bind="props" icon="mdi-dots-vertical"> </VBtn>
        </template>
        <v-list class="pa-2">
          <slot name="Edit" :openModal="openModal" :ability="auth" :isShow="isShow">
            <v-list-item
              :value="'edit'"
              v-if="
                isShow({
                  action: actions?.isEdit,
                  permission: auth.can(`${permission}Edit`),
                  itemAction: item.canEdit
                })
              "
              @click="edit(item)"
            >
              <div class="align-center d-flex gap-2 cursor-pointer">
                <PencilIcon color="rgb(var(--v-theme-info))" size="16" />
                <span class="text-13"> {{ $t("Edit") }}</span>
              </div>
            </v-list-item>
          </slot>
          <slot name="View" :openModal="openModal" :ability="auth" :isShow="isShow">
            <v-list-item
              :value="'view'"
              v-if="
                (auth.can(`${permission}View`) ||
                  auth.can(`${permission}ViewAll`) ||
                  auth.can(`${permission}ViewByDistrict`) ||
                  auth.can(`${permission}ViewByRegion`)) &&
                actions?.isView
              "
              @click="view(item)"
            >
              <div class="align-center d-flex gap-2 cursor-pointer">
                <EyeIcon size="16" />
                <span class="text-13"> {{ $t("View") }}</span>
              </div>
            </v-list-item>
          </slot>
          <slot name="Delete" :openModal="openModal" :ability="auth" :isShow="isShow">
            <v-list-item
              :value="'Delete'"
              v-if="
                isShow({
                  action: actions?.isDelete,
                  permission: auth.can(`${permission}Delete`),
                  itemAction: item.canDelete
                })
              "
              @click="openDeleteModal(item)"
            >
              <div class="align-center d-flex gap-2 cursor-pointer">
                <TrashIcon size="16" color="rgb(var(--v-theme-error))" />
                <span class="text-13"> {{ $t("Delete") }}</span>
              </div>
            </v-list-item>
          </slot>
          <slot name="Clone" :openModal="openModal" :ability="auth" :isShow="isShow">
            <v-list-item v-if="actions?.isClone" :value="'Clone'" @click="clone(item)">
              <div class="align-center d-flex gap-2 cursor-pointer">
                <FilePlusIcon size="16" />
                <span class="text-13"> {{ $t("clone") }}</span>
              </div>
            </v-list-item>
          </slot>
          <slot name="Approve" :openModal="openModal" :ability="auth" :isShow="isShow">
            <v-list-item
              v-if="
                isShow({
                  action: actions?.canApprove,
                  permission: auth.can(`${permission}Approve`),
                  itemAction: item.canApprove
                }) && showStatusActions
              "
              :value="'Approve'"
              @click="
                openModal({
                  title: 'Approve',
                  id: item.id,
                  cb: 'Approve'
                })
              "
            >
              <div class="align-center d-flex gap-2 cursor-pointer">
                <CheckboxIcon size="16" color="#05b187" />
                <span class="text-13"> {{ $t("Approve") }}</span>
              </div>
            </v-list-item>
          </slot>
          <slot name="Accept" :openModal="openModal" :ability="auth" :isShow="isShow">
            <v-list-item
              :value="'Accept'"
              @click="
                openModal({
                  title: 'Accept',
                  id: item.id,
                  cb: 'Accept'
                })
              "
              v-if="
                isShow({
                  action: actions?.canAccept,
                  permission: auth.can(`${permission}Accept`),
                  itemAction: item.canAccept
                }) && showStatusActions
              "
            >
              <div class="align-center d-flex gap-2 cursor-pointer">
                <ChecksIcon size="16" color="#05b187" />
                <span class="text-13"> {{ $t("Accept") }}</span>
              </div>
            </v-list-item>
          </slot>
          <slot name="Cancel" :openModal="openModal" :ability="auth" :isShow="isShow">
            <v-list-item
              :value="'Cancel'"
              @click="
                openModal({
                  title: 'Cancel',
                  id: item.id,
                  cb: 'Cancel'
                })
              "
              v-if="
                isShow({
                  action: actions?.canCancel,
                  permission: auth.can(`${permission}Cancel`),
                  itemAction: item.canCancel
                }) && showStatusActions
              "
            >
              <div class="align-center d-flex gap-2 cursor-pointer">
                <XIcon size="16" color="rgb(var(--v-theme-error))" />
                <span class="text-13"> {{ $t("Cancel") }}</span>
              </div>
            </v-list-item>
          </slot>
          <slot name="Reject" :openModal="openModal" :ability="auth" :isShow="isShow">
            <v-list-item
              :value="'Reject'"
              v-if="
                isShow({
                  action: actions?.canReject,
                  permission: auth.can(`${permission}Reject`),
                  itemAction: item.canReject
                }) && showStatusActions
              "
              @click="
                openModal({
                  title: 'Reject',
                  id: item.id,
                  cb: 'Reject'
                })
              "
            >
              <div class="align-center d-flex gap-2 cursor-pointer">
                <XboxXIcon size="16" color="rgb(var(--v-theme-error))" />
                <span class="text-13"> {{ $t("Reject") }}</span>
              </div>
            </v-list-item>
          </slot>
          <slot name="Sent" :openModal="openModal" :ability="auth" :isShow="isShow">
            <v-list-item
              :value="'Sent'"
              v-if="
                isShow({
                  action: actions?.canSent,
                  permission: auth.can(`${permission}Sent`),
                  itemAction: item.canSent
                }) && showStatusActions
              "
              @click="
                openModal({
                  title: 'Sent1',
                  id: item.id,
                  cb: 'Sent'
                })
              "
            >
              <div class="align-center d-flex gap-2 cursor-pointer">
                <SendIcon size="16" color="rgb(var(--v-theme-info))" />
                <span class="text-13"> {{ $t("Sent1") }}</span>
              </div>
            </v-list-item>
          </slot>
          <slot name="action" :isShow="isShow" :ability="auth" :openModal="openModal"></slot>
          <!-- <v-list-item>
          </v-list-item> -->
        </v-list>
      </VMenu>
    </div>
    <slot name="outAction" :isShow="isShow" :ability="auth" :openModal="openModal" :sentRequest="sentRequest"></slot>
    <!-- MODALS -->
    <v-dialog v-model="deleteModal" width="300">
      <v-card>
        <v-card-text>
          {{ $t("wantDelete") }}
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn :loading="statusLoading" color="error" variant="flat" block @click="deleteModal = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :loading="statusLoading" color="success" variant="flat" block @click="deleteItem">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isModal" width="300">
      <v-card class="mx-2 my-2">
        <v-card-title>{{ $t(`${isModalProps.title}`) }}</v-card-title>
        <v-card-text class="py-0">
          <slot name="modal-text" :isModalProps="isModalProps"> ID: {{ isModalProps.id }} </slot>
          <!-- ID: {{ isModalProps.id }}  -->
        </v-card-text>

        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn :loading="statusLoading" color="error" variant="flat" block @click="isModal = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn :loading="statusLoading" color="success" variant="flat" block @click="sentRequest(isModalProps.cb)">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
