import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from '@/router'

// element
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import Pagination from '@/components/pagination/Pagination.vue' // 分页组件
import Icon from '@/components/svgIcon/SvgIcon.vue' // svg图标组件

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .component('Page', Pagination)
  .component('Icon', Icon)
  .mount('#app')
