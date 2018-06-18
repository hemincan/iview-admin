<!-- 创建代理页面 -->
<template>
	<Card>
            <p slot="title">
                <Icon type="person"></Icon>
                申请报单
            </p>
            <div style="width:500px">
          
           
		    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                {{formValidate.agentTypeId}}
               <FormItem label="代理类型：" prop="agentTypeId">
                    <Select v-model="formValidate.agentTypeId" placeholder="Select your city">
                    <div  v-for="item in agentType">
                         <Option :value="item.id" :key="item.id">{{item.name}}({{item.remark}} )</Option>

                    </div>
                       
                    </Select>
               </FormItem>
		        <FormItem label="用户姓名：" prop="receiverName">
		            <Input v-model="formValidate.receiverName" placeholder="Enter your name"></Input>
		        </FormItem>
               
                <FormItem label="手机号码：" prop="receiverPhone">
                    <Input v-model="formValidate.receiverPhone" placeholder="Enter your e-mail"></Input>
                </FormItem>
                
                 <FormItem label="收货地址：" prop="receiverAddress">
                    <Input v-model="formValidate.receiverAddress" placeholder="Enter your e-mail"></Input>
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
            return {
                formValidate: {
                    agentTypeId:1,
                    receiverAddress:'',
                    receiverName:'',
                    receiverPhone:''
                
                },
                userData:{},
                showPosition:false,
                modal6: false,
                loading: true,
                newUserAccountNumber:'',
                agentType:[],
                ruleValidate: {
                   
                    receiverName: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ],
                    receiverPhone: [
                        { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    ],
                     receiverAddress: [
                        { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
           
            this.findAgentType();
            this.getUserInfo();
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {


                        this.$http.post("/applyGoods/save",this.formValidate).then(response=> {
                      
                                  var data = response.data;
                                  if(data.code == 0) {
                                      this.$Notice.success({
                                            title: "报单申请成功"
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
            getUserInfo(){
                   this.$http.post("/user/getUserInfo").then(response=> {
                          var data = response.data;
                          if(data.code == 0) {
                                this.userData = data.result;
                                this.formValidate.receiverAddress = this.userData.address;
                                this.formValidate.receiverName = this.userData.userName;
                                this.formValidate.receiverPhone =this.userData.phone;
                           
                          }else{
                              
                          }

                    }).catch(function (error) {
                      //接口失败，也就是state不是200的时候，走这里
                    });
            }
        }
    }
</script>