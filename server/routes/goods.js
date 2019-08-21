var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

// 连接成功
mongoose.connection.on("connected",function(){
  console.log('link success');
})

// 连接失败
mongoose.connection.on("error",function(){
  console.log('fail');
})
// 断开连接
mongoose.connection.on("disconnected",function(){
  console.log('disconnected');
})

router.get("/",function(request,response,next){
  let page = parseInt(request.param("page") );
  let pageSize = parseInt(request.param("pageSize"));
  let priceLevel = parseInt(request.param("priceLevel"));
  let sort = parseInt(request.param("sort"));
  let skip = (page - 1) * pageSize;
  var priceGt = "";priceLte = "";
  let params = {};
  if(priceLevel != 'all'){
    switch(priceLevel){
      case '0':priceGt = 0;priceLte=100;break;
      case '1':priceGt = 100;priceLte=500;break;
      case '2':priceGt = 200;priceLte=1000;break;
      case '3':priceGt = 300;priceLte=5000;break;
    }
    params = {
      // salePrice:{
      //   $gt:priceGt,
      //   $lte:priceLte,
      // }
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function(err,doc){
    if(err){
      response.json({
        status:1,
        msg:err.message
      });
    }else{
      response.json({
        status:0,
        message:"",
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  });
})

module.exports = router;