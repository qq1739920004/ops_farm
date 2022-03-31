<template>
    <div>
     
        <el-table :data="fileListData" style="width:100%" v-loading="loading">
            <el-table-column type="index" :label="$t('message.serialNumber')" :width="isMobile?40:50">
            </el-table-column>
            <el-table-column :label="$t('deviceManage.fileName')">
                <template slot-scope="scope"> 
                    <div class="fileName">
                        
                        <a :href="baseUrl+'/log_download/'+parentPid+'/'+parentSn+'/'+scope.row.name" v-if="!scope.row.isBack">{{scope.row.name}}</a>
                        <span @click="toBackFile" v-else>{{scope.row.name}}</span>
                    </div> 
                  
                  
                </template>
            </el-table-column>
           
            <el-table-column :label="$t('message.operate')" >
                <template slot-scope="scope">
                 
                    <el-button type="text" v-if="!scope.row.isBack">
                        <a :href="baseUrl+'/log_download/'+parentPid+'/'+parentSn+'/'+'/'+scope.row.name" >{{$t('message.download')}}</a>
                    </el-button>    
                </template>
            </el-table-column>
        </el-table>
    </div>
    
</template>

<script>
//   import {childrenFileList} from './testData'
import {
    getChildrenFileList     
    } from "@/api/file";
    export default {
       
        data() {
            return {
                fileListData:[],
                total: 0,
                current: 1,
                pagesize: 10,
                baseUrl: process.env.VUE_APP_BASE_API,
                loading:false
            }
        },
        watch: {
            
        },
        computed: {
            isMobile() {
                return this.$store.state.app.device == 'mobile'
            },
            parentSn(){
                return this.$route.query.sn
            },
            parentPid(){
                return this.$route.query.pid
            },
            layout() {
                return this.isMobile ? 'total,prev, pager, next' : 'total,prev, pager, next,jumper'
            }
        },
        mounted() {
            this.getFileList();
        },
        // beforeRouteLeave(to, from, next) {
        //     to.meta.isNeedRefresh = false; 
        //     next()
        // },
        methods: {
            changePage(currentPage) {
                this.current = currentPage;
                this.getFileList();
            }, 
            getFileList(){
                this.loading=true;
                let postData={
                    current:this.current,
                    size:this.pagesize,
                    sn:this.parentSn
                }
                getChildrenFileList(postData).then(res=>{
                    res = res.data
                     this.loading=false;
                    if(res.code==200){
                        this.fileListData=[];
                        res.data.records.forEach(item=>{
                            this.fileListData.push({isBack:false,name:item})
                        })
                        // this.fileListData.push({isBack:true,name:'回传文件'})
                        this.total=res.data.total;
                    }
                }).catch(function (error) { console.log(error); });
            },      
           
            toBackFile(){
                this.$router.push(`/vehicleManage/backFile/${this.parentSn}`)
                
            },
            
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