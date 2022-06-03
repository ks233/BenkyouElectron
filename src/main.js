import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import EleUploadImage from 'vue-ele-upload-image/lib'

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(ElementPlus)

app.component(EleUploadImage.name, EleUploadImage)
app.mount('#app')

