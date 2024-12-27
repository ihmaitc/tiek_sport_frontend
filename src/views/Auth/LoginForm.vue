<script setup lang="ts">
import FormPhoneNumber from "@/components/form/FormPhoneNumber.vue";
import { ref } from "vue";
import { ILogin } from "./types";
import AccountService from "@/services/others/account.service";
import { SubmitEventPromise } from "vuetify";
import { ISelectList } from "@/models/basic";
import RegionService from "@/services/info/region.service";
import DistrictService from "@/services/info/district.service";
import MfyService from "@/services/info/mfy.service";
import UserTypeService from "@/services/managment/usertype.service";
import ApiService from "@/services/api.service";
import { useAuth } from "@/app/config/store/auth";
import { useRouter } from "vue-router";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { ArrowRightIcon, DownloadIcon, XIcon } from "vue-tabler-icons";

const router = useRouter();
const { setError } = useErrorToast();
const auth = useAuth();

const isNewUser = ref(false);
const isRegisteredUser = ref(false);
const personLoading = ref(false);
const loading = ref(false);
const userInfoModal = ref(false);

const personData = ref<any>(null);
const userTypeId = ref<number | null>(null);
const userTypeList = ref<ISelectList[]>([]);
const regionSelectList = ref<ISelectList[]>([]);
const districtSelectList = ref<ISelectList[]>([]);
const mfySelectList = ref<ISelectList[]>([]);
const temporaryDistrictSelectList = ref<ISelectList[]>([]);
const temporaryMfySelectList = ref<ISelectList[]>([]);
const downloadUrl = "/ihma.apk";
const isReqSended = ref(false);

const requestHeader = ref<any>({
  "Request-Id": ""
});

const login = ref<ILogin>({
  userName: "",
  password: ""
});

const filter = ref({
  Seria: "",
  Number: "",
  DateOfBirth: ""
});

const checkToRegister = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (valid) {
    isNewUser.value = false;
    isRegisteredUser.value = false;
    isReqSended.value = false;
    AccountService.IsUserRegistered({
      phoneNumber: login.value.userName
    })
      .then((res) => {
        requestHeader.value["Request-Id"] = res.data.requestId;
        if (res.data.success) {
          isRegisteredUser.value = true;
          isNewUser.value = false;
        } else {
          isRegisteredUser.value = false;
          isNewUser.value = true;
          userInfoModal.value = true;

          fetchUserType();
          fetchRegions();
        }
      })
      .catch((e) => {
        isNewUser.value = false;
        isRegisteredUser.value = false;
        userInfoModal.value = false;
        setError(e);
      })
      .finally(() => {
        loading.value = false;
        isReqSended.value = true;
      });
  }
};

const onInput = () => {
  isNewUser.value = false;
  isRegisteredUser.value = false;
  isReqSended.value = false;
};

