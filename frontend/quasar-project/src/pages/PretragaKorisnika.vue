<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-input
        outlined
        v-model="PretragaKorisnika"
        label="Pretraži Korisnike"
        class="q-mb-md"
        @input="filterUsers"
        clearable
      >
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
        square
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
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
  </q-tr>
</template>

      </q-table>

    </div>
  </q-page>

</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios';

const style1 = {
  fontSize: '18px'
};
const style2 = {
  fontSize: '24px'
};
const columns = [
  {
    name: 'EmailKorisnika',
    label: 'Email',
    field: 'EmailKorisnika',
    align: 'left',
    sortable: true,
    style: style1,
    headerStyle: style2
  },
  {
    name: 'KorisnickoIme',
    label: 'Korisničko Ime',
    field: 'KorisnickoIme',
    align: 'left',
    sortable: true,
    style: style1,
    headerStyle: style2
  }
];

const users = ref([]);
const PretragaKorisnika = ref('');

export default {
  setup() {
    const filteredUsers = computed(() => {
  if (!PretragaKorisnika.value.trim()) return users.value;
  const filtered = users.value.filter((user) =>
    user.KorisnickoIme.toLowerCase().includes(PretragaKorisnika.value.toLowerCase())
  );
  console.log('Filtered users:', filtered); // Log filtered users
  return filtered;
});


    return {
      columns,
      users,
      PretragaKorisnika,
      filteredUsers,
    };
  },

  mounted() {
    this.loadUsers(); // Load users when the component is mounted
  },

  methods: {
    async loadUsers() {
      try {
        const result = await axios.get('http://localhost:3000/api/PetragaKorisnika/');
        if (Array.isArray(result.data)) {
          users.value = result.data; // Populate users with the fetched data
        } else {
          console.error('Invalid data format:', result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
};
</script>
