const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/agent-store",
    name: "Agent Store",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "Agent Store",
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
