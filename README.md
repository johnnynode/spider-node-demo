# nodejs使用cheerio包爬页面小程序

nodejs爬虫小程序 - 爬取npmjs网站的内容

### 安装
- $ npm i

### 运行 
- $ node index
- 稍等片刻，就会发现data文件夹里就会多出来很多被爬下来的页面

### 说明
- 此程序仅仅作为学习交流使用，可作适当修改，来爬别的网站，
- 不可用于网络犯罪，不可用于对网站进行攻击，
- 对于任何侵权行为，本人概不负责。

### 改进
- 此小程序可以进一步改进
- 比如说data文件夹可以在程序中进行判断创建
- 比如说样式问题，这个以后可以把所有样式也爬下来，有待改进。
- 还比如说程序的健壮性可扩展性
- 如果以后有时间，再来好好看看这个。

### 其他
- 由于网络的不确定性，程序是有可能出现错误的，常见的问题就是 ` connect ETIMEDOUT` 这个是正常的。
- 如果网络良好，所爬页面数量不是很多，并且被爬网站页面结构未做修改，可以确保正常运行。
- 如果所爬页面过多，那么...