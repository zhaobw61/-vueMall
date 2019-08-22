<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>Goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a @click="sortGoods" href="javascript:void(0)" class="price" >
            Price
            <svg class="icon icon-arrow-short" >
              <use xlink:href="#icon-arrow-short" />
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd>
                <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked == 'all'}" @click="priceChecked='all'">All</a>
              </dd>
              <dd v-for="(item,index) in priceFilter" v-bind:key="index">
                <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked == index}" @click="setPriceFilter(index)">{{item.startPrice}}-{{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodList" v-bind:key="index">
                  <div class="pic">
                    <a href="#">
                      <img v-lazy="'/static/'+item.productImage" alt />
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img src="./../assets/loading-spinning-bubbles.svg" alt="加载" v-show="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        请先登录，否则无法加入到购物车里！
      </p>
      <div slot="btnGroup">
        <a href="#" class="btn btn--m" @click="mdShow = false">关闭</a>
      </div>
    </modal>

    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">
        <span>加入购物车成功</span>
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShowCart = false">继续购物</a>
        <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>

    <nav-footer></nav-footer>
  </div>
</template>
<style scoped>
.list-wrap ul::after{
  clear: both;
  content: "";
  height: 0;
  display:block;
  visibility: hidden;
}
.load-more{
  height: 100px;
  line-height: 100px;
  text-align:  center;
}
.sort-up{
  transform: rorate(180deg);
  transition: all .3s ease-out;
}
.btn:hover{
  background-color: #ffe5e6;
  transition: add .3s ease-out;
}
</style>
<script>
import './../assets/css/base.css';
import './../assets/css/product.css';
import '@/assets/css/login.css';
import '@/assets/css/checkout.css'
import NavHeader from '@/components/NavHeader';
import NavFooter from '@/components/NavFooter'
import NavBread from '@/components/NavBread';
import Modal from '@/components/Modal'
import axios from 'axios';
export default {
  name: "GoodsList",
  data(){
    return{
      goodList:[],
      loading:false,
      mdShow:false,
      mdShowCart:false,
      priceFilter:[
        {
          startPrice:'0.00',
          endPrice:'500.00'
        },
        {
          startPrice:'500.00',
          endPrice:'1000.00'
        },
        {
          startPrice:'1000.00',
          endPrice:'2000.00'
        }
      ],
      priceChecked:'all',
      filterBy:false,
      overLayFlag:false,
      sortFlag:true,
      page:1,
      pageSize:8,
      busy:true
    }
  },
  components:{
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  mounted:function(){
    this.getGoodsList();
  },
  methods:{
    getGoodsList(flag){
      var param = {
        page:this.page,
        pageSize:this.pageSize,
        sort:this.sortFlag?1:-1,
        priceLevel:this.priceChecked,
      }
      this.loading = true;
      axios.get('/goods/list',{
        params:param
      }).then((response)=>{
        let res = response.data;
        this.loading = false;
        if(res.status == "0"){
          if(flag){
            this.goodList = this.goodList.concat(res.result.list);
            if(res.result.list.count == 0){
              this.busy = true;
            }else{
              this.busy = false;
            }
          }else{
            this.goodList = res.result.list;
            this.busy = false;
          }
        }else{
          this.goodList = [];
        }
        console.log(this.goodList);
      });
    },
    sortGoods(){
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.goodList = [];
    },
    loadMore(){
      this.busy = true;
      setTimeout(()=>{
        this.page ++;
        this.getGoodsList(true);
      },500);
    },
    showFilterPop(){
      this.filterBy = true;
      this.overLayFlag = true;
    },
    setPriceFilter(index){
      this.priceChecked = index;
      // this.closePop();
      this.page = 1;
      this.getGoodsList();
    },
    closePop(){
      this.filterBy = false;
      this.overLayFlag = false;
    },
    addCart(productId){
      axios.post("/goods/addCart",{
        productId:productId
      }).then((res)=>{
        console.log(res);
        if(res.data.status == 0){
          alert("加入成功");
        }else{
          this.mdShow = true;
        }
      })
    },
    closeModal(){
      this.mdShow = false;
      this.mdShowCart = false;
    }
  }
};
</script>
