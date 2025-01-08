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

        <!-- Use `EssentialLink` with `to` instead of `link` -->
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          :title="link.title"
          :caption="link.caption"
          :icon="link.icon"
          :to="link.link"
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
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'Naslovna',
    caption: 'početna stranica',
    icon: 'home',
    link: '/'  // Ensure this points to the root path for Vue Router
  },
  {
    title: 'Pretraživanje',
    caption: 'pretraživanje recepata',
    icon: 'search',
    link: '/pretraga_recepata'  // Remove '#' and just use the Vue Router path
  },
  {
    title: 'Login',
    caption: 'Prijava',
    icon: 'login',
    link: '/login'  // Remove '#' and just use the Vue Router path
  },
  {
    title: 'Register',
    caption: 'Registracija',
    icon: 'how_to_reg',
    link: '/register'  // Remove '#' and just use the Vue Router path
  },
  {
    title: 'Profil',
    caption: 'Otvori moj profil',
    icon: 'account_circle',
    link: '/profil'  // Remove '#' and just use the Vue Router path
  },
  {
    title: 'Spremljeni recepti',
    caption: 'Pregled spremljenih recepata',
    icon: 'menu_book',
    link: '/spremljeni_recepti'  // Remove '#' and just use the Vue Router path
  },
  {
    title: 'Izrada recepta',
    caption: 'Izradi svoj recept',
    icon: 'edit_note',
    link: '/izrada_recepta'  // Remove '#' and just use the Vue Router path
  },
  {
    title: 'Pretraga korisnika',
    caption: 'Pretraži korisnike',
    icon: 'person_search',
    link: '/pretraga_korisnika'  // Remove '#' and just use the Vue Router path
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
