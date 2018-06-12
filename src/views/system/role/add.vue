<template>
 	<Card>
            <p slot="title">
                <Icon type="person"></Icon>
                添加修改角色
            </p>
            <div>
            {{formValidate.id}}
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width:400px;">
        <FormItem label="角色名" prop="roleName">
            <Input v-model="formValidate.roleName" placeholder="Enter your roleName"></Input>
        </FormItem>
        <FormItem label="标注" prop="remark">
            <Input v-model="formValidate.remark" placeholder="Enter your e-url"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            <Button type="ghost" :loading="btnloading" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</div>
</Card>
</template>
<script>
    export default {
        data () {
            return {
            	type:null,
                formValidate: {
                    roleName: '',
                    remark: ''
                },
                btnloading:false,
                ruleValidate: {
                    roleName: [
                        { required: true, message: '角色名不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
        	this.formValidate.id = this.$route.query.id==null?null:this.$route.query.id;
        	this.type = this.$route.query.type;
        	if(this.type=='edit'){
        		this.get();
        	}
        },
        methods: {
        	get(){
    			this.$http.get("/role/get?id="+ this.formValidate.id).then(response=> {
	                      var data = response.data;
	                      this.formValidate=data.result;
	                })
        	},
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {

                    	this.$http.post("/role/saveOrUpdate",this.formValidate).then(response=> {
		              
		                          var data = response.data;
		                          if(data.code == 0) {
		                              this.$Notice.success({
		                                    title: "角色已经保存成功"
		                                });
		                          }else{
		                   
		                          }
		                          this.btnloading = false;

		                    }).catch(function (error) {
		                      //接口失败，也就是state不是200的时候，走这里
		                    });
                        this.$Message.success('Success!');
                        this.$router.go(-1);
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>