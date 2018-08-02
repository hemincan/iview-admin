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
        <Modal
            v-model="modal6"
            title="请处理完成以下信息"
            :loading="loading"
            :mask-closable="false"
            @on-ok="asyncOK">
            <div v-if="currentRow!=null" style="font-size:15pt">
                

               <!--  <div>{{currentRow.id}}</div>
                <div>{{currentRow.userName}}</div>
                <div>{{currentRow.userAccount}}</div>
                <div>{{currentRow.withdrawAmount}}</div>
                <div>{{currentRow.applicationTime}}</div> -->
                <div>提现金额：{{currentRow.realAmount}}</div>
                <div>银行卡号：{{currentRow.bankCard}}</div>
                <div>银行名：{{currentRow.bankName}}</div>
                 <div>银行户名：{{currentRow.bankUserName}}</div>
                 <div v-if="currentRow.state==1" style="color:red">
                   此条项目已经处理过
                   <br>
                   处理人：{{currentRow.handleAccount}}<br>
                   处理时间：{{currentRow.handleDate}}
                   </div>
             </div>
        </Modal>
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
                    // {
                    //     title: '申请人',
                    //     key: 'bankUserName'
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
                            var enable = true;
                            if(params.row.state==0){
                                enable =false;
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
                                        disabled:enable
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                             this.handle(params.index,params.row)
                                        }
                                    }
                                }, '处理'),
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                             this.show(params.index,params.row)
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

                },
                modal6: false,
                loading: true,
                currentRow:null
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
            show (index,row) {
                 this.currentRow = row;
                 this.modal6=true;
            },
            handle (index,row) {
                // this.$Modal.info({
                //     title: 'User Info',
                //     content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
                // })
                this.currentRow = row;
                this.modal6=true;
            },
            asyncOK(){
                console.log(this.currentRow.state)
                if (this.currentRow.state==1) {
                    this.loading=false;
                    return;
                }
                this.modal6=false;
                // this.loading=true;
                this.$http.post("/withdraw/active?id="+this.currentRow.id).then(response=> {
                      var data = response.data;
                      this.modal6=false;
                      // this.loading=false;
                      this.$Message.success(data.message);
                      this.findPage();
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