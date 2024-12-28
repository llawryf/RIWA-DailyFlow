<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md q-gutter-sm">

    <q-btn color="purple" label="Izradi recept" to="/izrada_recepta" />
    <q-btn color="purple" label="LOG IN" to="/login" />
    <q-btn color="purple" label="Registracija" to="/register" />
    <q-btn color="purple" label="Pretraga recepata" to="/pretraga_recepata" />
    <q-btn color="purple" label="Profil" to="/profil" />
    <q-btn color="purple" label="Spremljeni recepti" to="/spremljeni_recepti" />
    <q-btn color="purple" label="Izrada_recepta" to="/izrada_recepta" />
    <q-btn color="purple" label="Pretraga korisnika" to="/pretraga_korisnika" />

  </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'IndexPage'
});
</script>
