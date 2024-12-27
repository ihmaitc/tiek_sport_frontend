<script setup lang="ts">
import type { IPerson } from "@/models/basic";
import PersonService from "@/services/others/person.service";
import { computed, ref, toRefs } from "vue";

interface IProps {
  person?: IPerson | undefined | null;
  birthOn?: boolean;
  half?: boolean;
  image?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  half: true,
  image: true
});

const { person } = toRefs(props);

const photo = ref<string | null>(null);

const getPersonPhoto = () => {
  PersonService.GetPhotoFromGSP(props.person?.id).then((res) => {
    if (res.data.base64String) {
      photo.value = `data:image/png;base64, ${res.data.base64String}`;
    }
  });
};
if (props.person && props.person.id && !props.person.photo) {
  getPersonPhoto();
}

const getImage = computed(() => {
  return (props.person && props.person.photo && `data:image/png;base64,${props.person.photo}`) || photo.value;
});
</script>

<template>
  <div v-if="person">
    <v-row>
      <v-col lg="2" cols="12" v-if="image">
        <v-img v-if="getImage" :src="getImage" width="150" class="mx-auto" />
        <v-img
          v-if="!getImage"
          rounded="sm"
          width="150"
          class="mx-auto shadow"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ68D1zB62HiAWZAkQpessCgGpmfvJQUX8Rhg&s"
          color="background"
        ></v-img>
      </v-col>
      <v-col :lg="image ? 10 : 12">
        <v-row>
          <!-- LEFT COLLAR -->
          <v-col cols="12" :lg="half ? 6 : 12" density="comfortable">
            <v-card variant="outlined" class="py-2">
              <v-list-item value="wifi" active-color="primary">
                <div class="d-flex align-center">
                  <div class="ml-3">
                    {{ $t("passportData.fullName") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ person.fullName || "-" }}
                  </div>
                </div>
              </v-list-item>
              <v-list-item value="wifi" active-color="primary">
                <div class="d-flex align-center">
                  <div class="ml-3">
                    {{ $t("passportData.birthOn") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ person.birthDate ? String(person.birthDate).split(" ")[0] : "-" }}
                  </div>
                </div>
              </v-list-item>
              <v-list-item value="bluetooth" active-color="primary">
                <div class="d-flex align-center">
                  <div class="ml-3">
                    {{ $t("passportData.nationalityName") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ person.nationalityName || "-" }}
                  </div>
                </div>
              </v-list-item>
              <v-list-item value="bluetooth" active-color="primary">
                <div class="d-flex align-center">
                  <div class="ml-3">
                    {{ $t("passportData.genderName") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ person.genderName || "-" }}
                  </div>
                </div>
              </v-list-item>
              <v-list-item value="bluetooth" active-color="primary">
                <div class="d-flex align-center">
                  <div class="ml-3">
                    {{ $t("passportData.pinfl") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ person.pinfl || "-" }}
                  </div>
                </div>
              </v-list-item>
            </v-card>
          </v-col>
          <v-col cols="12" :lg="half ? 6 : 12">
            <v-card variant="outlined" class="py-2">
              <v-list-item value="bluetooth" active-color="primary">
                <div class="d-flex align-center">
                  <div class="ml-3">
                    {{ $t("citizenship") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ person.citizenshipName || "-" }}
                  </div>
                </div>
              </v-list-item>
              <v-list-item value="bluetooth" active-color="primary">
                <div class="d-flex align-center">
                  <div class="ml-3">
                    {{ $t("region") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ person.livingRegionName || "-" }}
                  </div>
                </div>
              </v-list-item>
              <v-list-item value="bluetooth" active-color="primary">
                <div class="d-flex align-center">
                  <div class="ml-3">
                    {{ $t("district") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ person.livingDistrictName || "-" }}
                  </div>
                </div>
              </v-list-item>
              <v-list-item value="bluetooth" active-color="primary">
                <div class="d-flex align-center">
                  <div class="ml-3">
                    {{ $t("mfy") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ person.livingMfyName || "-" }}
                  </div>
                </div>
              </v-list-item>
              <v-list-item value="bluetooth" active-color="primary">
                <div class="d-flex align-center">
                  <div class="ml-3">
                    {{ $t("kinshipdegree") }}
                  </div>
                  <div class="ml-auto" style="font-weight: bold">
                    {{ person?.kinshipDegree || "-" }}
                  </div>
                </div>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
