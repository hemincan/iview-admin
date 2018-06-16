
<template>
	<Card>
            <p slot="title">
                <Icon type="person"></Icon>
                注册代理
            </p>
            <div style="width:500px">
          
           
		    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              
		        <FormItem label="提现金额：" prop="withdrawMoney">
		            <Input v-model="formValidate.withdrawMoney" placeholder="Enter your name"></Input>
                <div>可提现的余额为：{{userData.balance}}元</div>
		        </FormItem>
               
                <FormItem label="银行名：" prop="bankName">
                    <Input v-model="formValidate.bankName" placeholder="Enter your e-mail"></Input>
                </FormItem>
                
                 <FormItem label="银行地址：" prop="bankAddress">
                    <Input v-model="formValidate.bankAddress" placeholder="Enter your e-mail"></Input>
                </FormItem>

                 <FormItem label="银行卡号：" prop="bankCard">
                    <Input v-model="formValidate.bankCard" placeholder="Enter your e-mail"></Input>
                </FormItem>
                    <FormItem label="户名：" prop="bankUserName">
                    <Input v-model="formValidate.bankUserName" placeholder="Enter your e-mail"></Input>
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
            <p>订单申请成功，请耐心等待处理</p>
        </Modal>

	</Card>
</template>
<script>
import Cookies from 'js-cookie';
    export default {
        data () {
          const validateMoney = (rule, value, callback) => {
               
                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    callback();
                }
            };
            return {
                formValidate: {
                    withdrawMoney:0,
                    bankName:'',
                    bankAddress:'',
                    bankCard:'',
                    bankUserName:''
                },
                modal6:false,
                userData:[],
                loading: true,
                ruleValidate: {
                   
                    withdrawMoney: [
                           {required: true, message: '金额不能为空', trigger: 'blur'},
                        {validator: validateMoney, trigger: 'blur'}
                    ],
                    bankName: [
                        { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    ],
                     bankAddress: [
                        { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    ],
                     bankCard: [
                        { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    ],
                     bankUserName: [
                        { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
           
            this.getUserInfo();
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {


                        this.$http.post("/withdraw/save",this.formValidate).then(response=> {
                      
                                  var data = response.data;
                                  if(data.code == 0) {
                                      this.$Notice.success({
                                            title: "提现申请成功"
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
            getUserInfo(){
                   this.$http.post("/user/getUserInfo").then(response=> {
                          var data = response.data;
                          if(data.code == 0) {
                                this.userData = data.result;
                                this.formValidate.bankAddress = this.userData.bankAddress;
                                this.formValidate.bankCard =this.userData.bankCard;
                                 this.formValidate.bankUserName= this.userData.bankUserName;
                                 this.formValidate.bankName= this.userData.bankName;
                                 this.formValidate.bankUserName = this.userData.userName
                          }else{
                              
                          }

                    }).catch(function (error) {
                      //接口失败，也就是state不是200的时候，走这里
                    });
            }
        }
    }
</script>