<template>
    <div>
     
        <el-table :data="fileListData" style="width:100%" v-loading="loading">
            <el-table-column type="index" :label="$t('message.serialNumber')" :width="isMobile?40:50">
            </el-table-column>
            <el-table-column :label="$t('deviceManage.fileName')">
                <template slot-scope="scope"> 
                    <div class="fileName">
                        
                        <a :href="baseUrl+'/log_download/'+parentSn+'/'+scope.row">{{scope.row}}</a>
                        
                    </div> 
                  
                  
                </template>
            </el-table-column>
           
            <el-table-column :label="$t('message.operate')" >
                <template slot-scope="scope">
                 
                    <el-button type="text" v-if="!scope.row.isBack">
                        <a :href="baseUrl+'/log_download/'+parentSn+'/'+scope.row" >{{$t('message.download')}}</a>
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
                fileListData:['回传文件1','回传文件2','回传文件3'],
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
                return this.$route.params.sn
            },
            layout() {
                return this.isMobile ? 'total,prev, pager, next' : 'total,prev, pager, next,jumper'
            }
        },
        mounted() {
            //this.getBackFileList();
        },
      
        methods: {
            changePage(currentPage) {
                this.current = currentPage;
                this.getFileList();
            }, 
            getBackFileList(){
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
                        this.fileListData.push({isBack:true,name:'回传文件'})
                        this.total=res.data.total;
                    }
                }).catch(function (error) { console.log(error); });
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