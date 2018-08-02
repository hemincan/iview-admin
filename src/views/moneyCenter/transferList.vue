<template>
    <div>
        <!-- <div style="margin:8px;text-align:left">
         <Button type="primary" @click="addSkip">添加</Button>
        </div> -->
        
        <Table border :columns="columns7" :data="data6"></Table>
        <Page :total="pageData.totalCount" size="small" show-elevator show-sizer @on-change="pageChange"></Page>
       
    </div>
</template>
<script>
    export default {
        data () {
            return {
                columns7: [
                 {
                        title: '时间',
                        key: 'transferDate',
                        width:110
                    },
                  
                        {
                        title: '用户帐号',
                        key: 'userAccount'
                    },
                   {
                        title: '类型',
                        key: 'type',
                        render:(h, params) => {
                            var str = "未知";
                            if (params.row.type==1) {
                                str="转出";
                            }else if(params.row.type==2){
                                str="收到";
                            }
                            return h('div',str)
                        }
                    },
                    {
                        title: '金额',
                        key: 'amount'
                    },
                     {
                        title: '相关人帐号',
                        key: 'fromToUserAccount',
                        render: (h, params) => {
                            return h('div',params.row.fromToUserAccount+"("+params.row.fromToUserName+")");
                        }
                    },
                    //  {
                    //     title: '相关人姓名',
                    //     key: 'fromToUserName'
                    // },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看')])
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
                this.$http.get("/transfer/findPage?pageIndex="+this.pageData.pageIndex+"&pageSize="+this.pageData.pageSize+"&orderBy=id desc").then(response=> {
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
                var content = `编号：${this.data6[index].id}<br>日期：${this.data6[index].transferDate}<br>金额：${this.data6[index].amount}元<br>备注：${this.data6[index].mark}<br>相关人帐号：${this.data6[index].fromToUserAccount}<br>相关人名字：：${this.data6[index].fromToUserName}`;
                this.$Modal.info({
                    title: '详细信息',
                    content: content
                })
            },
            remove (index) {
                this.data6.splice(index, 1);
            }
        }
    }
</script>