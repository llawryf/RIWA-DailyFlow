<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-input
        outlined
        v-model="pretragaRecepta"
        label="Pretraži Recepte"
        class="q-mb-md"
        @input="filterRecipes"
        clearable
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-table
        separator="horizontal"
        title="Lista Recepta"
        title-class="text-h4 text-bold text-green-9"
        :rows="filteredRecipes"
        :columns="columns"
        row-key="SifraRecepta"
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
              <span>
                {{ props.row[col.field] }}
              </span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const style1 = {
      fontSize:'18px'
    };
    const style2 = {
      fontSize: '24px'
    };
    const columns = [
      {
        name: "SifraRecepta",
        label: "Šifra",
        field: "SifraRecepta",
        align: "left",
        sortable: true,
        style: style1,
        headerStyle: style2,
      },
      {
        name: "NazivRecepta",
        label: "Naziv Recepta",
        field: "NazivRecepta",
        align: "left",
        sortable: true,
        style: style1,
        headerStyle: style2,
      },
      {
        name: "OznakeRecepta",
        label: "Oznake",
        field: "OznakeRecepta",
        align: "left",
        sortable: true,
        style: style1,
        headerStyle: style2,
      },
      {
        name: "OcjenaRecepta",
        label: "Ocjena",
        field: "OcjenaRecepta",
        align: "left",
        sortable: true,
        style: style1,
        headerStyle: style2,
      },
      {
  name: "Sastojci",
  label: "Sastojci",
  field: "Sastojci",
  align: "left",
  sortable: false,
  style: style1,
  headerStyle: style2,
},
    ];
    const recipe = ref([]);
    const pretragaRecepta = ref('');
    const filteredRecipes = computed(() => {
      if (!pretragaRecepta.value.trim()) return recipe.value;
      return recipe.value.filter((rec) =>
        rec.NazivRecepta.toLowerCase().includes(pretragaRecepta.value.toLowerCase())
      );
    });

    const loadRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/pretragaRecepta");
        if (Array.isArray(response.data)) {
          recipe.value = response.data;
        } else {
          console.error("Invalid data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    onMounted(loadRecipe);
    const filterRecipes = () => {
    };

    return {
      columns,
      recipe,
      pretragaRecepta,
      filteredRecipes,
      loadRecipe,
      filterRecipes,
    };
  },
};
</script>
