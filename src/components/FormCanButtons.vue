<script setup lang="ts">
import i18n from "@/app/config/i18n";
import { useAuth } from "@/app/config/store/auth";
import { IModalProps, DefaultGetData } from "@/models/basic";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface IProps {
  service: any;
  data: DefaultGetData;
  permission: string;
  customFilter?: any;
}

const props = defineProps<IProps>();
const router = useRouter();
const { setError } = useErrorToast();

const auth = useAuth();
const isModal = ref<boolean>(false);
const statusLoading = ref<boolean>(false);
const isModalProps = ref<IModalProps>({
  cb: "",
  id: null,
  title: "",
  ...props.customFilter
});

const openModal = ({ title, id, cb }: { title: string; id: number; cb: string }) => {
  isModalProps.value.title = title;
  isModalProps.value.id = id;
  isModalProps.value.cb = cb;
  isModal.value = true;
};

const sentRequest = (cb: string) => {
  if (isModalProps.value.id) {
    statusLoading.value = true;
    props.service[cb]({
      id: isModalProps.value.id,
      ...props.customFilter
    })
      .then(() => {
        isModal.value = false;
        router.back();
        notify({
          text: i18n.global.t("successfullyChanged"),
          type: "success"
        });
      })
      .catch((e: any) => {
        setError(e);
      })
      .finally(() => {
        statusLoading.value = false;
      });
  }
};
</script>

<template>
  <div class="mt-4 px-3">
    <v-row class="align-center" style="gap: 10px">
      <div v-if="data">
        <slot :openModal="openModal" :ability="auth" name="Back">
          <v-btn class="mr-4" color="error" @click="router.back" variant="flat">
            {{ $t("Back") }}
          </v-btn>
        </slot>
      </div>
      <div>
        <slot :openModal="openModal" :ability="auth" name="Reject">
          <v-btn
            color="error"
            @click="
              openModal({
                title: 'Reject',
                id: data.id,
                cb: 'Reject'
              })
            "
            variant="flat"
            v-if="data?.canReject && auth.can(`${permission}Reject`)"
          >
            {{ $t("Reject") }}
          </v-btn>
        </slot>
      </div>
      <v-spacer />
      <div>
        <slot :openModal="openModal" :ability="auth" name="Accept">
          <v-btn
            v-if="data?.canAccept && auth.can(`${permission}Accept`)"
            color="success"
            class="mr-4"
            @click="
              openModal({
                title: 'Accept',
                id: data.id,
                cb: 'Accept'
              })
            "
            variant="flat"
          >
            {{ $t("Accept") }}
          </v-btn>
        </slot>
      </div>
      <div>
        <slot :openModal="openModal" :ability="auth" name="Approve">
          <v-btn
            v-if="data?.canApprove && auth.can(`${permission}Approve`)"
            color="success"
            class="mr-4"
            @click="
              openModal({
                title: 'Approve',
                id: data.id,
                cb: 'Approve'
              })
            "
            variant="flat"
          >
            {{ $t("Approve") }}
          </v-btn>
        </slot>
      </div>
      <div>
        <slot :openModal="openModal" :ability="auth" name="Cancel">
          <v-btn
            v-if="data?.canCancel && auth.can(`${permission}Cancel`)"
            color="error"
            class="mr-4"
            @click="
              openModal({
                title: 'Cancel',
                id: data.id,
                cb: 'Cancel'
              })
            "
            variant="flat"
          >
            {{ $t("Cancel") }}
          </v-btn>
        </slot>
      </div>
      <div>
        <slot :openModal="openModal" :ability="auth" name="Sent">
          <v-btn
            color="info"
            @click="
              openModal({
                title: 'Sent1',
                id: data.id,
                cb: 'Sent'
              })
            "
            variant="flat"
            v-if="data?.canSent && auth.can(`${permission}Sent`)"
          >
            {{ $t("Sent1") }}
          </v-btn>
        </slot>
      </div>
      <slot :openModal="openModal" :sentRequest="sentRequest" :data="data" :auth="auth"></slot>
    </v-row>
    <!-- MODAL -->
    <v-dialog v-model="isModal" width="300">
      <v-card class="mx-2 my-2">
        <v-card-title>{{ $t(`${isModalProps.title}`) }}</v-card-title>
        <v-card-text class="py-0">
          <slot name="modal-text" :isModalProps="isModalProps"> ID: {{ isModalProps.id }} </slot>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn color="error" variant="flat" block @click="isModal = false">
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="success" variant="flat" block :loading="statusLoading" @click="sentRequest(isModalProps.cb)">
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
