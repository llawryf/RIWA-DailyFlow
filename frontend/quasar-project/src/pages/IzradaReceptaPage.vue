<template>
  <q-page padding>
    <!-- Ako JE ulogiran -->
    <div v-if="isLoggedIn">
      <q-input
        v-model="recipeName"
        label="Naziv recepta"
        filled
        class="q-mb-md"
      />
      <q-input
        v-model="recipeTags"
        label="Tagovi recepta"
        filled
        class="q-mb-md"
      />
      <q-input
        v-model="recipeDescription"
        label="Opis recepta"
        filled
        type="textarea"
        class="q-mb-md"
      />
      <!-- Gumb za izradu recepta -->
      <q-btn
        label="Izradi Recept"
        color="primary"
        class="full-width"
        @click="createRecipe"
      />
    </div>
    <!-- Ako NIJE ulogiran -->
    <div v-else>
      <p>Prijavite se za izradu recepta</p>
      <q-btn
        label="Prijava"
        color="primary"
        @click="redirectToLogin"
      />
    </div>
  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLoggedIn: !!sessionStorage.getItem('authToken'),
      recipeName: '',
      recipeTags: '',
      recipeDescription: ''
    };
  },
  methods: {
    redirectToLogin() {
      this.$router.push('/login');
    },
    async createRecipe() {
      const recipeData = {
        recipeName: this.recipeName,
        recipeTags: this.recipeTags,
        recipeDescription: this.recipeDescription
      };

      try {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
          alert("Nedostaje token. Prijavite se ponovno.");
          return;
        }

        const response = await axios.post(
          'http://localhost:3000/IzradaRecepta',
          recipeData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log('Odgovor servera:', response.data);

        this.recipeName = '';
        this.recipeTags = '';
        this.recipeDescription = '';

        alert('Recept je uspješno kreiran!');
      } catch (error) {
        console.error('Greška prilikom stvaranja recepta:', error);
        alert(
          error.response?.data?.error ||
          'Došlo je do greške prilikom stvaranja recepta.'
        );
      }
    }
  }
};
</script>
