<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-input
        outlined
        v-model="PretragaRecepta"
        label="Pretraži Recepte"
        class="q-mb-md" clearable>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-table
        separator="horizontal"
        title="Brisanje Recepta"
        title-class="text-h4 text-bold text-red-9"
        :rows="filteredRecipes"
        :columns="columns"
        row-key="SifraRecepta"
        table-class="text-black"
        table-style="border: 3px solid black;"
        table-header-style="height: 65px"
        table-header-class="bg-red-2"
        bordered
        flat
        square>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols"
              :key="col.name"
              :props="props">
              <span>
                {{ col.name === 'NazivRecepta' ? (props.row[col.field] || 'Nema recepta imena') : props.row[col.field] }}
              </span>
            </q-td>
            <q-td>
              <!-- Gumb za brisanje recepta -->
              <q-btn 
                color="negative" 
                label="Obriši" 
                @click="deleteRecipe(props.row.SifraRecepta)"
                icon="delete" 
                size="sm"
                class="q-ml-sm"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios';

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

const Recipes = ref([]);
const PretragaRecepta = ref('');

export default {
  setup() {
    const filteredRecipes = computed(() => {
      if (!PretragaRecepta.value.trim()) return Recipes.value;
      return Recipes.value.filter((recipe) =>
        recipe.NazivRecepta?.toLowerCase().includes(PretragaRecepta.value.toLowerCase())
      );
    });

    const loadRecipes = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/pretragaRecepta/');
        if (Array.isArray(result.data)) {
          Recipes.value = result.data;
        } else {
          console.error('Invalid data format:', result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const deleteRecipe = async (id) => {
      try {
        const response = await axios.delete(`http://localhost:3000/api/DeleteRecipe/${id}`);
        if (response.status === 200) {
          Recipes.value = Recipes.value.filter(recipe => recipe.SifraRecepta !== id);
          console.log(`Recipe with id ${id} deleted successfully.`);
        } else {
          console.error('Error deleting Recipe:', response);
        }
      } catch (error) {
        console.error('Greška prilikom brisanja recepta:', error);
        alert(
          error.response?.data?.message || 'Došlo je do pogreške prilikom brisanja recepta.'
        );
      }
    };

    onMounted(loadRecipes);

    return {
      columns,
      Recipes,
      PretragaRecepta,
      filteredRecipes,
      deleteRecipe
    };
  }
};
</script>
