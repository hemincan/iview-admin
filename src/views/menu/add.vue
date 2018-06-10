<template>
 	<Card>
            <p slot="title">
                <Icon type="person"></Icon>
                添加修改菜单
            </p>
            <div>
            {{formValidate.id}}
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width:400px;">
        <FormItem label="菜单名" prop="menuName">
            <Input v-model="formValidate.menuName" placeholder="Enter your menuName"></Input>
        </FormItem>
        <FormItem label="路径" prop="url">
            <Input v-model="formValidate.url" placeholder="Enter your e-url"></Input>
        </FormItem>
        <FormItem label="父菜单" prop="parentId">
            <Input v-model="formValidate.parentId" placeholder="Enter your e-url"></Input>
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
                    menuName: '',
                    url: '',
                    parentId: 0,
                    id:null,
                },
                btnloading:false,
                ruleValidate: {
                    menuName: [
                        { required: true, message: '菜单名不能为空', trigger: 'blur' }
                    ],
                    url: [
                        { required: true, message: '路径不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
        	this.formValidate.id = this.$route.query.id==null?null:this.$route.query.id;
        	this.formValidate.parentId = this.$route.query.parentId==null?0:this.$route.query.parentId;
        	this.type = this.$route.query.type;
        	if(this.type=='edit'){
        		this.get();
        	}
        },
        methods: {
        	get(){
    			this.$http.get("/menu/getMenu?id="+ this.formValidate.id).then(response=> {
	                      var data = response.data;
	                      this.formValidate=data.result;
	                })
        	},
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {

                    	this.$http.post("/menu/saveOrUpdateMenu",this.formValidate).then(response=> {
		              
		                          var data = response.data;
		                          if(data.code == 0) {
		                              this.$Notice.success({
		                                    title: "菜单已经保存成功"
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