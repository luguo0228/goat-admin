import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layouts/MainLayout.vue"),
    redirect: "/channel",
    children: [
      {
        path: "channel",
        name: "Channel",
        component: () => import("@/views/Channel/index.vue"),
        meta: { title: "频道管理", icon: "Channel" },
      },
      {
        path: "categories",
        name: "Categories",
        component: () => import("@/views/Categories/index.vue"),
        meta: { title: "栏目管理", icon: "Categories" },
      },

       {
        path: "categories/:id",
        name: "Distribution",
        component: () => import("@/views/Categories/distribution.vue"),
        meta: { title: "栏目内容分发", icon: "Distribution" },
      },
       {
        path: "content",
        name: "Content",
        component: () => import("@/views/Content/index.vue"),
        meta: { title: "内容管理", icon: "Content" },
      },
      {
        path: "user",
        name: "User",
        component: () => import("@/views/User/index.vue"),
        meta: { title: "账号管理", icon: "User" },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: { title: "登录" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
