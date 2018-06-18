<template>
    <div>
        <div style="margin:8px;text-align:left">
         <Button type="primary" @click="addSkip">添加</Button>
        </div>
        <Table border :columns="columns7" :data="data6"></Table>
        <Page :total="pageData.totalCount" size="small" show-elevator show-sizer @on-change="pageChange"></Page>
        <!-- {{pageData}} -->
          <Modal
            v-model="modal6"
            title="分配角色"
            :loading="loading"
            @on-ok="asyncOK">
            <Table border ref="selection" :columns="columns4" :data="roleData" @on-selection-change="selectionChange"></Table>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                 columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '角色名',
                        key: 'roleName'
                    },
                    {
                        title: '英文名',
                        key: 'enName'
                    },
                    {
                        title: '备注说明',
                        key: 'remark'
                    }
                ],
               roleData:[],
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
                        title: '拥有角色',
                        key: 'role',
                         render: (h, params) => {
                            var role = "";
                            for (var i = params.row.roleList.length - 1; i >= 0; i--) {
                               role+= params.row.roleList[i].roleName+"("+params.row.roleList[i].enName+")，";
                            }
                            return h('div',  role);
                        }
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
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            // this.remove(params.index)
                                            this.addRoleToUser(params.row);
                                        }
                                    }
                                }, '分配角色')
                            ]);
                        }
                    }
                ],
                data6: [
                ],
                loading:false,
                modal6:false,
                selectRole:[],
                editUser:{},
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
                this.$http.get("/user/findAdminUserPage?pageIndex="+this.pageData.pageIndex+"&pageSize="+this.pageData.pageSize).then(response=> {
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
            addRoleToUser(row){
                this.modal6=true;
                this.selectRole=[];
                this.findRole();
                this.editUser=row;
            },
            asyncOK(){
                this.modal6=false;
                var ids='';
                for (var i = this.selectRole.length - 1; i >= 0; i--) {
                    ids+=this.selectRole[i].id+",";
                }
                 this.$http.get("/role/addRoleToUser?userId="+ this.editUser.id+"&roleIds=" + ids).then(response=> {
                      var data = response.data;
                     alert(data.message)
                })
            },
            findRole(){
                 this.$http.get("/role/findPage?pageIndex=0&pageSize=100000").then(response=> {
                      var data = response.data;
                      this.roleData=data.result.result;
                })
            },
            selectionChange(selection){
                // console.log(selection);
                this.selectRole=selection;

            }
        }
    }
</script>