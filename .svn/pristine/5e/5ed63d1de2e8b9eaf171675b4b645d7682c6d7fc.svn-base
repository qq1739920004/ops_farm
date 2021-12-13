<template>
  <div class="page7_child1_com_container">
    <div class="search_bar">
      <div class="input_area">
        <el-input v-model="input" size="small" clearable placeholder="输入sn号、姓名、电话" @clear="clearInput()" @input="handleInput" @keyup.enter.native="searchData()">
          <el-button slot="append" :class="{ no_click: !input }" icon="el-icon-search" @click="searchData()" />
        </el-input>
      </div>
      <div class="button_container">
        <el-button-group class="button_group1">
          <el-tooltip class="item" effect="dark" content="历史轨迹" placement="top">
            <el-button class="el-icon-paperclip" size="small" @click.native="redirectToRoute" />
          </el-tooltip>

          <!-- <el-tooltip class="item" effect="dark" content="批量升级" placement="top">
						<el-button icon="el-icon-set-up" size="small"></el-button>
					</el-tooltip> -->

          <el-tooltip class="item" effect="dark" content="刷新数据" placement="top">
            <el-button :icon="loading ? 'el-icon-loading' : 'el-icon-refresh' " size="small" @click="refreshData" />
          </el-tooltip>
        </el-button-group>

        <el-button-group class="button_group2">
          <el-button icon="el-icon-s-unfold" size="small" :class="{ 'tab_active': tableShow }" @click="switchTabShow(true)" />
          <el-button icon="el-icon-menu" size="small" :class="{ 'tab_active': !tableShow }" @click="switchTabShow(false)" />
        </el-button-group>
      </div>
    </div>

    <!-- elementUI 组件 -->
    <div v-show="tableShow" class="table_warpper">
      <sn-table :table-data="tableData" :register-authority="registerAuthority" @showLocus="handleEmitMessage" />
      <el-row type="flex" justify="center" style="margin-top:10px;margin-right:10px;">
        <el-pagination
          background
          layout=" total, prev, pager, next, jumper"
          :page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
        />
      </el-row>

    </div>
    <div v-show="!tableShow" class="card_warpper">
      <sn-card @showLocus="handleEmitMessage" />
    </div>
    <div v-if="locusShow" class="locus_wrapper">
      <locus :car-obj="carObj" @closeMe="handleCloseMe" />
    </div>
  </div>
</template>
<script>
import snTable from './components/snTable'
import snCard from './components/snCard'
import locus from '@/views/locationManage/components/locus'
import { carList_path } from '@/api/vehicleManage'

export default {

	components: {
		snTable,
		snCard,
		locus
	},
	data() {
		return {
			field: 0,
			order: 2,
			input: '',
			currentPage: 1,
			pageSize: 10,
			total: 0,
			loading: false,
			tableData: [],
			tableShow: false,
			locusShow: false,
			registerAuthority: false,
			carObj: {}
		};
	},

	computed: {

	},
	mounted() {
		this.loadData();
		let showString = localStorage.getItem('tableShow');
		this.tableShow = showString === 'true';
	},

	methods: {
		async loadData() {
			this.getRouteParams();
			this.loading = true;
			let total = await carList_path({
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					name: this.input.trim(),
					field: this.field,
					order: this.order
				}).then((res) => {
					try {
						this.loading = false;
						this.total = res.data.page.total;
						this.tableData = res.data.page.list.map((item) => {
							return { ...item, ...item.car };
						});
						this.registerAuthority = res.data.page.codePower || false;
					} catch (err) {
						this.loading = false;
						console.log(err);
					}
					return Promise.resolve(res.data.page.total);
				}).catch(error => {
					this.loading = false;
					console.log(error);
				});
			return total;
		},

		// 点击刷新
		refreshData() {
			this.loadData().then((total) => {
				total ? this.$message.success('刷新成功') : '';
			});
		},

		// 自动刷新
		reloadData() {
			this.loadData();
		},

		// 清除搜索input
		clearInput() {
			this.currentPage = 1;
			this.loadData();
		},

		handleInput(e) {
			if (e.length === 0) {
				this.clearInput();
			}
		},

		searchData() {
			this.currentPage = 1;
			this.loadData().then((total) => {
				this.switchTabShow(true);
				this.$message({
					showClose: true,
					message: `搜索到${total}条记录`,
					type: 'success'
				});
			});
		},

		// 点击页面分页器
		handlePageChange(index) {
			this.currentPage = index;
			this.loadData();
		},

		// 获取路由参数
		getRouteParams() {
			let sn = this.$route.params.deviceSn;
			if (!sn) return;
			this.input = sn;
			this.$route.params.deviceSn = ''; // 清除路由参数
			this.switchTabShow(true);
		},

		redirectToRoute() {
			this.$router.push({
				path: '/vehicleManage/historyRoute'
			})
		},

		switchTabShow(show) {
			this.tableShow = show;
			localStorage.setItem('tableShow', show);
		},

		// 消息桥接
		handleEmitMessage(item) {
			this.carObj = item;
			this.locusShow = true;
		},

		handleCloseMe() {
			this.locusShow = false;
		}
	}
};
</script>
<style scoped lang ='scss'>
.page7_child1_com_container {
    height: 100%;
    position: relative;
    .search_bar {
        $height: 46px;
        height: $height;
        line-height: $height;
        position: relative;
        display: flex;
        justify-content: space-between;
        padding-right: 20px;
        >div.input_area {
            width: 280px;
            padding-left:10px;
            .no_click {
                pointer-events: none;
            }
        }
        .button_container {
            .button_group1 {
                margin-right: 20px;
                .el-button {
                    margin-right: 10px;
                    color: #4CB04F;
                    border-color: #4CB04F;
                    font-size: 20px;
                    padding: 5px 6px;
                    overflow: hidden;
                    height: 32px;
                }
                .el-icon-paperclip:before {
                    content: url('~@/assets/locationManage/route.png');
                    width: 20px;
                    height: 20px;
                }
            }
            .button_group2 {
                .el-button {
                    font-size: 20px;
                    padding: 5px 15px;
                }
                .tab_active {
                    color: #4CB04F;
                    border-color: #4CB04F;
                }
            }

        }

    }
    .card_warpper {
        height: calc(100% - 92px);
        overflow: auto;
    }
    .locus_wrapper {
        position: absolute;
        top: 0px;
        height: 0px;
        width: 100%;
        height: 100%;
    }
}

</style>
