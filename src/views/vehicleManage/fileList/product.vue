<template>
    <div class='app-container'>
        <div class="searchbox">
            <div class="inputContainer">
                <el-input placeholder="输入设备SN" clearable @clear="changePage(1)" @keyup.enter.native="refreshSn" :size="isMobile?'small':'medium'"
                    v-model="searchSN">
                    <el-button slot="append" @click="refreshSn" icon="el-icon-search"></el-button>
                </el-input>
            </div>        
        </div>
        <el-table :data="productListData" style="width:100%" v-loading="loading">
            <el-table-column type="index" :label="$t('message.serialNumber')" :width="isMobile?40:50">
            </el-table-column>
            <el-table-column :label="$t('deviceManage.productType')">
                <template slot-scope="scope"> 
                    <div class="fileName">
                       
                        <span @click="toNext(scope.row)" >{{scope.row.productType}}</span>
                     
                    </div> 
                  
                  
                </template>
            </el-table-column>
           
        </el-table>
        <el-pagination :small="isMobile" background :layout="layout" @current-change="changePage"
            :page-size="pagesize" :current-page="current" :total="total">
        </el-pagination>
    </div>
    
</template>

<script>
//   import { productListData} from './testData'
  import {
    getFileProductList     
    } from "@/api/file";
 
    export default {
       name:'productList',
        data() {
            return {
                productListData:[],
                total: 0,
                current: 1,
                pagesize: 10,
                searchSN:'',
                loading:false
            }
        },
        watch: {
            
        },
        computed: {
            isMobile() {
                return this.$store.state.app.device == 'mobile'
            },
           
            layout() {
                return this.isMobile ? 'total,prev, pager, next' : 'total,prev, pager, next,jumper'
            }
        },
        mounted() {
            this.getProductList();
        },
        // activated() {
        //     if(this.$route.meta.isNeedRefresh){
        //         this.getProductList();
        //     }
        //     this.$route.meta.isNeedRefresh=true;
        // },
        methods: {
            refreshSn(){
                if(this.searchSN){
                    this.$router.push({
                        path:`/vehicleManage/device`,
                        query:{sn:this.searchSN}
                    })
                }
            },
            changePage(currentPage) {
                this.current = currentPage;
                this.getProductList();
            }, 
            getProductList(){
                this.loading=true;
                let postData={
                    current:this.current,
                    size:this.pagesize,                
                }
                getFileProductList(postData).then(res=>{
                    res = res.data
                     this.loading=false;
                    if(res.code==200){
                        this.productListData=res.data.pidToAttrs;
                        this.total=res.data.total;
                    }
                }).catch(function (error) { console.log(error); });
            },        
            toNext(row){ 
              
                this.$router.push({
                    path:'/vehicleManage/device',
                    query:{
                        pid:row.pid,
                        productType:row.productType
                    }
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    .fileName{
        text-decoration: underline;
        color: rgb(64, 158, 255);
        cursor: pointer;
    }
</style>