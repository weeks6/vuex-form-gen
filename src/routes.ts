import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import Home from "./pages/Home.vue";
import Basic from "./pages/Basic.vue";
import SubmitHandler from "./pages/SubmitHandler.vue";
import CustomSlots from "./pages/CustomSlots.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/basic", component: Basic },
  { path: "/submit-handler", component: SubmitHandler },
  { path: "/custom-slots", component: CustomSlots },
];

export const router = createRouter({
  history:
    import.meta.env.MODE === "production"
      ? createWebHashHistory()
      : createWebHistory(),
  routes,
});
