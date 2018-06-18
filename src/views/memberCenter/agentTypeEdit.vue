<!-- 创建代理页面 -->
<template>
	<Card>
            <p slot="title">
                <Icon type="person"></Icon>
                编辑代理类型
            </p>
            <div style="width:500px">
          
           
		    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            
    		        <FormItem label="类型名：" prop="name">
    		            <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
    		        </FormItem>
               
                <FormItem label="报单奖励：" prop="firstRewardMoney">
                    <Input v-model="formValidate.firstRewardMoney" placeholder="Enter your e-mail"></Input>
                </FormItem>
                
                 <FormItem label="对碰分红比例：" prop="collisionPer">
                    <Input v-model="formValidate.collisionPer" placeholder="Enter your e-mail"></Input>
            
                </FormItem>
                  <FormItem label="可购数量：" prop="ableCount">
                    <Input v-model="formValidate.ableCount" placeholder="Enter your e-mail"></Input>
                </FormItem>
                  <FormItem label="积分：" prop="integral">
                    <Input v-model="formValidate.integral" placeholder="Enter your e-mail"></Input>
                </FormItem>
                  <FormItem label="对碰封顶：" prop="topReward">
                    <Input v-model="formValidate.topReward" placeholder="Enter your e-mail"></Input>
                </FormItem>
                  <FormItem label="总价：" prop="totalMoney">
                    <Input v-model="formValidate.totalMoney" placeholder="Enter your e-mail"></Input>
                </FormItem>
                  <FormItem label="备注：" prop="remark">
                    <Input v-model="formValidate.remark" placeholder="Enter your e-mail"></Input>
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
                  ableCount:50,
                  collisionPer:0.1,
                  displayOrder: null,
                  firstRewardMoney:500,
                  id: 1,
                  integral:2200,
                  name:"一级代理",
                  remark: "送4瓶洗发水+围布+手套+喷壳+吹风",
                  topReward:40000,
                  totalMoney:2990 
                },
                userData:{},
                showPosition:false,
                modal6: false,
                loading: true,
                newUserAccountNumber:'',
                ruleValidate: {
                   
                    // ableCount: [
                    //     { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    // ],
                    // collisionPer: [
                    //     { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    // ],
                    //  firstRewardMoney: [
                    //     { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    // ],
                    //  integral: [
                    //     { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    // ],
                    //   name: [
                    //     { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    // ],
                    //   remark: [
                    //     { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    // ],
                    //   topReward: [
                    //     { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    // ],
                    //   totalMoney: [
                    //     { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' }
                    // ]
                }
            }
        },
        mounted(){
           
            this.findAgentType();
            // this.getUserInfo();
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {


                        this.$http.post("/agentType/saveOrUpdate",this.formValidate).then(response=> {
                      
                                  var data = response.data;
                                  if(data.code == 0) {
                                      this.$Notice.success({
                                            title: "保存成功"
                                        });
                          
                                      this.modal6=true;
                                  }else{
                                    this.$Message.error('Fail!');
                                  }
                                  this.btnloading = false;

                            }).catch(function (error) {
                              alert("提交失败，请检查数据是否正确")
                              
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
                this.$http.get("/agentType/get?id="+this.$route.query.id).then(response=> {
                      var data = response.data;
                      this.formValidate=data.result;
                })
            }
        }
    }
</script>