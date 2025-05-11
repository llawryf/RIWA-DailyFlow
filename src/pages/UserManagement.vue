<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-input
        outlined
        v-model="PretragaKorisnika"
        label="Pretraži Korisnike"
        class="q-mb-md" clearable>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-table
        separator="horizontal"
        title="Pretraga Korisnika"
        title-class="text-h4 text-bold text-red-9"
        :rows="filteredUsers"
        :columns="columns"
        row-key="EmailKorisnika"
        table-class="text-black"
        table-style="border: 3px solid black;"
        table-header-style="height: 65px"
        table-header-class="bg-red-2"
        bordered
        flat
        square>
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols"
              :key="col.name"
              :props="props">
              <span>
                {{ col.name === 'KorisnickoIme' ? (props.row[col.field] || 'Nema korisničkog imena') : props.row[col.field] }}
              </span>
            </q-td>
            <q-td>
              <!-- Gumb za brisanje korisnika -->
              <q-btn
                color="negative"
                label="Obriši"
                @click="()=>{console.log('Email to delete:', props.row.EmailKorisnika);deleteUser(props.row.EmailKorisnika)}"
                icon="delete"
                size="sm"
                class="q-ml-sm"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios';

const columns = [
  {
    name: 'KorisnickoIme',
    label: 'Korisničko Ime',
    field: 'KorisnickoIme',
    align: 'left',
    sortable: true
  },
  {
    name: 'EmailKorisnika',
    label: 'Email',
    field: 'EmailKorisnika',
    align: 'left',
    sortable: true
  }
];

const users = ref([]);
const PretragaKorisnika = ref('');

export default {
  setup() {
    const filteredUsers = computed(() => {
      if (!PretragaKorisnika.value.trim()) return users.value;
      const filtered = users.value.filter((user) =>
        user.KorisnickoIme?.toLowerCase().includes(PretragaKorisnika.value.toLowerCase())
      );
      return filtered;
    });

    const loadUsers = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/adminPetragaKorisnika/');
        if (Array.isArray(result.data)) {
          users.value = result.data;
        } else {
          console.error('Invalid data format:', result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const deleteUser = async (email) => {
      if (!email) {
        console.error('Email is required to delete a user.');
        return;
      }
      try {
        const response = await axios.delete(`http://localhost:3000/api/DeleteUser/${email}`);

        if (response.status === 200) {
          // Ažuriraj listu korisnika nakon brisanja
          users.value = users.value.filter(user => user.EmailKorisnika !== email);
          console.log(`User with email ${email} deleted successfully.`);
        } else {
          console.error('Error deleting user:', response);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };

    onMounted(loadUsers);

    return {
      columns,
      users,
      PretragaKorisnika,
      filteredUsers,
      deleteUser
    };
  }
};
</script>
