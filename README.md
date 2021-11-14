# NoMoKoBBS
一个由NodeJS/MongoDB/Koa2完成的BBS论坛后台服务

## 启动
```cmd
npm install #安装依赖
npm run start #本地启动
npm run dev #测试环境启动
npm run prod #线上部署 ./build目录下放前端代码
```

## 模块介绍

### session模块
1. 登录成功
    - 签发携带`userId` 和`loginTime`的session(koa-session也使用了redis存储)
    - 额外在redis中以`login_userId:session`形式存储一份
2. 请求接口/api/v1/!un_auth
    - 从cookies中获取sessionId
    - 由sessionId读取`userId` 和`loginTime`(从koa-session中)
    - 由key`login_userId`读取redis中的`loginTime`
    - 对比两个登录时间是否一致
    - 如果一致，刷新kos-session的有效时间，放行
    - 如果不一致，说明有其他用户登录
3. 请求接口/api/v1/un_auth/*或非api
    - 放行

### 验证码模块
1. 更具手机号获取图片验证码，redis中存储，有效期15分钟
2. 根据手机号和图片验证码发送短信验证码
3. 如果图片验证码正确，则发送短信，并在redis中记录此手机号发送短信时间，防止频繁请求
4. 如果图片验证码不正确则拒绝

### 登录模块
1. 获取登录包，含rsa公钥和ticket
2. 根据rsa公钥对ticket/手机号/密码进行RAS加密
3. 后端根据rsa私钥进行解密获取ticket/手机号/密码
4. 进行ticket验证，包括时间戳和ticket真实性检验
5. 由redis对手机号和ticket进行重写验证：查找此手机号对应的ticket，如果不存在或者查到的ticket与要验证的不相等，则通过，然后redis中存储`ticket_phone:ticket`
6. 4和5都通过则安全验证完成，接下来验证账号密码，然后是业务处理


## git 表情

| 表情 | 代码 | 说明 |
| :----| :---- | :---- |
| :art: (调色板) | :art: | 改进代码结构/代码格式 |
| :zap: (闪电):racehorse: (赛马) | :zap: :racehorse: | 提升性能 |
| :fire: (火焰) | :fire: | 移除代码或文件 |
| :bug: (bug) | :bug: | 修复 bug |
| :ambulance: (急救车) | :ambulance: | 重要补丁 |
| :sparkles: (火花) | :sparkles: | 引入新功能 |
| :memo: (备忘录) | :memo: | 撰写文档 |
| :rocket: (火箭) | :rocket: | 部署功能 |
| :lipstick: (口红) | :lipstick: | 更新 UI 和样式文件 |
| :tada: (庆祝) | :tada: | 初次提交 |
| :white_check_mark: (白色复选框) | :white_check_mark: | 增加测试 |
| :lock: (锁) | :lock: | 修复安全问题 |
| :apple: (苹果) | :apple: | 修复 macOS 下的问题 |
| :penguin: (企鹅) | :penguin: | 修复 Linux 下的问题 |
| :checkered_flag: (旗帜) | :checkered_flag: | 修复 Windows 下的问题 |
| :bookmark: (书签) | :bookmark: | 发行/版本标签 |
| :rotating_light: (警车灯) | :rotating_light: | 移除 linter 警告 |
| :construction: (施工) | :construction: | 工作进行中 |
| :green_heart: (绿心) | :green_heart: | 修复 CI 构建问题 |
| :arrow_down: (下降箭头) | :arrow_down: | 降级依赖 |
| :arrow_up: (上升箭头) | :arrow_up: | 升级依赖 |
| :construction_worker: (工人) | :construction_worker: | 添加 CI 构建系统 |
| :chart_with_upwards_trend: (上升趋势图) | :chart_with_upwards_trend: | 添加分析或跟踪代码 |
| :hammer: (锤子) | :hammer: | 重大重构 |
| :heavy_minus_sign: (减号) | :heavy_minus_sign: | 减少一个依赖 |
| :whale: (鲸鱼) | :whale: | Docker 相关工作 |
| :heavy_plus_sign: (加号) | :heavy_plus_sign: | 增加一个依赖 |
| :wrench: (扳手) | :wrench: | 修改配置文件 |
| :globe_with_meridians: (地球) | :globe_with_meridians: | 国际化与本地化 |
| :pencil2: (铅笔) | :pencil2: | 修复 typo |