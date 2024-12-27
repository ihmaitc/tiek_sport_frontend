<script setup lang="ts">
import NavGroup from "./NavGroup/index.vue";
import NavItem from "./NavItem/index.vue";
import navMenu from "@/app/config/permissions/index";
import { useCustomizerStore } from "../store/customizer";
import { CircleDotIcon, CircleIcon } from "vue-tabler-icons";
import { useAuth } from "../../store/auth";
import NavCollapse from "./NavCollapse/NavCollapse.vue";

const customizer = useCustomizerStore();

const auth = useAuth();

const isVisible = (item: any): boolean => {
  let bool: boolean = false;
  if (Array.isArray(item)) {
    item.forEach((el) => {
      bool = bool || auth.can(el);
      if (el.includes("!")) {
        const pm = el.split("!")[1];
        bool = !auth.can(pm);
      }
    });
    return bool;
  } else if (typeof item === "string") {
    return (bool = auth.can(item));
  } else if (typeof item === "boolean") {
    return (bool = true);
  } else {
    return bool;
  }
};
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="75"
    :mobile-breakpoint="960"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
    width="256"
  >
    <!-- @vue-skip -->
    <div class="pa-5 pl-4" style="display: flex; align-items: center; cursor: pointer" @click="$router.push('/')">
      <img src="@/assets/images/logo.svg" width="50" alt="" />
      <div class="ml-3">
        <b style="font-size: 24px">IHMA</b>
      </div>
      <v-btn
        class="hidden-md-and-down ml-auto"
        icon
        color="primary"
        variant="text"
        @click.stop="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
      >
        <v-tooltip activator="parent" location="top">
          {{ customizer.mini_sidebar ? $t("fullMenu") : $t("collapseMenu") }}
        </v-tooltip>
        <CircleDotIcon color="rgb(var(--v-theme-success))" v-if="!customizer.mini_sidebar" />
        <CircleIcon color="rgb(var(--v-theme-success))" v-else />
      </v-btn>
    </div>
    <div class="scrollnavbar">
      <v-list class="py-6 px-4">
        <template v-for="(item, index) in navMenu">
          <NavCollapse :item="item" :level="index" v-if="item.isCollapse" />
          <template v-else>
            <NavGroup :item="item" v-if="isVisible(item.visible)"></NavGroup>
            <template v-for="child in item.children">
              <NavItem v-if="isVisible(child.visible)" :item="child" class="leftPadding" />
            </template>
          </template>
        </template>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>
