<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-input
        outlined
        label="Unesite email"
        v-model="email"
        @blur="loadRecipes"
      />
      <q-table
        separator="horizontal"
        title="Popis recepata"
        title-class="text-h4 text-bold text-red-9"
        :rows="recipes"
        :columns="columns"
        row-key="SifraRecepta"
        table-class="text-black"
        table-style="border: 3px solid black;"
        table-header-style="height: 65px"
        table-header-class="bg-red-2"
        no-data-label="Prvo upišite email"
        bordered
        flat
        square
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              <span v-if="col.name !== 'OznakeRecepta'">
                {{ props.row[col.field] }}
              </span>
              <span v-if="col.name === 'OznakeRecepta'">
                {{ props.row[col.field] || 'Nema oznaka' }}
              </span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'RecipePage',

  setup() {
    const email = ref('');
    const recipes = ref([]);

    // Define columns as reactive
    const columns = [
  { name: "SifraRecepta", label: "ID", field: "SifraRecepta", align: "left", sortable: true },
  { name: "NazivRecepta", label: "Naziv", field: "NazivRecepta", align: "left" },
  { name: "OznakeRecepta", label: "Oznake", field: "OznakeRecepta", align: "left" },
  { name: "OcjenaRecepta", label: "Ocjena", field: "OcjenaRecepta", align: "left" },
];


    const loadRecipes = async () => {

      if (!email.value) {
        alert('Molimo unesite email');
        return;
      }

      try {
    const result = await axios.get(`http://localhost:3000/api/pretragaSpremljenihRecepta/${email.value}`);


    if (result.status !== 200) {
        throw new Error(`API returned status code ${result.status}`); // Bacanje greške za ne-200 statuse
    }

    if (Array.isArray(result.data)) {
        recipes.value = result.data;
    } else {
        console.error('Odgovor API-ja nije niz:', result.data);
        alert('Greška: Neočekivani format podataka.');
    }
} catch (error) {

    if (error.response) {

        alert(`Greška: ${error.response.data.error || 'Došlo je do pogreške na serveru.'}`); // Prikaz poruke sa servera ako postoji
    } else if (error.request) {
        alert('Greška: Nije primljen odgovor od servera.');
    } else {
        alert('Greška: Došlo je do greške prilikom slanja zahtjeva.');
    }
}
    };

    return {
      email,
      recipes,
      columns,
      loadRecipes,
    };
  },
};
</script>
