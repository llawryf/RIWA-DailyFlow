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
      <q-btn
        label="Potvrdi"
        color="primary"
        type="submit"
        :loading="isLoading"
      />
    </q-form>

    <!-- Loading spinner indicator -->
    <div v-if="isLoading" class="q-mt-md" style="text-align: center">
      <q-spinner-dots size="50px" color="primary" />
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { useQuasar } from "quasar";

export default {
  name: "LoginPage",

  data() {
    return {
      // Object to store user input
      loginData: {
        username: "",
        password: "",
      },

      // State variable to track loading state
      isLoading: false,
    };
  },

  mounted() {
    // Provjera ako je vec netko ulogiran
    const token = sessionStorage.getItem("authToken");

    if (token) {
      // Ako da, ridirekcija na index page
      this.$router.push("/");
    }
  },

  methods: {
    async submitLogin() {
      if (!this.loginData.username || !this.loginData.password) {
        this.$q.notify({
          type: "negative",
          message: "Molimo vas da unesete korisničko ime i lozinku.",
        });
        return;
      }

      this.isLoading = true;

      const loginData = {
        username: this.loginData.username,
        password: this.loginData.password,
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/login",
          loginData
        );

        if (response.data.success) {
          sessionStorage.setItem("authToken", response.data.token);
          sessionStorage.setItem("username", this.loginData.username);

          this.$q.notify({
            type: "positive",
            message: "Prijava uspješna!",
          });

          // Dynamically update the username in MainLayout
          if (this.loginData.username === "Admin 1") {
            this.$router.push("/admin");
          } else {
            this.$router.push("/");
          }
        } else {
          this.$q.notify({
            type: "negative",
            message: response.data.message,
          });
        }
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: "Došlo je do greške. Pokušajte ponovo.",
        });
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
