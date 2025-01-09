<template>
  <q-page padding>

    <q-toolbar>
      <q-toolbar-title>Moj profil</q-toolbar-title>
    </q-toolbar>
    <div class="q-mb-md" style="margin-bottom: 1rem;">
      <p>Na ovoj stranici je moguće promijeniti svoje postavke računa kao što su email, lozinka i preference.</p>
    </div>
    <q-form @submit="updateUser">     

      <!-- Username Input -->
      <q-input v-model="username" label="Username" type="text" required />

      <!-- Email Input -->
      <q-input v-model="userEmail" label="Email" type="email" required />

      <!-- Password Input -->
      <q-input v-model="password" label="Password" type="password" required />

      <!-- Preferences Input -->
      <q-input v-model="userPreferences" label="Preferences" type="text" />

      <!-- Submit Button -->
      <div style="margin-top: 1rem;">
        <q-btn label="Update User" color="primary" type="submit" />
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
    const userEmail = ref('');
    const username = ref('');
    const password = ref('');
    const userPreferences = ref('');

    // Method to handle the update
    const updateUser = async () => {
      try {
        // Assuming userId is stored in session or you get it dynamically
        const userId = 1; // or fetch from session, for example

        const response = await axios.put(`http://localhost:3000/api/updateUser/${userId}`, {
          EmailKorisnika: userEmail.value,
          Lozinka: password.value,
          KorisnickoIme: username.value,
          PreferencijeKorisnika: userPreferences.value,
        });

        // Handle successful update response
        console.log(response.data);
        alert('User updated successfully!');
        
      } catch (error) {
        console.error('Error updating user:', error.response?.data || error.message);
        alert('Error updating user!');
      }
    };

    return {
      userEmail,
      username,
      password,
      userPreferences,
      updateUser,
    };
  },
};
</script>
