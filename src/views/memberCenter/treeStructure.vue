<template>
    <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                代理安置结构
            </p>
            <div style="overflow:hidden;padding:20px;width:900px;">
               <OrgChart :data="testData" v-on:onDrop="onDrop" @onClick="nodeClick"></OrgChart>
            </div>

  </Card>
</template>

<script>
  import OrgChart from './org-chart/OrgChart';
  import Cookies from 'js-cookie';
  export default {
    name: 'app',
    components: {
      OrgChart
    },
    data() {
      return {
        testData: [
          {
            id: 1,
            label: "Seu Siriguejo",
            children: [
              {
               
                label: "Bob Esponja",
                children: [
                  {
                  
                    label: "Patrick Estrela",
                    children: []
                  },
                  {
                    id: 5,
                    label: "Sandy Bochechas",
                    children: []
                  }
                ]
              },
              {
                id: 3,
                label: "Lula Molusco",
                children: [
                  {
                    id: 4,
                    label: "Patrick ",
                    children: []
                  },
                  {
                    id: 5,
                    label: "Sandy Bochechas",
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    mounted(){
      this.init(Cookies.get("account"));
    },
    methods: {
       init(account) {
             this.$http.get("/agentTree/treeStructure?account="+ account).then(response=> {
                    var data = response.data;
                    this.testData = new Array();
                    this.testData.push(data.result);
                    
                
                    
              })
      },
     nodeClick(node){
        // alert(JSON.stringify(node))
        this.init(node.accountNumber);
     },
      onDrop: function (event) {
        alert(event.node.label + " was moved to " + event.to.label + ".");
      }
    }
  }

</script>

<style>

</style>