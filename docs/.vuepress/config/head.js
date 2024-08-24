// head
module.exports = [
  // 注入到页面<head> 中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
  ["link", { rel: "icon", href: "/img/favicon.ico" }], //favicons，资源放在public文件夹
  [
    "meta",
    {
      name: "keywords",
      content:
        "个人博客,后端开发,前端开发,技术总结,Java,Python,Go,C#,Vue,JavaScript,Git,Linux,MySQL,Redis,MongoDB,ElasticSearch,Spring,SpringBoot,SpringCloud,Docker,Kubernetes,Istio,Prometheus,Grafana,Nacos,SkyWalking,Istio,Dubbo,Zookeeper,RabbitMQ",
    },
  ],
  ["meta", { name: "baidu-site-verification", content: "7F55weZDDc" }], // 百度统计的站长验证
  ["meta", { name: "theme-color", content: "#11a8cd" }], // 移动浏览器主题颜色
  [
    "script",
    {
      "data-ad-client": "ca-pub-7828333725993554",
      async: "async",
      src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
    },
  ], 
  ['script', { src: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js' }],
];
