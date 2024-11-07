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
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'Naslovna',
    caption: 'početna stranica',
    icon: 'home',
    link: '#'
  },
  {
    title: 'Pretraživanje',
    caption: 'pretraživanje recepata',
    icon: 'search',
    link: '#/pretraga_recepata'
  },
  {
    title: 'Login',
    caption: 'Prijava',
    icon: 'record_voice_over',
    link: '#/login'
  },
  {
    title: 'Register',
    caption: 'Registracija',
    icon: 'record_voice_over',
    link: '#/register'
  },
  {
    title: 'Profil',
    caption: 'Otvori moj profil',
    icon: 'rss_feed',
    link: '#/profil'
  },
  {
    title: 'Spremljeni recepti',
    caption: 'Pregled spremljenih recepata',
    icon: 'public',
    link: '#/spremljeni_recepti'
  },
  {
    title: 'Izrada recepta',
    caption: 'Izradi svoj recept',
    icon: 'favorite',
    link: '#/izrada_recepta'
  },
  {
    title: 'Pretraga korisnika',
    caption: 'Pretraži korisnike',
    icon: 'record_voice_over',
    link: '#/pretraga_korisnika'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
