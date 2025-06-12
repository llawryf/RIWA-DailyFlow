<template>
  <q-page class="flex flex-center" style="background-color:#90ee90; min-height:100vh;">
    <q-card flat bordered class="q-pa-lg" style="max-width:420px; width:90%;">
      <q-toolbar class="q-mb-md">
        <q-toolbar-title class="text-h6 text-center full-width">Prijava</q-toolbar-title>
      </q-toolbar>

      <div class="text-body2 q-mb-md">
      </div>


      <q-form @submit="submitLogin">
        <div class="q-mb-md">
          <q-input
            v-model="loginData.username"
            style="background-color:white"
            label="Korisničko ime"
            outlined
            required
          />
        </div>

        <div class="q-mb-md">
          <q-input
            v-model="loginData.password"
            style="background-color:white"
            label="Lozinka"
            outlined
            type="password"
            required
          />
        </div>

        <q-btn
          label="Potvrdi"
          color="primary"
          type="submit"
          :loading="isLoading"
          class="full-width"
        />
      </q-form>

      <!-- ikona ucitavanja -->
      <div v-if="isLoading" class="q-mt-md text-center">
        <q-spinner-dots size="50px" color="primary" />
      </div>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import { useQuasar } from "quasar";

export default {
  name: "LoginPage",

  data() {
    return {
      // objekt u koji ce se spremati unosi
      loginData: {
        username: "",
        password: "",
      },

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

          // update korisnickog imena u main layoutu
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