<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
        separator="horizontal"
        title="Lista Recepta"
        title-class="text-h4 text-bold text-green-9"
        :rows="recipe"
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
import { ref, onMounted } from "vue";
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
        name: "recipeId",
        label: "Šifra",
        field: "recipeId",
        align: "left",
        sortable: true,
        style: style1,
        headerStyle: style2,
      },
      {
        name: "recipeName",
        label: "Naziv Recepta",
        field: "recipeName",
        align: "left",
        sortable: true,
        style: style1,
        headerStyle: style2,
      },
      {
        name: "recipeTags",
        label: "Oznake",
        field: "recipeTags",
        align: "left",
        sortable: true,
        style: style1,
        headerStyle: style2,
      },
      {
        name: "recipeRating",
        label: "Ocjena",
        field: "recipeRating",
        align: "left",
        sortable: true,
        style: style1,
        headerStyle: style2,
      },
      {
        name: "recipeImage",
        label: "Slika",
        field: "recipeImage",
        align: "left",
        sortable: true,
        style: style1,
        headerStyle: style2,
      },
      {
        name: "recipeDescription",
        label: "Opis",
        field: "recipeDescription",
        align: "left",
        sortable: true,
        style: style1,
        headerStyle: style2,
      },
    ];

    const recipe = ref([]);

    const loadRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/SviRecepti");
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

    return {
      columns,
      recipe,
      loadRecipe
    };
  },
};
</script>
