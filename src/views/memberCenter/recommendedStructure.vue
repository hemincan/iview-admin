<template>
    <Card>
        <p slot="title">
            <Icon type="person"></Icon>
            推荐结构
        </p>
         <div>
             <Tree :data="data2" show-checkbox></Tree>
        </div>
    </Card>
</template>
<script>
import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                data2: []
              }
        },
        mounted(){
            this.init();
        },
        methods:{
            init() {

                   this.$http.get("/agentTree/recommendedStructure").then(response=> {
                          var data = response.data;
                          this.data2=data.result;

                          if(this.data2==null){
                            this.data2=new Array();
                          }

                          var parent = {};
                          var children = new Array();
                          for (var i = 0; i < this.data2.length; i++) {
                              var title = this.data2[i].userName + "（" + this.data2[i].accountNumber +"）";
                              this.data2[i].title = title;
                              if(this.data2[i].accountNumber==Cookies.get("account")){
                                  parent=this.data2[i];
                              }else {
                                children.push(this.data2[i]);
                              }
                          }
                          parent.children=children;
                          this.data2= new Array();
                          this.data2.push(parent);
                          
                    })
            }
        }
    }
</script>