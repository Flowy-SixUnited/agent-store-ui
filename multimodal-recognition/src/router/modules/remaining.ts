const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/multimodal-recognition",
    name: "Multimodal Recognition",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "多模态识别",
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
