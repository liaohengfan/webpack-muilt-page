module.exports={
    dev_host: "192.168.40.209",
    dev_port: 8090,
    favicon: './src/images/favicon.ico',
    commonname: "common",
    cssOutPath:"./css",
    cssPublicPath:"../",
    fontsOutPath:"./fonts",
    imageOutPath:"./img",
    entrys:[
        {
            title:"主页",
            name:"index",
            entry:"./src/com/index/index.ts",
            template:'./src/htmls/index.html',
            filename:"./index.html"
        },
        {
            title:"登录",
            name:"login",
            entry:"./src/com/login/login.ts",
            template:'./src/htmls/login.html',
            filename:"./login/index.html"
        }
    ]
};