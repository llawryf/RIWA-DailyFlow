<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="text-white relative" style="background-color: #272727">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="q-pa-none">
          <div class="absolute-center">
            <img
              src="https://imgur.com/XCLanXO.png"
              style="height: 40px; padding-top: 15px; height: 60px"
            />
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="text-white"
      style="background-color: #272727"
    >
      <q-list class="text-white" style="background-color: #272727">
        <q-item-label header class="text-white"> Essential Links </q-item-label>

        <q-item v-if="isLoggedIn">
          <q-item-section>
            <q-item-label class="text-white"
              >Welcome, {{ username }}</q-item-label
            >
          </q-item-section>
        </q-item>

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
import { ref, watch, onMounted, watchEffect } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useRoute } from "vue-router";

defineOptions({
  name: "MainLayout",
});

const linksList = [
  {
    title: "Naslovna",
    caption: "početna stranica",
    icon: "home",
    link: "/",
  },
  {
    title: "Pretraživanje",
    caption: "pretraživanje recepata",
    icon: "search",
    link: "/pretraga_recepata",
  },
  {
    title: "Login",
    caption: "Prijava",
    icon: "login",
    link: "/login",
  },
  {
    title: "Register",
    caption: "Registracija",
    icon: "how_to_reg",
    link: "/register",
  },
  {
    title: "Profil",
    caption: "Otvori moj profil",
    icon: "account_circle",
    link: "/profil",
  },
  {
    title: "Spremljeni recepti",
    caption: "Pregled spremljenih recepata",
    icon: "menu_book",
    link: "/spremljeni_recepti",
  },
  {
    title: "Izrada recepta",
    caption: "Izradi svoj recept",
    icon: "edit_note",
    link: "/izrada_recepta",
  },
  {
    title: "Pretraga korisnika",
    caption: "Pretraži korisnike",
    icon: "person_search",
    link: "/pretraga_korisnika",
  },
];

const leftDrawerOpen = ref(false);

// Check if user is logged in
const isLoggedIn = ref(false);
const username = ref("");

// Fetch the username and token from sessionStorage
watchEffect(() => {
  const token = sessionStorage.getItem("authToken");
  const storedUsername = sessionStorage.getItem("username");

  if (token && storedUsername) {
    isLoggedIn.value = true;
    username.value = storedUsername;
  } else {
    isLoggedIn.value = false;
    username.value = "";
  }
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    const token = sessionStorage.getItem("authToken");
    const storedUsername = sessionStorage.getItem("username");

    if (token && storedUsername) {
      isLoggedIn.value = true;
      username.value = storedUsername;
    } else {
      isLoggedIn.value = false;
      username.value = "";
    }
  }
);
</script>
