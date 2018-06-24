<template>
    <div>
      <!--   <div style="margin:8px;text-align:left">
         <Button type="primary" @click="addSkip">添加</Button>
        </div> -->
         <div style="margin:8px;text-align:left;width:300px;">
                输入用户帐号：<Input v-model="searchForm.userAccount" placeholder="输入用户帐号" >
                    
                      <Button slot="append" type="primary" @click="serach">搜索</Button>
                </Input>
              
        </div>
        <Table border :columns="columns7" :data="data6"></Table>
        <Page :total="pageData.totalCount" size="small" show-elevator show-sizer @on-change="pageChange"></Page>
        <!-- {{pageData}} -->
          <Modal
            v-model="modal6"
            title="请确认"
            @on-ok="asyncOK">
            <div v-if="currentRow!=null">
                <p>{{currentRow.userName}}（{{currentRow.userAccount}}）</p>
             <p>{{currentRow.totalMoney}}元</p>
            </div>
            <p style="color:red;">请确认用户已经付款，此操作会使此订单启用，并会发放奖金和积分给推荐人,确认请按确认。</p>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                columns7: [
                 {
                        title: '时间',
                         key: 'user',
                        render: (h, params) => {

                            return h('div', {
                                }, params.row.userName+"("+params.row.userAccount+")");
                        }
                    },
                      {
                        title: '申请时间',
                        key: 'applyDate'
                    },
                 {
                        title: '代理类型',
                        key: 'goodsType'
                    },
                    {
                        title: '地址',
                        key: 'receiverAddress'
                    },
                    {
                        title: '收货人',
                        key: 'receiverName'
                    },
                    {
                        title: '手机',
                        key: 'receiverPhone'
                    },
                        {
                        title: '数量',
                        key: 'goodsCount'
                    },
                     {
                        title: '总价',
                        key: 'totalMoney'
                    },
                  
                    {
                        title: '备注',
                        key: "remark"
                    },
                     {
                        title: '状态',
                        key: "state",
                         render: (h, params) => {
                            var state = "";
                            if(params.row.state==0){
                                state = "未处理";
                            }else{
                                state = "已完成";
                            }
                            return h('div', {
                                }, state);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            var disabled = false;
                             if(params.row.state==1){
                                disabled=true;
                             }
                            return h('div', [
                                // h('Button', {
                                //     props: {
                                //         type: 'primary',
                                //         size: 'small'
                                //     },
                                //     style: {
                                //         marginRight: '5px'
                                //     },
                                //     on: {
                                //         click: () => {
                                //               this.$router.push({
                                //                     path: "/system/user/add",
                                //                     query: {id: params.row.id,type:"edit"}
                                //                 });
                                //           }
                                //     }
                                // }, '编辑'),
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
                                }, '处理报单')
                            ]);
                        }
                    }
                ],
                data6: [
                ],
                currentRow:null,
                modal6:false,
                pageData:{
                    pageIndex:0,
                    pageSize:10,
                    totalPages: 0,
                    totalCount: 0
                },
                searchForm:{
                   userAccount:null,
                }
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
                }
                this.$http.post("/applyGoods/findPage?pageIndex="+this.pageData.pageIndex+"&pageSize="+this.pageData.pageSize+"&orderBy=id desc",this.searchForm).then(response=> {
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
                this.modal6=false;
                 this.$http.get("/applyGoods/active?id="+this.currentRow.id).then(response=> {
                     alert(response.data.message);
                     row.state=1;
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
            }
        }
    }
</script>