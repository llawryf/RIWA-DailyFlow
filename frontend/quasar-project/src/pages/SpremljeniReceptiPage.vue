


<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        separator="horizontal"
        title="Popis recepata"
        title-class="text-h4 text-bold text-red-9"
        :rows="books"
        :columns="columns"
        row-key="id"
        table-class="text-black"
        table-style="border: 3px solid black;"
        table-header-style="height: 65px"
        table-header-class="bg-red-2"
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
      <!-- Display text for non-image fields -->
      <span v-if="col.name !== 'OznakeRecepta' && col.name !== 'OpisRecepta'">
        {{ props.row[col.field] }}
      </span>

      <!-- Display description -->
      <div v-if="col.name === 'OpisRecepta'">
        <div class="tbl_opis">
          {{ props.row[col.field] || 'Nema opisa' }}
        </div>
      </div>

       <!-- Display OznakeRecepta as text -->
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

const style1 = {
  fontSize: '18px',
};

const style2 = {
  fontSize: '24px',
};

const columns = [
  {
    name: "SifraRecepta",
    label: "ID",
    field: "SifraRecepta", // Matches API key
    align: "left",
    sortable: true,
  },
  {
    name: "NazivRecepta",
    label: "Naziv",
    field: "NazivRecepta", // Matches API key
    align: "left",
  },
  {
    name: "EmailKorisnika",
    label: "Email",
    field: "EmailKorisnika", // Matches API key
    align: "left",
  },
  {
    name: "OpisRecepta",
    label: "Opis",
    field: "OpisRecepta", // Matches API key
    align: "left",
  },
  {
    name: "OznakeRecepta",
    label: "Oznake",
    field: "OznakeRecepta", // Matches API key
    align: "center",
  },
];


export default {
  setup() {
    const books = ref([]);
    const pagination = ref({
      rowsPerPage: 10,
    });

    const loadRecipes = async () => {
  try {
    const result = await axios.get('http://localhost:3000/api/pretragaRecepata');

    // Check if result.data is an array directly
    if (Array.isArray(result.data)) {
      console.log('Received books:', result.data);
      books.value = result.data;  // Update the books list

    } else {
      console.error('API response is not in the expected format:', result.data);
    }
  } catch (error) {
    console.error('Error loading books:', error);
  }
};



    // Load books when component is mounted
    onMounted(() => {
      loadRecipes();
    });

    return {
      columns,
      books,
      pagination,
    };
  },
};

</script>
