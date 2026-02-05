import { createApp } from 'vue'
import App from './App.vue'
//import App from './AppLectures.vue'
import router from './router.js'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App);
app.use(router);
app.mount('#app')