const Login = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    loading.value = true;
    AccountService.Login(login.value, requestHeader.value)
      .then((res) => {
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("user_info", JSON.stringify(res.data.user));

        auth.LogIn(res.data);

        ApiService.setHeader();
        router.push({ name: "Dashboard" });
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const Registration = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    loading.value = true;
    const appData = {
      userTypeId: userTypeId.value,
      phoneNumber: login.value.userName,
      userName: login.value.userName,
      password: login.value.password,
      person: personData.value
    };

    personData.value.isTemporary = true;
    AccountService.Registrate(appData, requestHeader.value)
      .then((res) => {
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("user_info", JSON.stringify(res.data.user));
        ApiService.setHeader();
        auth.LogIn(res.data);

        router.push({ name: "Dashboard" });
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const GetPerson = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    personLoading.value = true;
    AccountService.GetByPassportData(filter.value.Seria.toUpperCase(), filter.value.Number, filter.value.DateOfBirth)
      .then((res) => {
        personData.value = res.data;
        login.value.password = res.data.pinfl;

        if (personData.value.livingRegionId) {
          fetchLivingDistrict(personData.value.livingRegionId);
        }
        if (personData.value.livingDistrictId) {
          fetchLivingMfy(personData.value.livingDistrictId);
        }
        if (personData.value.temporaryRegionId) {
          fetchTemporaryDistrict(personData.value.temporaryRegionId);
        }
        if (personData.value.temporaryDistrictId) {
          fetchTemporaryMfy(personData.value.temporaryDistrictId);
        }
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        personLoading.value = false;
      });
  }
};

/* fetch selects */
const fetchUserType = () => {
  UserTypeService.GetAsSelectList().then((res) => {
    userTypeList.value = res.data;
  });
};
function fetchRegions() {
  RegionService.GetAsSelectList().then((res) => {
    regionSelectList.value = res.data;
  });
}
function setLivingRegion(val: number | string) {
  personData.value.livingDistrictId = null;
  personData.value.livingMfyId = null;
  mfySelectList.value = [];
  districtSelectList.value = [];
  DistrictService.GetAsSelectList(val).then((res) => {
    districtSelectList.value = res.data;
  });
}
function fetchLivingDistrict(val: number | string) {
  DistrictService.GetAsSelectList(val).then((res) => {
    districtSelectList.value = res.data;
  });
}
function setLivingDistrict(val: number | string) {
  personData.value.livingMfyId = null;
  mfySelectList.value = [];
  MfyService.GetAsSelectList(val).then((res) => {
    mfySelectList.value = res.data;
  });
}
function fetchLivingMfy(val: number | string) {
  MfyService.GetAsSelectList(val).then((res) => {
    mfySelectList.value = res.data;
  });
}
function fetchTemporaryDistrict(val: number | string) {
  DistrictService.GetAsSelectList(val).then((res) => {
    temporaryDistrictSelectList.value = res.data;
  });
}
function setTemporaryRegion(val: number | string) {
  personData.value.temporaryDistrictId = null;
  personData.value.temporaryMfyId = null;
  temporaryMfySelectList.value = [];
  temporaryDistrictSelectList.value = [];
  DistrictService.GetAsSelectList(val).then((res) => {
    temporaryDistrictSelectList.value = res.data;
  });
}
function fetchTemporaryMfy(val: number | string) {
  MfyService.GetAsSelectList(val).then((res) => {
    temporaryMfySelectList.value = res.data;
  });
}
function setTemporaryDistrict(val: number | string) {
  personData.value.temporaryMfyId = null;
  temporaryMfySelectList.value = [];
  MfyService.GetAsSelectList(val).then((res) => {
    temporaryMfySelectList.value = res.data;
  });
}
</script>

<template>
  <div class="auth-wrapper">
    <v-row class="auth-inner">
      <v-col lg="8" class="d-none d-lg-flex" style="background-color: #f5f9ff">
        <div class="w-100 d-lg-flex align-center justify-content-center px-5">
          <img width="100%" src="@/assets/images/login.svg" alt="" />
        </div>
      </v-col>
      <v-col lg="4" class="d-flex align-center auth-bg px-2 p-lg-5">
        <v-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">
          <v-card-title class="font-weight-bold mb-1 px-0">
            <h2>{{ $t("auth") }}</h2>
          </v-card-title>

          <v-form @submit.prevent="Login">
            <v-form @submit.prevent="checkToRegister">
              <FormPhoneNumber @update:model-value="onInput" :label="$t('username')" required v-model:model-value="login.userName">
                <template #append>
                  <v-btn type="submit" color="info" :icon="ArrowRightIcon"> </v-btn>
                </template>
              </FormPhoneNumber>
            </v-form>
            <form-input required v-if="isRegisteredUser" v-model="login.password" :label="$t('pinfl')" />

            <a :href="`${downloadUrl}`" class="d-flex align-center">
              <DownloadIcon color="rgb(var(--v-theme-info))" size="20" />
              <span style="margin-right: 2px; font-size: 18px"></span>
              <span class="text-info" style="font-size: 18px">{{ $t("downloadApk") }}</span></a
            >
            <v-btn v-if="isReqSended" type="submit" color="success" :loading="loading" block class="mt-4"> {{ $t("signIn") }} </v-btn>
          </v-form>

          <v-dialog width="90%" v-model:model-value="userInfoModal">
            <v-card>
              <v-card-title class="pa-0">
                <v-toolbar rounded color="info">
                  <v-row class="align-center px-8">
                    <v-col cols="auto">
                      <h3>{{ $t("userInfo") }}</h3>
                    </v-col>
                    <v-spacer />
                    <v-col
                      cols="auto"
                      @click="
                        () => {
                          userInfoModal = false;
                          isReqSended = false;
                        }
                      "
                    >
                      <v-btn :icon="XIcon" />
                    </v-col>
                  </v-row>
                </v-toolbar>
              </v-card-title>
              <v-card-text>
                <v-form @submit.prevent="GetPerson">
                  <v-row class="align-center">
                    <v-col cols="12" md="6" lg="6">
                      <form-input :mask="'AA'" required v-model:model-value="filter.Seria" :label="$t('passportParams.docSeries')"> </form-input>
                    </v-col>
                    <v-col cols="12" md="6" lg="6">
                      <form-input mask="#######" required v-model:model-value="filter.Number" :label="$t('passportParams.documentNumber')">
                      </form-input>
                    </v-col>
                    <v-col cols="12" md="6" lg="6">
                      <form-picker required v-model:model-value="filter.DateOfBirth" :label="$t('passportParams.birthOn')"> </form-picker>
                    </v-col>
                    <v-col cols="12" md="6" lg="6">
                      <v-btn type="submit" :loading="personLoading" color="success"> {{ $t("Search") }} </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
                <div style="height: 100px"></div>
                <v-form @submit.prevent="Registration" v-if="personData">
                  <v-row v-if="personData">
                    <v-col sm="12" md="12" class="text-left">
                      <h3>
                        {{ `${personData.surnameLatin} ${personData.nameLatin} ${personData.patronymLatin}` }}
                      </h3>
                    </v-col>
                    <v-col sm="12" md="6" class="text-left">
                      <v-card elevation="0" class="border">
                        <v-list>
                          <v-list-item>
                            <div style="display: flex; justify-content: space-between">
                              <b>{{ $t("passportParams.birthOn") }}</b>
                              <span>{{ personData.birthDate ? String(personData.birthDate).split(" ")[0] : personData.birthDate }}</span>
                            </div>
                          </v-list-item>
                          <v-list-item>
                            <div style="display: flex; justify-content: space-between">
                              <b>{{ $t("passportData.nationalityName") }}</b>
                              <span>{{ personData.nationalityName }}</span>
                            </div>
                          </v-list-item>
                          <v-list-item>
                            <div style="display: flex; justify-content: space-between">
                              <b>{{ $t("passportData.genderName") }}</b>
                              <span>{{ personData.genderName }}</span>
                            </div>
                          </v-list-item>
                          <v-list-item>
                            <div style="display: flex; justify-content: space-between">
                              <b>{{ $t("passportParams.docSeries") }}</b>
                              <span>{{ personData.passportSeria }}</span>
                            </div>
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-col>

                    <v-col sm="12" md="6" class="text-left">
                      <v-card elevation="0" class="border">
                        <v-list>
                          <v-list-item>
                            <div style="display: flex; justify-content: space-between">
                              <b>{{ $t("passportParams.documentNumber") }}</b>
                              <span>{{ personData.passportNumber }}</span>
                            </div>
                          </v-list-item>
                          <v-list-item>
                            <div style="display: flex; justify-content: space-between">
                              <b>{{ $t("passportData.docIssueOn") }}</b>
                              <span>
                                {{ personData.passportDate ? String(personData.passportDate).split(" ")[0] : personData.passportDate }}
                              </span>
                            </div>
                          </v-list-item>
                          <v-list-item>
                            <div style="display: flex; justify-content: space-between">
                              <b>{{ $t("passportData.docExpireOn") }}</b>
                              <span>
                                {{
                                  personData.passportExpiration ? String(personData.passportExpiration).split(" ")[0] : personData.passportExpiration
                                }}
                              </span>
                            </div>
                          </v-list-item>

                          <v-list-item>
                            <div style="display: flex; justify-content: space-between">
                              <b>{{ $t("pinfl") }}</b>
                              <span>{{ personData.pinfl }}</span>
                            </div>
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-col>
                  </v-row>

                  <h2 class="my-2">{{ $t("livingAddress") }}</h2>

                  <v-row>
                    <v-col sm="12" md="4">
                      <form-select
                        :list="regionSelectList"
                        v-model="personData.livingRegionId"
                        :label="$t('livingRegion')"
                        required
                        @update:model-value="setLivingRegion"
                      >
                      </form-select>
                    </v-col>

                    <v-col sm="12" md="4">
                      <form-select
                        :list="districtSelectList"
                        v-model="personData.livingDistrictId"
                        :label="$t('livingDistrict')"
                        required
                        @update:model-value="setLivingDistrict"
                      >
                      </form-select>
                    </v-col>
                    <v-col sm="12" md="4">
                      <form-select :list="mfySelectList" v-model="personData.livingMfyId" required :label="$t('livingMfy')"> </form-select>
                    </v-col>
                  </v-row>

                  <!-- <v-row class="my-2">
                    <v-col>
                      <form-checkbox v-model="personData.isTemporary" :label="$t('isTemporary')">
                        {{ $t("isTemporary") }}
                      </form-checkbox>
                    </v-col>
                  </v-row> -->

                  <h2 class="my-2">
                    {{ $t("temporaryAddress") }}
                  </h2>

                  <v-row>
                    <v-col sm="12" md="4">
                      <form-select
                        :list="regionSelectList"
                        v-model="personData.temporaryRegionId"
                        :label="$t('temporaryRegion')"
                        required
                        @update:model-value="setTemporaryRegion"
                      >
                      </form-select>
                    </v-col>

                    <v-col sm="12" md="4">
                      <form-select
                        :list="temporaryDistrictSelectList"
                        v-model="personData.temporaryDistrictId"
                        :label="$t('temporaryDistrict')"
                        required
                        @update:model-value="setTemporaryDistrict"
                      >
                      </form-select>
                    </v-col>
                    <v-col sm="12" md="4">
                      <form-select :list="temporaryMfySelectList" v-model="personData.temporaryMfyId" required :label="$t('temporaryMfy')">
                      </form-select>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12">
                      <form-select :list="userTypeList" :label="$t('userType')" v-model="userTypeId" required> </form-select>
                    </v-col>
                  </v-row>

                  <v-row class="align-center justify-center mt-4">
                    <v-btn type="submit" color="success"> {{ $t("SignUp") }} </v-btn>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-col>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss">
.auth-wrapper {
  .v-field__append-inner,
  .v-field__clearable,
  .v-field__prepend-inner {
    padding-top: 0;
    align-items: center;
  }
}
</style>

<style scoped lang="scss">
.auth-wrapper {
  display: flex;
  flex-basis: 100%;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  width: 100%;

  .auth-inner {
    height: 100vh;
    overflow-y: auto; // For v2 scroll for long auth form
    height: calc(var(--vh, 1vh) * 100);
  }

  .brand-logo {
    position: absolute;
    top: 2rem;
    left: 2rem;
    margin: 0;
    z-index: 1;
  }
}
</style>
