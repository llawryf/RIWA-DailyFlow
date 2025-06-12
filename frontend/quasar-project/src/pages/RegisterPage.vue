<template>
  <q-page class="flex flex-center" style="background-color:#90ee90; min-height:100vh;">
    <q-card flat bordered class="q-pa-lg" style="max-width:420px; width:90%;">
      <q-toolbar class="q-mb-md">
        <q-toolbar-title class="text-h6 text-center full-width">Registracija korisnika</q-toolbar-title>
      </q-toolbar>

      <div class="text-body2 q-mb-md">
      </div>

      <q-form @submit="submitRegistration" ref="registrationForm" class="column q-gutter-md">
        <q-input v-model="user.firstName" label="Ime" outlined required style="background-color:white" />

        <q-input v-model="user.lastName" label="Prezime" outlined required style="background-color:white" />

        <q-input v-model="user.email" label="Email" outlined type="email" required style="background-color:white" />

        <q-input v-model="user.password" label="Lozinka" outlined type="password" required style="background-color:white" />

        <q-input v-model="user.confirmPassword" label="Potvrdite lozinku" outlined type="password" required style="background-color:white" />

        <q-input v-model="user.PrefUser" label="Preferencije" outlined required style="background-color:white" />

        <q-btn label="Potvrdi" color="primary" type="submit" class="full-width" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import { useQuasar } from "quasar";

export default {
  name: "RegistrationPage",

  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        PrefUser: "",
      },
    };
  },

  methods: {
    async submitRegistration() {
      const $q = useQuasar();
      // Validacija
      if (
        this.user.firstName === "" ||
        this.user.lastName === "" ||
        this.user.email === "" ||
        this.user.password === "" ||
        this.user.confirmPassword === "" ||
        this.user.PrefUser === ""
      ) {
        this.$q.notify({
          type: "negative",
          message: "Sva polja su obavezna!",
        });
        return;
      }

      // provjera podudaranja lozinki
      if (this.user.password !== this.user.confirmPassword) {
        this.$q.notify({
          type: "negative",
          message: "Lozinke se ne podudaraju!",
        });
        return;
      }
      const registrationData = {
        korIme: `${this.user.firstName} ${this.user.lastName}`,
        email: this.user.email,
        password: this.user.password,
        prefKor: this.user.PrefUser,
      };

      try {
        const response = await axios.post(
          "http://localhost:3000/register",
          registrationData
        );

        if (response.data.success) {
          this.$q.notify({
            type: "positive",
            message: response.data.message,
          });

          this.$router.push("/login");
        } else {
          this.$q.notify({
            type: "negative",
            message: response.data.message,
          });
        }
      } catch (error) {
        console.error("Registration error:", error);
        this.$q.notify({
          type: "negative",
          message: "Došlo je do greške. Pokušajte ponovo.",
        });
      }
    },
  },
};
</script>
