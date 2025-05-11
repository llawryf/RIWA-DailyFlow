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

        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          @click="link.action ? link.action() : navigateTo(link.link)"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({
  name: 'AdminLayout'
})

const router = useRouter()
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  sessionStorage.removeItem('authToken') // Uklanjanje tokena
  router.push('/') // Preusmjeravanje na početnu stranicu
}

function navigateTo(link) {
  router.push(link)
}

const linksList = [
  {
    title: 'Admin',
    caption: 'admin page',
    icon: 'admin_panel_settings',
    link: '/admin'
  },
  {
    title: 'User management',
    caption: 'upravljanje računima korisnika',
    icon: 'manage_accounts',
    link: '/admin/korisnici'
  },
  {
    title: 'Recipe management',
    caption: 'dodavanje/brisanje recepata',
    icon: 'exposure',
    link: '/admin/recepti'
  },
  {
    title: 'Logout',
    caption: 'logout',
    icon: 'logout',
    action: logout // Dodana akcija za odjavu
  }
]
</script>
