<template>
    <div class='app-container'>
        <div class="searchbox">
            <div class="inputContainer">
                <el-input placeholder="输入设备SN" clearable @keyup.enter.native="getSearchSnList(pid)" :size="isMobile?'small':'medium'"
                    v-model="searchSN">
                    <el-button slot="append" @click="getSearchSnList(pid)" icon="el-icon-search"></el-button>
                </el-input>
            </div>        
        </div>
        <el-table :data="snListData" style="width:100%" v-loading="loading">
            <el-table-column type="index" :label="$t('message.serialNumber')" :width="isMobile?40:50">
            </el-table-column>
            <el-table-column :label="$t('deviceManage.deviceSn')">
                <template slot-scope="scope"> 
                    <div class="fileName">
                       
                        <span @click="toNext(scope.row)" >{{scope.row.sn}}</span>
                     
                    </div> 
                  
                  
                </template>
            </el-table-column>
            <el-table-column :label="$t('deviceManage.productType')">
                <template slot-scope="scope">{{scope.row.productType||'/'}}</template>
             </el-table-column>
        </el-table>
        <el-pagination :small="isMobile" background :layout="layout" @current-change="changePage"
            :page-size="pagesize" :current-page="current" :total="total">
        </el-pagination>
    </div>
    
</template>

<script>
//   import { snListData} from './testData'
  import {
    getFileSnList,searchFileSnList   
    } from "@/api/file";
 
    export default {
       name:'fileList',
        data() {
            return {
                snListData:[],
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
            },
            pid(){
                return this.$route.query.pid
            },
           
            sn(){
                return this.$route.query.sn
            }
        },
        mounted() {
            if(this.pid){
                this.getSnList();
            }else if(this.sn){
                this.searchSN=this.sn;
                this.getSearchSnList();
            }
           
        },
        // activated() {
        //     if(this.$route.meta.isNeedRefresh){
        //         this.getSnList();
        //     }
        //     this.$route.meta.isNeedRefresh=true;
        // },
        methods: {
            
            changePage(currentPage) {
                this.current = currentPage;
                this.getSnList();
            }, 
            getSearchSnList(pid){
                this.loading=true;
                let postData={
                    current:this.current,
                    size:this.pagesize,
                    sn:this.searchSN
                }
                pid?postData.pid=pid:'';
                searchFileSnList(postData).then(res=>{
                    res = res.data
                     this.loading=false;
                    if(res.code==200){
                        this.snListData=res.data.snToAttrs;
                       
                        this.total=res.data.total;
                    }
                }).catch(function (error) { console.log(error); });
            },
            getSnList(){
                this.loading=true;
                let postData={
                    current:this.current,
                    size:this.pagesize,
                    pid:this.pid
                }
                getFileSnList(postData).then(res=>{
                    res = res.data
                     this.loading=false;
                    if(res.code==200){
                        this.snListData=res.data.snToAttrs;
                       
                        this.total=res.data.total;
                    }
                }).catch(function (error) { console.log(error); });
            },        
            toNext(row){ 
                 //this.$router.push(`/fileList/file/${row.sn}`)
                 this.$router.push({
                    path:'/vehicleManage/file',
                    query:{
                        pid:this.pid,
                        sn:row.sn
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