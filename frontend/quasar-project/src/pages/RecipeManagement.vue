<template>
    <q-page padding>
      <div class="q-pa-md">
        <!-- Input and Delete Button -->
        <div class="q-mb-md row items-center">
          <q-input
            v-model="deleteRecipeId"
            label="Unesite ID recepta za brisanje"
            outlined
            dense
            class="q-mr-md"
          />
          <q-btn
            label="Obriši recept"
            color="red"
            @click="deleteRecipe"
            outlined
            dense
          />
        </div>
  
        <!-- Recipe Table -->
        <q-table
          separator="horizontal"
          title="Popis recepata"
          title-class="text-h4 text-bold text-red-9"
          :rows="books"
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
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  const columns = [
    {
      name: "recipeId",
      label: "ID",
      field: "recipeId", // Matches API key
      align: "left",
      sortable: true,
    },
    {
      name: "recipeName",
      label: "Naziv",
      field: "recipeName", // Matches API key
      align: "left",
    },
    {
      name: "recipeTags",
      label: "Oznake",
      field: "recipeTags", // Matches API key
      align: "left",
    },
    {
      name: "recipeRating",
      label: "Ocjena",
      field: "recipeRating", // Matches API key
      align: "left",
    },
  ];
  
  export default {
    setup() {
      const books = ref([]); // Use `books` to store fetched recipes data
      const deleteRecipeId = ref(""); // Store recipeId entered by the user
  
      const loadRecipes = async () => {
        try {
          const result = await axios.get("http://localhost:3000/api/pretragaRecepta");
  
          // Check if result.data is an array directly
          if (Array.isArray(result.data)) {
            console.log("Received recipes:", result.data);
            books.value = result.data; // Update books (recipes) list
          } else {
            console.error("API response is not in the expected format:", result.data);
          }
        } catch (error) {
          console.error("Error loading recipes:", error);
        }
      };
  
      const deleteRecipe = async () => {
        if (!deleteRecipeId.value) {
          console.error("Recipe ID is empty.");
          return;
        }
  
        try {
          const response = await axios.delete(`http://localhost:3000/api/DeleteRecipe/${deleteRecipeId.value}`);
          console.log("Recipe deleted successfully:", response.data);
  
          // Reload recipes to update the table
          loadRecipes();
        } catch (error) {
          console.error("Error deleting recipe:", error);
        }
      };
  
      // Load recipes when component is mounted
      onMounted(() => {
        loadRecipes();
      });
  
      return {
        columns,
        books,
        deleteRecipeId,
        deleteRecipe,
      };
    },
  };
  </script>
  