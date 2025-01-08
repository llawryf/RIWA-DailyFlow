<template>
  <q-page padding>
    <!-- Toolbar for page title -->
    <q-toolbar>
      <q-toolbar-title>Prijava</q-toolbar-title>
    </q-toolbar>

    <!-- Instructions for the user -->
    <div class="q-mb-md">
      <p>Molimo vas da unesete svoje korisničko ime i lozinku za prijavu.</p>
    </div>

    <!-- Login Form -->
    <q-form @submit="submitLogin">
      <div class="q-mb-md">
        <q-input
          v-model="loginData.username"
          label="Korisničko ime"
          outlined
          required
        />
      </div>

      <div class="q-mb-md">
        <q-input
          v-model="loginData.password"
          label="Lozinka"
          outlined
          type="password"
          required
        />
      </div>

      <!-- Submit button -->
      <q-btn label="Potvrdi" color="primary" type="submit" :loading="isLoading" />
    </q-form>

    <!-- Loading spinner indicator -->
    <div v-if="isLoading" class="q-mt-md" style="text-align: center;">
      <q-spinner-dots size="50px" color="primary" />
    </div>
  </q-page>
</template>

<script>
import axios from 'axios';
import { useQuasar } from 'quasar';


export default {
  name: 'LoginPage',

  data() {
    return {
      // Object to store user input
      loginData: {
        username: '',
        password: '',
      },

      // State variable to track loading state
      isLoading: false
    };
  },

  methods: {
    async submitLogin() {
      // Check if the username and password are provided
      if (!this.loginData.username || !this.loginData.password) {
        this.$q.notify({
          type: 'negative',
          message: 'Molimo vas da unesete korisničko ime i lozinku.',
        });
        return;
      }

      // Set loading state to true
      this.isLoading = true;

      // Prepare login data to send to the backend
      const loginData = {
        username: this.loginData.username,
        password: this.loginData.password
      };

      try {
        // Send login data to the backend API for validation
        const response = await axios.post("http://localhost:3000/login", loginData);

        // Handle the response
        if (response.data.success) {
          // Success notification
          this.$q.notify({
            type: 'positive',
            message: 'Prijava uspješna!',
          });

          // Redirect to the home page (or any other page after successful login)
          this.$router.push('/');
        } else {
          // Failure notification
          this.$q.notify({
            type: 'negative',
            message: response.data.message,
          });
        }
      } catch (error) {
        // Error notification
        this.$q.notify({
          type: 'negative',
          message: 'Došlo je do greške. Pokušajte ponovo.',
        });
      } finally {
        // Reset loading state after request is completed
        this.isLoading = false;
      }
    }
  }
};
</script>
