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

        <!-- Show Username if Logged In -->
        <q-item v-if="isLoggedIn">
          <q-item-section>
            <q-item-label>Welcome, {{ username }}</q-item-label>
          </q-item-section>
        </q-item>

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
import { ref, watch, onMounted, watchEffect } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'Naslovna',
    caption: 'početna stranica',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Pretraživanje',
    caption: 'pretraživanje recepata',
    icon: 'search',
    link: '/pretraga_recepata'
  },
  {
    title: 'Login',
    caption: 'Prijava',
    icon: 'login',
    link: '/login'
  },
  {
    title: 'Register',
    caption: 'Registracija',
    icon: 'how_to_reg',
    link: '/register'
  },
  {
    title: 'Profil',
    caption: 'Otvori moj profil',
    icon: 'account_circle',
    link: '/profil'
  },
  {
    title: 'Spremljeni recepti',
    caption: 'Pregled spremljenih recepata',
    icon: 'menu_book',
    link: '/spremljeni_recepti'
  },
  {
    title: 'Izrada recepta',
    caption: 'Izradi svoj recept',
    icon: 'edit_note',
    link: '/izrada_recepta'
  },
  {
    title: 'Pretraga korisnika',
    caption: 'Pretraži korisnike',
    icon: 'person_search',
    link: '/pretraga_korisnika'
  }
]

const leftDrawerOpen = ref(false)

// Check if user is logged in
const isLoggedIn = ref(false)
const username = ref('')

// Fetch the username and token from sessionStorage
watchEffect(() => {
  const token = sessionStorage.getItem('authToken')
  const storedUsername = sessionStorage.getItem('username')

  if (token && storedUsername) {
    isLoggedIn.value = true
    username.value = storedUsername
  } else {
    isLoggedIn.value = false
    username.value = ''
  }
})

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
