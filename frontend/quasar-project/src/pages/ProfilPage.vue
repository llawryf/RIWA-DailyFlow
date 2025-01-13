<template>
  <q-page padding>

    <q-toolbar>
      <q-toolbar-title>Moj profil</q-toolbar-title>
    </q-toolbar>
    <div class="q-mb-md" style="margin-bottom: 1rem;">
      <p>Na ovoj stranici je moguće promijeniti svoje postavke računa kao što su lozinka i preference.</p>
    </div>
    <q-form @submit="updateUser">

      <!-- mail Input -->
      <q-input v-model="mail" label="Email" type="text" required />



      <!-- Password Input -->
      <q-input v-model="password" label="Lozinka" type="password" required />

      <!-- Preferences Input -->
      <q-input v-model="userPreferences" label="Preference" type="text" />

      <!-- Submit Button -->
      <div style="margin-top: 1rem;">
        <q-btn label="Ažuriraj" color="primary" type="submit" />
      </div>

    </q-form>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'UpdateUserPage',

  setup() {
    // Reactive data for user input fields

    const mail = ref('');
    const password = ref('');
    const userPreferences = ref('');

    // Method to handle the update
    const updateUser = async () => {
      try {
        // Assuming userId is stored in session or you get it dynamically


        const response = await axios.put(`http://localhost:3000/api/updateUser/${mail.value}`, {

          Lozinka: password.value,
          Mail: mail.value,
          PreferencijeKorisnika: userPreferences.value,
        });

        // Handle successful update response
        console.log(response.data);
        alert('Podaci su uspješno ažurirani');

      } catch (error) {
        console.error('Greška u ažuriranju podataka:', error.response?.data || error.message);
        alert('Greška u ažuriranju podataka');
      }

      mail.value='';
      password.value='';
      userPreferences.value='';
    };

    return {

      mail,
      password,
      userPreferences,
      updateUser,
    };
  },
};
</script>
