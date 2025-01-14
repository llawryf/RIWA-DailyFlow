<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        separator="horizontal"
        title="Popis recepata"
        title-class="text-h4 text-bold text-red-9"
        :rows="recipes"
        :columns="columns"
        row-key="recipeId"
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
              <!-- Display text for all fields -->
              <span v-if="col.name !== 'recipeTags'">
                {{ props.row[col.field] }}
              </span>

              <!-- Display tags as text -->
              <span v-if="col.name === 'recipeTags'">
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
    field: "SifraRecepta",
    align: "left",
    sortable: true,
  },
  {
    name: "NazivRecepta",
    label: "Naziv",
    field: "NazivRecepta",
    align: "left",
  },
  {
    name: "OznakeRecepta",
    label: "Oznake",
    field: "OznakeRecepta",
    align: "left",
  },
  {
    name: "OcjenaRecepta",
    label: "Ocjena",
    field: "OcjenaRecepta",
    align: "left",
  },
];

export default {
  setup() {
    const recipes = ref([]);
    const pagination = ref({
      rowsPerPage: 10,
    });

    const loadRecipes = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/pretragaRecepta');

        // Check if result.data is an array directly
        if (Array.isArray(result.data)) {
          console.log('Received recipes:', result.data);
          recipes.value = result.data;  // Update liste
        } else {
          console.error('API response is not in the expected format:', result.data);
        }
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    };

    // Load recipes when component is mounted
    onMounted(() => {
      loadRecipes();
    });

    return {
      columns,
      recipes,
      pagination,
    };
  },
};
</script>
