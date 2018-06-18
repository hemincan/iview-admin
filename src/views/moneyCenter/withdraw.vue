<template>
    <div>
       <!--  <div style="margin:8px;text-align:left">
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
    </div>
</template>
<script>
    export default {
        data () {
            return {
                columns7: [
                    {
                         title: '提现人',
                         key: 'user',
                        render: (h, params) => {

                            return h('div', {
                                }, params.row.userName+"("+params.row.userAccount+")");
                        }
                    },
                 {
                        title: '提现金额',
                        key: 'withdrawAmount'
                    },
                      {
                        title: '申请时间',
                        key: 'applicationTime'
                    },
                 {
                        title: '手续费',
                        key: 'poundage'
                    },
                    {
                        title: '实获金额',
                        key: 'realAmount'
                    },
                    {
                        title: '申请人',
                        key: 'bankUserName'
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
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            // this.remove(params.index)
                                        }
                                    }
                                }, '查看')
                            ]);
                        }
                    }
                ],
                data6: [
                ],
                pageData:{
                    pageIndex:0,
                    pageSize:10,
                    totalPages: 0,
                    totalCount: 0
                },
                searchForm:{

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
                this.$http.post("/withdraw/findPage?pageIndex="+this.pageData.pageIndex+"&pageSize="+this.pageData.pageSize+"&orderBy=id desc",this.searchForm).then(response=> {
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