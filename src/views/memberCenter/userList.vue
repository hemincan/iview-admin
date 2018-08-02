<template>
    <div>
      <!--   <div style="margin:8px;text-align:left">
         <Button type="primary" @click="addSkip">添加</Button>
        </div> -->
         <div style="margin:8px;text-align:left;width:300px;">
                输入用户帐号：<Input v-model="searchForm.accountNumber" placeholder="输入用户帐号" >
                    
                      <Button slot="append" type="primary" @click="serach">搜索</Button>
                </Input>
              
        </div>
        <Table border :columns="columns7" :data="data6"></Table>
        <Page :total="pageData.totalCount" size="small" show-elevator show-sizer @on-change="pageChange"></Page>
        <!-- {{pageData}} -->
          <Modal
            v-model="modal6"
            title="请确认"
            :mask-closable='false'
            @on-ok="asyncOK">

            是否确认禁用该帐号？   {{currentRow.userName}}</p>
        </Modal>

          <Modal
            v-model="detailInfo"
            title="统计信息"
            :mask-closable='false'
            @on-ok="detailInfoaSyncOK">
                <!-- {{statisticsData}} -->
            直招代理数量：{{statisticsData.agentCount}}<br>
            代理申请单总记录：{{statisticsData.applyGoodsCount}}<br>
            直招代理总业绩：{{statisticsData.totalApplyMoney}}<br>
            代理列表：<br>
            <div v-if="recommendUserList!=null " v-for="item in recommendUserList">
                {{item.accountNumber}}（{{item.userName}}）（{{item.agentTypeName}}）
            </div>
            </p>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                columns7: [
                 {
                        title: '编号',
                        key: 'id'
                    },
                     {
                        title: '帐号',
                        key: 'accountNumber'
                    },
                 {
                        title: '姓名',
                        key: 'userName'
                    },
                    {
                        title: '注册时间',
                        key: 'registerTime'
                    },
                    {
                        title: '最后登录 ',
                        key: 'lastLoginTime'
                    },
                    {
                        title:'推荐人',
                        render: (h, params) => {
                            if(params.row)
                             return h('div', {
                                }, params.row.recommendUser.userName);
                        }
                    },
                    {
                        title: '手机',
                        key: 'phone'
                    },
                        {
                        title: '余额',
                        key: 'balance'
                    },
                     {
                        title: '所获得积分',
                        key: 'integral'
                    },
                  
                    // {
                    //     title: '状态',
                    //     key: "isActivate"
                    // },
                     {
                        title: '状态',
                        key: "isActivate",
                         render: (h, params) => {
                            var state = "";
                            if(params.row.isActivate==0){
                                state = "未激活";
                            }else if(params.row.isActivate==1){
                                state = "正常";
                            }else{
                            	state="禁用";
                            }
                            return h('div', {
                                }, state);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 250,
                        align: 'center',
                        render: (h, params) => {
                            var disabled = false;
                             if(params.row.isActivate==0){
                                disabled=true;
                             }
	                          var btnstr ="禁用帐号";
	                            if(params.row.isActivate==2){
	                            	btnstr="解除"
	                            }
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                               this.findStatisticsData(params.row);
                                          }
                                    }
                                }, '查看统计'),
                               
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: disabled
                                    },
                                    on: {
                                        click: () => {
                                            this.active(params.row)
                                        }
                                    }
                                }, btnstr)
                            ]);
                        }
                    }
                ],
                data6: [
                ],
                currentRow:[],
                modal6:false,
                pageData:{
                    pageIndex:0,
                    pageSize:10,
                    totalPages: 0,
                    totalCount: 0
                },
                searchForm:{
                   accountNumber:null,
                },
                statisticsData:[],
                detailInfo:false,
                recommendUserList:[]
            }
        },
        mounted(){
            this.findPage();
        },
        methods: {
            findPage(){
                for (var s in this.searchForm) {
                    if(this.searchForm[s]==''){
                        this.searchForm[s]=null;
                    }
                    if(this.searchForm[s]!=null){
                        this.searchForm[s] = this.searchForm[s].replace(/ /g,"");
                    }
                }
                this.$http.post("/user/findNormalUserPage?pageIndex="+this.pageData.pageIndex+"&pageSize="+this.pageData.pageSize+"&orderBy=id desc",this.searchForm).then(response=> {
                      var data = response.data;
                      this.data6=data.result.result;
                      this.pageData.totalCount=data.result.totalCount;
                      this.pageData.totalPages = data.result.totalPages;
                })
            },
            addSkip(){
                this.$router.push({path: '/system/user/add'});
            },
            pageChange(pageIndex){
                this.pageData.pageIndex=pageIndex;
                this.findPage();
            },
            
            active(row){
                this.modal6=true;
                this.currentRow=row;
            },
            asyncOK(){
                // this.modal6=false;
                 this.$http.get("/user/forbidOrUnforbid?userId="+this.currentRow.id).then(response=> {
                     // alert(response.data.message);
                     this.findPage();//重新找这一页的
                })
            },
            show (index) {
                this.$Modal.info({
                    title: 'User Info',
                    content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
                })
            },
            remove (index) {
                this.data6.splice(index, 1);
            },
            serach(){
                this.findPage();
            },
             findStatisticsData(item){
                this.detailInfo = true;
               this.$http.get("/agentTree/statisticsByUserId?userId="+item.id).then(response=> {
                          var data = response.data;
                          this.statisticsData = data.result;
               });
               this.recommendUserList=[];
               this.getRecommendUserList(item);
            },
            detailInfoaSyncOK(){
                this.detailInfo=false;
            },
            getRecommendUserList(item){
                 this.$http.get("/agentTree/recommendedStructureByUserId?userId="+item.id).then(response=> {
                          var data = response.data;
                          this.recommendUserList=data.result;
                 });
            }
        }
    }
</script>