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
