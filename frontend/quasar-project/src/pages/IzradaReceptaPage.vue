<template>
  <q-page padding>
    <!-- Check if user is logged in -->
    <div v-if="isLoggedIn">
      <p>Yes</p>
    </div>
    <div v-else>
      <p>No</p>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      // Check if the token exists in localStorage to determine if the user is logged in
      isLoggedIn: !!localStorage.getItem('authToken')
    };
  }
}
</script>
