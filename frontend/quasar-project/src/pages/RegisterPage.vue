<template>
  <q-page padding>
    <q-toolbar>
      <q-toolbar-title>Registracija korisnika</q-toolbar-title>
    </q-toolbar>

    <div class="q-mb-md">
      <p>
        Popunite polja za registraciju kako biste postali član naše platforme.
      </p>
      <p>Vaše ime i prezime će biti korisničko ime za ulaz u aplikaciju.</p>
    </div>

    <q-form @submit="submitRegistration" ref="registrationForm">
      <div class="q-mb-md">
        <q-input v-model="user.firstName" label="Ime" outlined required />
      </div>

      <div class="q-mb-md">
        <q-input v-model="user.lastName" label="Prezime" outlined required />
      </div>

      <div class="q-mb-md">
        <q-input
          v-model="user.email"
          label="Email"
          outlined
          type="email"
          required
        />
      </div>

      <div class="q-mb-md">
        <q-input
          v-model="user.password"
          label="Lozinka"
          outlined
          type="password"
          required
        />
      </div>

      <div class="q-mb-md">
        <q-input
          v-model="user.confirmPassword"
          label="Potvrdite lozinku"
          outlined
          type="password"
          required
        />
      </div>

      <div class="q-mb-md">
        <q-input
          v-model="user.PrefUser"
          label="Preferencije"
          outlined
          required
        />
      </div>

      <q-btn label="Potvrdi" color="primary" type="submit" />
    </q-form>
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
      // Validate form fields
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

      // Check if passwords match
      if (this.user.password !== this.user.confirmPassword) {
        this.$q.notify({
          type: "negative",
          message: "Lozinke se ne podudaraju!",
        });
        return;
      }

      // Prepare the registration data
      const registrationData = {
        korIme: `${this.user.firstName} ${this.user.lastName}`,
        email: this.user.email,
        password: this.user.password,
        prefKor: this.user.PrefUser,
      };

      try {
        // Send registration data to the backend API
        const response = await axios.post(
          "http://localhost:3000/register",
          registrationData
        );

        // Check response and notify user
        if (response.data.success) {
          this.$q.notify({
            type: "positive",
            message: response.data.message,
          });

          // Redirect to login page after successful registration
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
