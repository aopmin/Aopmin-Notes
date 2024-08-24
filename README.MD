
## 快速上手

```bash
# install dependency
npm install # or yarn install

# develop
npm run dev # or yarn dev

## 目录结构

```
docs
│  index.md -- 首页配置
├─.vuepress -- 用于存放全局的配置、组件、静态资源等
│  │  config.js -- 配置文件的入口文件
│  │  enhanceApp.js -- 客户端应用的增强
│  ├─config
│  │      head.js -- 注入到页面<head>中的配置
│  │      htmlModules.js -- 插入自定义html模块
│  │      nav.js -- 顶部导航栏配置
│  │      plugins.js -- 插件配置
│  │      themeConfig.js -- 主题配置   
│  ├─public -- 静态资源目录
│  │  └─img -- 用于存放图片
│  ├─styles
│  │       palette.styl -- 主题演示配置
│  └─<结构化目录>
├─@pages --自动生成的文件夹
│      archivesPage.md -- 归档页
│      categoriesPage.md -- 分类页
│      tagsPage.md -- 标签页
├─images -- 可以用来存放自己的图片
└─_posts -- 专门存放碎片化博客文章的文件夹，不会自动生成目录
```
