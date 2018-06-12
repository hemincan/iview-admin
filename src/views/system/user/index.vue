<template>
    <div>
        <div style="margin:8px;text-align:left">
         <Button type="primary" @click="addSkip">添加</Button>
        </div>
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
                        title: '帐号',
                        key: 'accountNumber'
                    },
                    {
                        title: '用户姓名',
                        key: 'userName'
                    },
                    {
                        title: '手机',
                        key: 'phone'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
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
                                              this.$router.push({
                                                    path: "/system/user/add",
                                                    query: {id: params.row.id,type:"edit"}
                                                });
                                          }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data6: [
                ],
                pageData:{
                    pageIndex:0,
                    pageSize:15,
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
                this.$http.get("/user/findPage?pageIndex="+this.pageData.pageIndex+"&pageSize="+this.pageData.pageSize).then(response=> {
                      var data = response.data;
                      this.data6=data.result.result;
                      this.totalCount=data.totalCount;
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