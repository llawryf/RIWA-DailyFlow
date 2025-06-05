<template>
  <q-page class="flex flex-center slikaPozadine">
    <div class="q-pa-md">
      <div class="column q-gutter-md">
        <q-btn color="green" label="Izradi recept" to="/izrada_recepta" />
        <q-btn color="green" label="LOG IN" to="/login" />
        <q-btn color="green" label="Registracija" to="/register" />
        <q-btn
          color="green"
          label="Pretraga recepata"
          to="/pretraga_recepata"
        />
        <q-btn color="green" label="Profil" to="/profil" />
        <q-btn
          color="green"
          label="Spremljeni recepti"
          to="/spremljeni_recepti"
        />
        
        <q-btn
          color="green"
          label="Pretraga korisnika"
          to="/pretraga_korisnika"
        />
        <q-btn
          color="primary"
          label="Korisnička pomoć (.CHM)"
          href="help/DailyFlow.chm"
          target="_blank"
        />
        <q-btn
          color="primary"
          label="Korisnička pomoć (.PDF)"
          href="help/DailyFlow.pdf"
          target="_blank"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});
</script>

<style scoped>
.slikaPozadine {
  background-image: url("https://media.istockphoto.com/id/927407442/photo/mixed-spices-and-herbs-on-black-stone-table-top-view-ingredients-for-cooking-food-background.jpg?s=612x612&w=0&k=20&c=g_LiF_ctTW-M5VVsO6gitAtjusnglUJZcWBD-nN-BGg=");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
