import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Prize from './components/prize.vue'
import Set from './components/set.vue'

import App from './App.vue'

const routes = [
    { path: '/', component: Prize },
    { path: '/set', component: Set },
]
const router = createRouter({
    // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    // history: createWebHistory(),
    history: createWebHashHistory(),
    routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')

