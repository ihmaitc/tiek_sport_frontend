<script setup lang="ts">
import { DoorExitIcon } from "vue-tabler-icons";
import { useAuth } from "../../store/auth";
import { useRouter } from "vue-router";
const authStore = useAuth();
const router = useRouter();

function Logout() {
  localStorage.clear();
  router.push({ name: "auth-login" });
}
</script>

<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-row class="align-center">
        <v-col>
          <v-btn class="custom-hover-primary" variant="text" v-bind="props" icon>
            <v-avatar size="35">
              <img src="@/assets/images/profile.jpg" width="35" alt="Julia" />
            </v-avatar>

            <v-tooltip activator="parent" location="top">
              {{ $t("changeProfile") }}
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <v-sheet rounded="md" class="sheet" max-width="450" elevation="10" style="margin-top: 10px">
      <div class="px-8 pt-6" v-if="authStore.user">
        <h6 class="text-h5 font-weight-medium">{{ authStore.user?.userName }}</h6>
        <div class="d-flex align-center mt-4 pb-6">
          <div class="ml-3">
            <h6 class="text-h6 mb-n1">
              {{ authStore.user?.fullName }}
            </h6>
            <h6 class="text-subtitle-1 mt-2 text-grey200 font-weight-regular textSecondary">
              {{ authStore.user?.organization }}
            </h6>
          </div>
        </div>
        <v-divider></v-divider>
      </div>
      <v-col md="5" sm="12" class="pt-4 pb-3 px-4 text-center ml-auto">
        <v-btn color="primary" variant="flat" block @click="Logout">
          <DoorExitIcon size="20" style="margin-right: 20px" />
          {{ $t("Logout") }}
        </v-btn>
      </v-col>
    </v-sheet>
  </v-menu>
</template>
<style lang="scss" scoped>
.sheet {
  width: 28.125rem !important;
  @media screen and (max-width: 600px) {
    width: 100% !important;
  }
}
</style>
