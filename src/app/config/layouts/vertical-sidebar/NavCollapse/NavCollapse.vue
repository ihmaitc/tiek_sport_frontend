<script setup lang="ts">
import NavItem from "../NavItem/index.vue";
import Icon from "../Icon.vue";
import { useAuth } from "@/app/config/store/auth";

interface IProps {
  item: any;
  level: number;
}

defineProps<IProps>();

const auth = useAuth();

const isVisible = (item: any): boolean => {
  let bool: boolean = false;

  if (Array.isArray(item)) {
    item.forEach((el: string) => {
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
  <div>
    <v-list-group class="px-0" no-action v-if="item && isVisible(item.visible)">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" :value="item.header" rounded class="mb-1">
          <template v-slot:prepend>
            <Icon :item="item.icon" :level="level" />
          </template>
          <v-list-item-title class="mr-auto">{{ $t(item?.title) }}</v-list-item-title>
        </v-list-item>
      </template>
      <template v-for="(subitem, _) in item.children" v-if="item.children">
        <NavCollapse :item="subitem" v-if="subitem.children && isVisible(item.visible)" :level="level + 1" />
        <NavItem :item="subitem" :level="level + 1" v-else-if="!subitem.children && isVisible(subitem.visible)"></NavItem>
      </template>
    </v-list-group>
  </div>
</template>
