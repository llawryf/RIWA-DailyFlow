const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/pretraga_recepata', component: () => import('pages/pretragaRecepataPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      { path: '/register', component: () => import('pages/RegisterPage.vue') },
      { path: '/profil', component: () => import('pages/ProfilPage.vue') },
      { path: '/spremljeni_recepti', component: () => import('pages/SpremljeniReceptiPage.vue') },
      { path: '/izrada_recepta', component: () => import('pages/IzradaReceptaPage.vue') },
      { path: '/pretraga_korisnika', component: () => import('pages/PretragaKorisnika.vue') },
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('pages/AdminPage.vue') },
      { path: '/admin/recepti', component: () => import('pages/RecipeManagement.vue') },
      { path: '/admin/korisnici', component: () => import('pages/UserManagement.vue') },
      { path: '/admin/logout', component: () => import('pages/LogoutPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
