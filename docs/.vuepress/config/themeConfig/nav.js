// nav
module.exports = [
    {text: '首页', link: '/'},
    {
        text: 'Java',
        link: '/Java/', //目录页链接，此处link是vdoing主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
        items: [
            // 说明：以下所有link的值只是在相应md文件定义的永久链接（不是什么特殊生成的编码）。另外，注意结尾是有斜杠的
            {
                text: 'Stream流', link: '/Java/Stream流/'
            },
        ],
    },
    {
        text: 'JavaWeb',
        link: '/JavaWeb/',
        items: [
            {text: 'Maven', link: '/JavaWeb/Maven/'},
        ],
    },
    {
        text: '数据库',
        link: '/数据库/',
        items: [
            {text: 'MySQL', link: '/数据库/MySQL/'},
            {text: 'MongoDB', link: '/数据库/MongoDB/'},
            {text: 'Redis', link: '/数据库/Redis/'},
        ],
    },
    {
        text: '中间件',
        link: '/中间件/',
        items: [
            {text: 'RabbitMQ', link: '/中间件/RabbitMQ/'},
            {text: 'RocketMQ', link: '/中间件/RocketMQ/'},
            {text: 'Kafka', link: '/中间件/Kafka/'},
        ],
    },
  {
    text: '微服务',
    link: '/微服务/',
    items: [
      {text: 'SpringCloud', link: '/微服务/SpringCloud/'},
      {text: 'Dubbo3', link: '/微服务/Dubbo3/'},
    ],
  },
    {
        text: '索引',
        items: [
            {text: '分类', link: '/categories/'},
            {text: '标签', link: '/tags/'},
            {text: '归档', link: '/archives/'}
        ]
    },
]
