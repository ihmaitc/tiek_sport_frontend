<script setup lang="ts">
import { useAuth } from "@/app/config/store/auth";
import { watch } from "vue";
import { ref } from "vue";
import { FilterIcon, HistoryIcon, PlusIcon, RefreshIcon, XIcon } from "vue-tabler-icons";

interface IProps {
  filter?: any;
  hasMenu?: boolean;
  canCreate?: boolean;
  canClear?: boolean;
  canRefresh?: boolean;
  canSearch?: boolean;
  manualClose?: boolean;
  permission?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  canCreate: true,
  hasFilters: true,
  canSearch: true,
  canClear: true,
  canRefresh: true
});

const emits = defineEmits<{
  (e: "refresh"): void;
  (e: "getData"): void;
  (e: "clearFilter"): void;
  (e: "edit", value: number): void;
}>();

const auth = useAuth();

const menu = ref<boolean>(false);

const refresh = () => {
  emits("refresh");
};
const getData = () => {
  emits("getData");
};
const clearFilter = () => {
  emits("clearFilter");
};

const edit = (id: number) => {
  emits("edit", id);
};

watch(
  () => props.manualClose,
  () => {
    menu.value = false;
  }
);
</script>

<template>
  <div class="form-table-header">
    <div class="form-table-header__top">
      <div class="form-table-header__left">
        <slot name="search" :ability="auth">
          <div v-if="filter && canSearch" class="form-table-header__input">
            <form-input v-model="filter.search" @appendInner="refresh" appendInnerIcon="mdi-magnify" :placeholder="$t('enterText')"></form-input>
          </div>
        </slot>
        <slot name="filters" :ability="auth"> </slot>
      </div>
      <div class="form-table-header__right">
        <slot name="right-prepend" :ability="auth"></slot>
        <slot name="refresh">
          <v-btn v-if="canClear" color="grey200" variant="flat" @click="getData"> <HistoryIcon /> {{ $t("refresh") }} </v-btn>
        </slot>
        <slot name="clear">
          <v-btn
            v-if="canRefresh && hasMenu"
            color="error"
            variant="flat"
            @click="
              () => {
                clearFilter();
                refresh();
              }
            "
          >
            <RefreshIcon /> {{ $t("Clear") }}
          </v-btn>
        </slot>
        <slot name="menu" :ability="auth">
          <div cols="1" class="text-right px-0" v-if="hasMenu">
            <v-menu v-model="menu" anchor="top" persistent :close-on-content-click="false" location="end">
              <template v-slot:activator="{ props }">
                <v-btn color="secondary" v-bind="props" flat> <FilterIcon size="20" /> {{ $t("filter") }} </v-btn>
              </template>

              <v-card class="menu-card">
                <v-row class="mt-1 mx-2 align-center">
                  <v-col class="text-left">
                    {{ $t("filter") }}
                  </v-col>
                  <v-col class="text-right">
                    <XIcon class="cursor-pointer" @click="menu = false" />
                  </v-col>
                </v-row>
                <slot name="menu-items"></slot>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="menu = false">
                    {{ $t("close") }}
                  </v-btn>
                  <v-btn
                    flat
                    @click="
                      () => {
                        clearFilter();
                        refresh();
                      }
                    "
                  >
                    {{ $t("Clear") }}
                  </v-btn>
                  <v-btn
                    color="success"
                    @click="
                      () => {
                        refresh();
                        menu = false;
                      }
                    "
                  >
                    {{ $t("filter") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </div>
        </slot>
        <slot name="create" :ability="auth">
          <div class="px-0" v-if="canCreate && auth.can(`${permission}Create`)">
            <v-btn color="success" @click="edit(0)" variant="flat"> <PlusIcon size="20" /> {{ $t("Create") }} </v-btn>
          </div>
        </slot>
        <slot name="right-append" :ability="auth"></slot>
      </div>
    </div>
    <div class="form-table-header__bottom">
      <slot name="header-bottom" :ability="auth"></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.menu-card {
  width: 28.125rem !important;

  @media screen and (max-width: 600px) {
    width: 100% !important;
  }
}
.form-table-header {
  display: flex;
  flex-direction: column;

  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.3125rem;
  }
  &__left {
    display: flex;
    align-items: center;
  }
  &__right {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
  }
  &__bottom {
    padding: 0.3125rem 0;
  }
  &__input {
    width: 18.75rem;
    input {
      width: 100%;
    }
  }
}
</style>
