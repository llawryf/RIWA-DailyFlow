<template>
  <q-page padding>
    <!-- Ako JE ulogiran -->
    <div v-if="isLoggedIn">
      <p>Yes</p>
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
export default {
  data() {
    return {
      // Provjera ako je korisnik ulogiran / ako postoji session
      isLoggedIn: !!sessionStorage.getItem('authToken')
    };
  },
  //ridirekcija na prijavu ako nije prijavljen
  methods: {
    redirectToLogin() {
      this.$router.push('/login');
    }
  }
};
</script>
