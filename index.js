const express = require('express')
const app = express()
const superagent = require('superagent')
const cheerio = require('cheerio')

var hotNews = []
var a = []

superagent.get('http://news.baidu.com/').end((err, res) => {
    if(err) {
      console.log(`热点新闻抓取失败-${err}`)
    }
    a.push(res)
    hotNews.push(getHotNews(res))
})

let getHotNews = (res) => {
  let arr = [];
  // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。
  
  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text);

  // 找到目标数据所在的页面元素，获取数据
  $('div#pane-news ul li a').each((idx, ele) => {
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    let news = {
      title: $(ele).text(),        // 获取新闻标题
      href: $(ele).attr('href')    // 获取新闻网页链接
    };
    arr.push(news)              // 存入最终结果数组
  });
  return arr
};

app.get('/', async (req, res, next) => {
  res.send(hotNews);
});

app.get('/a', async (req, res, next) => {
  res.send(a);
});

let server = app.listen(4444, function(){
  let host = server.address().address
  let port = server.address().port
  console.log(`Your App is running at http://${host}:${port}`)
})