<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md q-gutter-sm">

      <q-btn color="purple" label="Upravljanje receptima" to="/admin/recepti" />
      <q-btn color="purple" label="Upravljanje korisnicima" to="/admin/korisnici" />
      <q-btn color="purple" label="Logout" to="/admin/logout" />

  </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: 'AdminPage'
});
</script>
