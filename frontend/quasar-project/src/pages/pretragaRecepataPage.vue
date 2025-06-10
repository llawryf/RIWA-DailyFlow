<template>
  <div style="background-color: lightgreen">
    <q-page padding>
      <div class="q-mb-md text-center">
        <h4>Pretraga recepta</h4>
      </div>

      <div class="q-pa-md">
        <q-input
          outlined
          v-model="pretragaRecepta"
          label="Ime Recepta"
          class="q-mb-md"
          style="background-color: white"
          @input="filterRecipes"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-dialog v-model="showDetailDialog" persistent>
          <q-card class="q-pa-md" style="min-width: 400px; max-width: 600px">
            <q-card-section>
              <div class="text-h6">{{ selectedRecipe?.NazivRecepta }}</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div>
                <strong>Šifra recepta:</strong>
                {{ selectedRecipe?.SifraRecepta }}
              </div>
              <div>
                <strong>Email korisnika:</strong>
                {{ selectedRecipe?.EmailKorisnika || "N/A" }}
              </div>
              <div>
                <strong>Opis recepta:</strong>
                {{ selectedRecipe?.OpisRecepta || "Nema opisa" }}
              </div>
              <div>
                <strong>Oznake:</strong> {{ selectedRecipe?.OznakeRecepta }}
              </div>
              <div>
                <strong>Ocjena:</strong> {{ selectedRecipe?.OcjenaRecepta }}
              </div>
              <div>
                <strong>Sastojci:</strong> {{ selectedRecipe?.Sastojci }}
              </div>
            </q-card-section>

            <div>
              <q-input
                filled
                v-model="newComment"
                label="Vaš komentar"
                type="textarea"
                autogrow
              />
              <q-input
                filled
                v-model.number="newGrade"
                label="Vaša ocjena (1-5)"
                type="number"
                min="1"
                max="5"
                class="q-mt-sm"
              />

              <div class="q-mt-sm">
                <q-btn
                  label="Dodaj komentar"
                  color="primary"
                  @click="submitComment"
                  :disable="!newComment || !newGrade"
                />
              </div>

              <div v-if="errorMessage" class="text-negative q-mt-sm">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="text-positive q-mt-sm">
                {{ successMessage }}
              </div>
            </div>

            <q-separator class="q-my-md" />
            <div>
              <strong>Komentari:</strong>
              <div v-if="comments.length === 0">Nema komentara.</div>
              <div v-else>
                <q-list bordered padding>
                  <q-item v-for="(kom, index) in comments" :key="index">
                    <q-item-section>
                      <q-item-label>
                        <strong>{{ kom.EmailKorisnika }}</strong
                        >: {{ kom.SadrzajKomentara }}
                      </q-item-label>
                      <q-item-label caption>
                        Ocjena: {{ kom.OcjenaKomentara || "N/A" }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>

            <q-card-actions align="right">
              <q-btn flat label="Zatvori" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <div class="row q-col-gutter-md">
          <div
            v-for="rec in filteredRecipes"
            :key="rec.SifraRecepta"
            class="col-12 col-md-6 col-lg-4"
          >
            <q-card
              class="bg-grey-1 text-black q-mb-md shadow-2 cursor-pointer"
              @click="openDetailDialog(rec)"
            >
              <q-card-section class="bg-green-2 text-black">
                <div class="text-h6">{{ rec.NazivRecepta }}</div>
                <div class="text-subtitle2">Šifra: {{ rec.SifraRecepta }}</div>
              </q-card-section>

              <q-card-section>
                <p><strong>Oznake:</strong> {{ rec.OznakeRecepta }}</p>
                <p><strong>Ocjena:</strong> {{ rec.OcjenaRecepta }}</p>
                <p><strong>Sastojci:</strong> {{ rec.Sastojci }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const style1 = { fontSize: "18px" };
    const style2 = { fontSize: "24px" };

    const recipe = ref([]);
    const pretragaRecepta = ref("");

    const showDetailDialog = ref(false);
    const selectedRecipe = ref({});
    const comments = ref([]);

    const newComment = ref("");
    const newGrade = ref(null);
    const errorMessage = ref("");
    const successMessage = ref("");
    const username = sessionStorage.getItem("username");

    const openDetailDialog = async (recipeItem) => {
      selectedRecipe.value = recipeItem;
      showDetailDialog.value = true;

      try {
        const token = sessionStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:3000/api/komentari/${recipeItem.SifraRecepta}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        comments.value = response.data;
      } catch (error) {
        console.error("Error fetching comments:", error);
        comments.value = [];
      }
    };

    const submitComment = async () => {
      errorMessage.value = "";
      successMessage.value = "";

      if (!newComment.value || !newGrade.value) {
        errorMessage.value = "Molimo unesite komentar i ocjenu.";
        return;
      }

      if (newGrade.value < 1 || newGrade.value > 5) {
        errorMessage.value = "Ocjena mora biti između 1 i 5.";
        return;
      }

      try {
        const token = sessionStorage.getItem("authToken");

        await axios.post(
          `http://localhost:3000/api/komentari/${selectedRecipe.value.SifraRecepta}`,
          {
            username: username,
            sadrzajKomentara: newComment.value,
            ocjenaKomentara: newGrade.value,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        successMessage.value = "Komentar je uspješno dodat.";

        newComment.value = "";
        newGrade.value = null;

        const response = await axios.get(
          `http://localhost:3000/api/komentari/${selectedRecipe.value.SifraRecepta}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        comments.value = response.data;
      } catch (error) {
        errorMessage.value = "Greška prilikom slanja komentara.";
        console.error(error);
      }
    };

    const filteredRecipes = computed(() => {
      if (!pretragaRecepta.value.trim()) return recipe.value;
      return recipe.value.filter((rec) =>
        rec.NazivRecepta.toLowerCase().includes(
          pretragaRecepta.value.toLowerCase()
        )
      );
    });

    const loadRecipe = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:3000/api/pretragaRecepta",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (Array.isArray(response.data)) {
          recipe.value = response.data;
        } else {
          console.error("Invalid data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const filterRecipes = () => {};

    onMounted(loadRecipe);

    return {
      recipe,
      pretragaRecepta,
      filteredRecipes,
      loadRecipe,
      filterRecipes,
      showDetailDialog,
      selectedRecipe,
      openDetailDialog,
      comments,
      newComment,
      newGrade,
      errorMessage,
      successMessage,
      submitComment,
    };
  },
};
</script>
