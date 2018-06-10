<template>
	<div>
		 <TreeTable :columns="columns1" :data="data1"
			 @on-row-add-child="addChild"
			 @on-toolbar-add="onToolbarAdd"
			 @on-row-edit="onRowEdit"
			 @on-row-delete="onRowDelete"
		 >
        </TreeTable>
	</div>
</template>
<script>
import TreeTable from '@/views/my-components/tree-table';
import treeUtils from '@/libs/treeUtils';
export default {
components: {
	TreeTable
},
data () {
    return {
    	data1: [],
	    columns1: [
	        {
	            type: 'tree',
	            width: 200,
	            title: '菜单名称',
	            key: 'menuName'
	        },
	        {
	            title: '路径',
	            key: 'url'
	        },
	        {
	            title: '创建时间',
	            key: 'createTime'
	        },
	        {
	            title: '修改时间',
	            key: 'updateTime'
	        },
                {
                    type: 'operation',
                    width: 400,
                    delete: true,
                    edit: true,
                    addChild: true,
                    custom: [{
                        render: (h, params) => {
                            return h();
                        }
                    }]
                }
            ]
    }
},
mounted() {
    this.findAll();
},
 methods: {
        findAll() {
            this.$http.get('/menu/findUserMenus').then(res => {
                this.data1 = res.data.result;
                this.data1 = treeUtils(this.data1, 'parentId', 'id');
                // console.log(res.data);
            });
        },
        addChild(item) {
            this.$router.push({
                path: "/menu/add",
                query: {
                    parentId: item.id,
                    name: item.menuName
                }
            });
        },
        onRowDelete(item) {
           this.$http.get("/menu/deleteMenu?id="+ item.id).then(response=> {
	                      var data = response.data;
	                  if(data.code==0){
	                  	 this.$Message.success(data.message);
	                  }
	         })
        },
        onRowEdit(item) { // 编辑
            // console.log(item);
            this.$router.push({
                path: "/menu/add",
                query: {id: item.id,type:"edit"}
            });
        },
        onToolbarAdd() { // 添加菜单
            this.$router.push({path: "/menu/add"});
        },
}

}
</script>
<style scoped>
	
</style>