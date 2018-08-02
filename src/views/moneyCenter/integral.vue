<template>
    <div>
       <!--  <div style="margin:8px;text-align:left">
         <Button type="primary" @click="addSkip">添加</Button>
        </div> -->
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
                         title: '获得人',
                         key: 'user',
                        render: (h, params) => {

                            return h('div', {
                                }, params.row.userName+"("+params.row.userAccount+")");
                        }
                    },
                 {
                        title: '获得时间',
                        key: 'receiveDate'
                    },
                 {
                        title: '奖金类型',
                        key: 'type'
                    },
                    {
                        title: '获得积分',
                        key: 'amount'
                    },
                    // {
                    //     title: '备注',
                    //     key: 'remark'
                    // },
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
                }
            }
        },
        mounted(){
            this.findPage();
        },
        methods: {
            findPage(){
                this.$http.get("/bonus/findIntegralPage?pageIndex="+this.pageData.pageIndex+"&pageSize="+this.pageData.pageSize+"&orderBy=id desc").then(response=> {
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
            }
        }
    }
</script>