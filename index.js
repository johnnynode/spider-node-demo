// ----------------------------------------------------------------------------------
//
//  项目需求 : 根据url 获取npmjs网站中搜索的关于nodejs的包
// 
// ----------------------------------------------------------------------------------

"use strict";

const fs = require('fs');  // 引入文件模块
const path = require('path');  // 引入路径模块
const request = require('request');  // 引入网络模块
const cheerio = require('cheerio');  // 引入解析文档模块


// ----------------------------------------------------------------------------------
//  封装需要用到的函数 开始
// ----------------------------------------------------------------------------------


// 把所有的列表放到一个
function getPackageList(url,callback) {    
    // console.log('执行着呢...' + new Date()); // 此处为测试的调用 
    request(url,(err,response,body) => {
        if(err){
            return callback(err,null);
        }
        // 定义一个数组用于存储文章信息对象 packageList
        let packageList = [];  
        // 把得到的字符串解析成一个类似于jQuery的对象
        let $ = cheerio.load(body);  
        // 获取当前页面中每一项的信息 并保存到 packageList 里面
        $('.search-results  li').each(function(index,item){
            // 获取包名
            let $name = $(item).find('h3 .name').text();
            // 获取作者
            let $author = $(item).find('h3 .author').text();
            // 获取描述信息
            let $desc = $(item).find('.description').text();
            // 获取 url 链接
            let $url = 'https://www.npmjs.com'+$(item).find('h3 .name').attr('href');
            // 将每一项数据放入数组中 , 虽然下面只用到了一个 url ，但是我们可以用于数据库的相应字段存储。
            packageList.push({
                name:$name,
                author:$author,
                desc:$desc,
                url:$url
            })
            
        })
        
        // 判断下一页,如果存在下一页，进行递归。
        let nextURL =  $('.pagination .next').attr('href');
        if(nextURL) {
            nextURL = 'https://www.npmjs.com'+nextURL;
            getPackageList(nextURL,(err,nextList) => {
                if(err){
                    return callback(err,null);
                }
                // 如果有下一页，扩展数组 , 并把数组带走
                callback(null,packageList.concat(nextList));
            })
        }else{
            // 如果没有下一页，直接带走数组
            callback(null,packageList);
        }
        
    })
}

// 根据url 获取每一篇关于包的内容
function getDetailByUrl(url,callback) {
    request(url,(err,res,body) => {
        if(err) {
            console.log(err);
            return callback(err,null);
        }
        
        let $ = cheerio.load(body,{
            decodeEntities: false // 转码
        });
        
        // 拿到具体内容的数据
        let content = $('.container.content').html().trim();

        // 返回数据
        callback(null,content);
    })
}




// ----------------------------------------------------------------------------------
//                  开始真正的业务逻辑
// ----------------------------------------------------------------------------------

// 先拿到字符模板
const tempStr = fs.readFileSync(path.join(__dirname,'template.html'),'utf8');
// 设置需要用到的URL
const URL = "https://www.npmjs.com/search?q=nodeapp";  // 这个URL里面有暂时25条记录，所以用这个测试

getPackageList(URL,(err,packageList) => {
    if(err) {
        return console.log(err);
    }
    //  packageList 的遍历 
    packageList.forEach((item,index) => {
        let url = item.url;
        getDetailByUrl(url,(err,content) => {
            if(err) {
                return console.log(err);
            }
            // 文件夹路径
            let realPath = path.join(__dirname,'pages');
            if(!fs.existsSync(realPath)){
                fs.mkdirSync(realPath);
            }
            // 设置网页路径
            let filePath = path.join(realPath,item.name+'.html');
            // 写入文件中
            let htmlStr = tempStr.replace('{{content}}',content).replace('{{name}}',item.name);
            fs.writeFile(filePath,htmlStr,(err) =>{
                if(err) {
                    return console.log(`file : ${filePath} 保存失败！`);
                }
                console.log(`file : ${filePath} 保存成功！`);
            })
        })
    })
})

