<template>
  <div style="background-color: #90ee90; min-height: 100vh;">
    <q-page padding>
      <div class="q-pa-md">
        
        <q-input
          outlined
          v-model="PretragaKorisnika"
          label="Pretraži korisnike"
          clearable
          style="background-color:white"
          class="q-mb-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-table
          flat
          square
          bordered
          separator="horizontal"
          title="Pretraga korisnika"
          title-class="text-h4 text-bold text-red-9"
          :rows="filteredUsers"
          :columns="columns"
          row-key="EmailKorisnika"
          table-class="text-black"
          table-style="border:3px solid black"
          table-header-style="height:65px"
          table-header-class="bg-red-2"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">

                <span v-if="col.name !== 'akcija'">
                  {{ col.name === 'KorisnickoIme' ? (props.row[col.field] || 'Nema korisničkog imena') : props.row[col.field] }}
                </span>

                
                <template v-else>
                  <q-btn
                    :label="props.row.sent ? 'Zahtjev Poslan' : 'Dodaj Kao Prijatelja'"
                    :color="props.row.sent ? 'green' : 'red'"
                    dense glossy size="sm"
                    @click="props.row.sent = true"
                  />
                </template>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const styleBody = { fontSize: '18px' }
const styleHead = { fontSize: '24px' }

const columns = [
  {
    name: 'KorisnickoIme',
    label: 'Korisničko ime',
    field: 'KorisnickoIme',
    align: 'left',
    sortable: true,
    style: styleBody,
    headerStyle: styleHead
  },
  {
    name: 'PreferencijeKorisnika',
    label: 'Preferencije',
    field: 'PreferencijeKorisnika',
    align: 'left',
    sortable: true,
    style: styleBody,
    headerStyle: styleHead
  },
  {
    name: 'akcija',
    label: 'Akcija',
    field: 'akcija',
    align: 'center',
    sortable: false,
    style: styleBody,
    headerStyle: styleHead
  }
]

const users = ref([])
const PretragaKorisnika = ref('')

// filtriranje
const filteredUsers = computed(() => {
  const kriterij = PretragaKorisnika.value.trim().toLowerCase()
  if (!kriterij) return users.value
  return users.value.filter(u =>
    (u.KorisnickoIme || '').toLowerCase().includes(kriterij)
  )
})

// dohvat podataka + dodaj "sent" flag (noob način)
onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/api/PetragaKorisnika/')
    users.value = (Array.isArray(data) ? data : []).map(u => ({ ...u, sent: false }))
  } catch (e) {
    console.error('Greška pri dohvaćanju korisnika', e)
  }
})
</script>