<!-- 创建代理页面 -->
<template>
	<Card>
            <p slot="title">
                <Icon type="person"></Icon>
                注册代理
            </p>
            <div style="width:500px">
		    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
		        <FormItem label="用户姓名：" prop="userName">
		            <Input v-model="formValidate.userName" placeholder="用户姓名"></Input>
		        </FormItem>
                <FormItem label="身份证号" prop="identityCard">
                    <Input v-model="formValidate.identityCard" placeholder="身份证号"></Input>
                </FormItem>
		        <FormItem label="用户密码：" prop="userPassword">
		            <Input v-model="formValidate.userPassword" placeholder="设置用户密码"></Input>
		        </FormItem>
                <FormItem label="二级密码：" >
                    666666（请登录系统后更改）
                </FormItem>
                <FormItem label="手机号码：" prop="phone">
                    <Input v-model="formValidate.phone" placeholder="手机号码 "></Input>
                </FormItem>
                <FormItem label="QQ号" prop="qqNumber">
                    <Input v-model="formValidate.qqNumber" placeholder="QQ号"></Input>
                </FormItem>

                <FormItem label="推荐人:" prop="recommendAccount">
                    {{formValidate.recommendAccount}}
                </FormItem>
                 <FormItem label="性别：">
                   <!--  <span>{{ formValidate.userSex }}</span> -->
                    <Select v-model="formValidate.userSex" placeholder="选择性别">
                        <Option value="1">男</Option>
                        <Option value="0">女</Option>
                    
                    </Select>
                </FormItem>
                <!-- {{formValidate.agentTypeId}} -->
		        <FormItem label="代理类型：" prop="agentTypeId">
		            <Select v-model="formValidate.agentTypeId" placeholder="代理类型">
                    <div  v-for="item in agentType">
                         <Option :value="item.id" :key="item.id">{{item.name}} </Option>

                    </div>
		               
		            </Select>
		        </FormItem>
                <FormItem label="放置区域：" v-if="showPosition" >
                    <!-- <span>{{ formValidate.position }}</span> -->
                    <Select v-model="formValidate.position" placeholder="放置区域">
                        <Option value="left">左区</Option>
                        <Option value="right">右区</Option>
                    
                    </Select>
                </FormItem>
                 <FormItem label="放置区域：" v-if="!showPosition" >
                    <span>放在{{formValidate.treeParentAccount}}的{{ formValidate.position }}</span>
                   
                </FormItem>
                
                 <FormItem label="收货地址：" prop="address">
                    <Input v-model="formValidate.address" placeholder="输入完整的收货地址"></Input>
                </FormItem>
		        <FormItem>
		            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
		            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
		        </FormItem>
		    </Form>
		</div>
        
         <Modal
            v-model="modal6"
            title="注册成功"
            :loading="loading"
            @on-ok="asyncOK">
            <p>注册代理成功，代理帐号为：<span style="font-size:25pt;color:red">{{newUserAccountNumber}}</span></p>
        </Modal>

	</Card>
</template>
<script>
import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                formValidate: {
                    userName:'', 
                    userPassword:'',
                    identityCard:'', 
                    phone:'',
                    userSex:'1',
                    qqNumber:'', 
                    recommendAccount:'',
                    agentTypeId:1,
                    treeParentAccount:'',
                    position:'left',
                    address:''
                },
                showPosition:false,
                modal6: false,
                loading: true,
                newUserAccountNumber:'',
                agentType:[],
                ruleValidate: {
                    userName: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    userPassword: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    identityCard: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                      userSex: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    qqNumber: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                     address: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
            this.formValidate.recommendAccount = Cookies.get("account");
            this.formValidate.treeParentAccount = this.$route.query.parentAccount;
            if(this.$route.query.parentAccount==null){
                this.showPosition=true;
            }
            this.formValidate.position = this.$route.query.position;
            if(this.formValidate.position==null){
                this.formValidate.position="left";
            }
            this.findAgentType();
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {


                        this.$http.post("/user/register",this.formValidate).then(response=> {
                      
                                  var data = response.data;
                                  if(data.code == 0) {
                                      this.$Notice.success({
                                            title: "会员注册成功"
                                        });
                                      this.newUserAccountNumber=data.result.accountNumber;
                                      this.modal6=true;
                                  }else{
                                    this.$Message.error('Fail!');
                                  }
                                  this.btnloading = false;

                            }).catch(function (error) {
                              //接口失败，也就是state不是200的时候，走这里
                              this.$Message.error('Fail!');
                            });

                        
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            asyncOK () {
                this.modal6 = false;
                
            },
            findAgentType(){
                this.$http.get("/agentType/findPage?pageIndex=0&pageSize=100000").then(response=> {
                      var data = response.data;
                      this.agentType=data.result.result;
                })
            },
        }
    }
</script>