module.exports = {
  title: '没落英雄',
  description: '',

  base: '/moluoyingxiong/',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  theme: 'reco',
  themeConfig: {
    type: 'blog',
    mode: 'dark', // 默认 auto，auto 跟随系统，dark 暗色模式，light 亮色模式
    modePicker: false,
    author: 'bean',
    logo: '/head.png',
    subSidebar: 'auto',
    sidebar: [
      {
          title: '欢迎学习',
          path: '/',
          collapsable: false, // 不折叠
          children: [
            { title: "学前必读", path: "/" }
          ]
      },
      {
        title: "基础学习",
        path: '/vue/ConditionalTypes',
        collapsable: false, // 不折叠
        children: [
          { title: "条件类型", path: "/vue/ConditionalTypes" },
          { title: "泛型", path: "/vue/Generics" }
        ],
      }
    ]
  },
  dest: 'docs'
}