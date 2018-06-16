<template>
    <div>
        <div style="margin:8px;text-align:left">
         <Button type="primary" @click="addSkip">添加</Button>
        </div>
        <Table border :columns="columns7" :data="data6"></Table>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                columns7: [
                    {
                        title: '角色名',
                        key: 'roleName'
                    },
                    {
                        title: '备注',
                        key: 'remark'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 350,
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
                                                    path: "/system/role/add",
                                                    query: {id: params.row.id,type:"edit"}
                                                });
                                          }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '添加可访问菜单')
                            ]);
                        }
                    }
                ],
                data6: [
                ]
            }
        },
        mounted(){
            this.findPage();
        },
        methods: {
            findPage(){
                this.$http.get("/role/findPage?pageIndex=0&pageSize=100000").then(response=> {
                      var data = response.data;
                      this.data6=data.result.result;
                })
            },
            addSkip(){
                this.$router.push({path: '/system/role/add'});
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