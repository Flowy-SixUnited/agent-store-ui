const Layout = () => import("@/layout/index.vue");

export default [
  // {
  //   path: "/ai-chat",
  //   name: "AI Chat",
  //   component: () => import("@/views/home/index.vue"),
  //   meta: {
  //     title: "智能客服",
  //     showLink: false,
  //     rank: 101
  //   }
  // },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
