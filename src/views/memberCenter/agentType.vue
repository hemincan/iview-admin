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
                        title: '代理级别',
                        key: 'name'
                    },
                    {
                        title: '数量',
                        key: 'ableCount'
                    },
                    {
                        title: '总价',
                        key: 'totalMoney'
                    },
                      {
                        title: '积分',
                        key: 'integral'
                    },
                    {
                        title: '备注',
                        key: 'remark'
                    },
                     {
                        title: '直接推荐奖金',
                        key: 'firstRewardMoney'
                    },
                       {
                        title: '碰撞奖金比例',
                        key: 'collisionPer'
                    },
                       {
                        title: '封顶',
                        key: 'topReward'
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
                                                    path: "/system/role/add",
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
                ]
            }
        },
        mounted(){
            this.findPage();
        },
        methods: {
            findPage(){
                this.$http.get("/agentType/findPage?pageIndex=0&pageSize=100000").then(response=> {
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