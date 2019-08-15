# vuemall

> A Vue.js project

## 前端路由

- 路由是根据不同的url 地址展示不同的内容和页面。
- route就是对history的封装。
- 设置路由模式:mode:history/hash

### 优点：

- 用户体验好，不需要每次都从服务器全部获取，快速展示给用户

### 缺点：

- 不利于SEO

- 使用浏览器的前进和后退会重新发起请求，没有办法合理的利用缓存。

- 单页面无法记住之前的滚动的位置。

### 路由类型

- 动态路由

- 嵌套路由：路由嵌套路由

- 编程式路由：通过JS来实现页面跳转。

- 命名路由：给路由定义不同的名字，根据名字进行匹配

### 命名视图

- 给不同的router-view定义名字，通过名字进行对应的组件渲染

## AMD CMD CommonJs ES6

### AMD:是requireJS在推广的过程中对模块化定义的规范产出

- 依赖前置，异步

- define

### CMD:是SeaJS在推广的过程中对模块定义的规范产出

- 依赖就近

- define、require

### commonJS

- module.exports require

- 在后端使用

### ES6

- export import

- 



