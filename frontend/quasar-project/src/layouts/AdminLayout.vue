<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Daily Flow
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({
  name: 'AdminLayout'
})

const linksList = [
{
    title: 'Admin',
    caption: 'admin page',
    icon: 'admin_panel_settings',
    link: '#/admin'
  },
  {
    title: 'User management',
    caption: 'upravljanje računima korisnika',
    icon: 'manage_accounts',
    link: '#/admin/korisnici'
  },
  {
    title: 'Recipe management',
    caption: 'dodavanje/brisanje recepata',
    icon: 'exposure',
    link: '#/admin/recepti'
  },
  {
    title: 'Logout',
    caption: 'logout',
    icon: 'logout',
    link: '#/admin/logout'
  },

]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
