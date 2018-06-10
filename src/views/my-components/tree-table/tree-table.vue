<template>
	<div>
		<div style="margin:8px;text-align:left">
			<Button style="margin-left:5px" v-for="(item,index) in funTransformData" :key="item.label" :icon="item.icon" @click="funClick(item)"  v-bind:class="[{ 'fun-btn-hide': item.show==false }]">{{item.label}}</Button>
			<FunHeaderRender :render="customBtnRender"></FunHeaderRender>
		</div>
		<Table 
		   border
		   disabled-hover
		   :columns="columnsTransformData" 
		   :data="dataCompute" 
		   :row-class-name="rowClassName"
		   :width="width"
		   :height="height"
		   :loading="loading"
		   :size="size"
		   @on-selection-change="selectionChange"
		   @on-select="onSelect"
		   @on-select-cancel="onSelectCancel"
		   @on-select-all="onSelectAll"
		   @on-sort-change="onSortChange"
		   @on-filter-change="onFilterChange"
		   @on-row-click="onRowClick"
		   @on-row-dblclick="onRowDBClick"
		   ></Table>
		   
	</div>
</template>
<script>
var FunHeaderRender = { // 供使用此组件的人自定义渲染组件
    name: 'funRender',
    functional: true,
    props: {
        render: Function
    },
    render: (h, ctx) => {
        return ctx.props.render(h);
    }
};
export default {
    components: {FunHeaderRender},
    props: {
        columns: {
            type: Array,
            default: function() {
                return [];
            }
        },
        data: {
            type: Array,
            default: function() {
                return [];
            }
        },
        toolbar: {
            type: Array,
            default: function() {
                return [];
            }
        },
        expandAll: {// 是否展开所有子层
            type: Boolean,
            default: false
        },
        children: { // 子节点的key，默认为children
            type: String,
            default: "children"
        },
        width: {
            type: String,
            default: "auto"
        },
        height: {
            type: String,
            default: "auto"
        },
        loading: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'default'
        }
    },
    data() {
        return {
            tableData: [], // 为了与原数据进行区分，并且为了使传入的数据不会重叠，控制样式展开与否与层级关系等字段以‘_$’开头。
            columnsTransformData: this.columns_transform(), // 经过转换的列属性
            funTransformData: this.fun_transform(),
            selection: [], // 在有多选模式下，多选的值
            newestSelection: [],
            funCustomRender: null
        };
    },
    mounted() {
    },
    methods: {
        preorder(tree, childrenname, order) { // 将树型结构前序遍历成一个数组
            var array = [];
            for (var i = 0; i < tree.length; i++) {
                tree[i]._$tree_order_num = order;
                if (tree[i][childrenname] != null) {
                    array.push(tree[i]);
                    array = array.concat(this.preorder(tree[i][childrenname], childrenname, order + 1));
                } else {
                    array.push(tree[i]);
                }
            }
            return array;
        },
        getAllTreeNode(list, childrenname) { // 获取一个树的所有节点,将树形结构变成数组结构
            var result = [];
            for (var i = 0; i < list.length; i++) {
                result.push(list[i]);
                if (list[i][childrenname] != null) {
                    result = result.concat(this.getAllTreeNode(list[i][childrenname], childrenname));
                }
            }
            return result;
        },
        rowClassName(row, index) {
            var show = 'tree-row-show';
            var hide = 'tree-row-hidden';
            if (this.expandAll) { // 展开全部
                return show;
            } else if (row._$tree_order_num == 1) { // 只显示父级
                return show;
            } else { // 非顶级父类，则按需展示
                var dark = 'tree-row-children-dark';
                var light = 'tree-row-children-light';
                if (row._$tree_order_num % 2 == 0) {
                    show = show + ' ' + dark;
                } else {
                    show = show + ' ' + light;
                }
                if (row._$show_row == true) {
                    return show;
                }
                return hide;
            }
        },
        expandClick(params) {
            if (params.row[this.children] == null) {
                return;
            }
            var tableData = this.tableData[params.index];
            var expand = tableData._$row_is_expand;
            tableData._$row_is_expand = !expand;
            if (tableData[this.children] == null) {
                tableData._$row_is_expand = false;
            }
            var c = tableData[this.children];
            if (!tableData._$row_is_expand) {
                c = this.getAllTreeNode(c, this.children);
                for (var i = 0; i < c.length; i++) {
                    this.$set(c[i], "_$show_row", false);
                    this.$set(c[i], "_$row_is_expand", false);
                };
            } else {
                for (i = 0; i < c.length; i++) {
                    this.$set(c[i], "_$show_row", !c[i]._$show_row);
                };
            };
            this.$emit("on-expand", params.row); // 展开一行的事件
        },
        columns_transform() {
            var columns = this.columns;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].type == "operation") {
                    columns[i].title = columns[i].title ? columns[i].title : "操作";
                    var c = columns[i];
                    c.render = (h, params) => {
                        var renderArray = [];
                        if (c['see']) {
                            var label = c['see'] == true ? '查看' : c['see'];
                            renderArray.push(h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small',
                                    icon: 'eye'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.operationSee(params.row, params.index);
                                    }
                                }
                            }, label));
                        }
                        if (c['edit']) {
                            label = c['edit'] == true ? '编辑' : c['edit'];
                            renderArray.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'edit'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.operationEdit(params.row, params.index);
                                    }
                                }
                            }, label));
                        }
                        if (c['delete']) {
                            label = c['delete'] == true ? '删除' : c['delete'];
                            renderArray.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'trash-b'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.operationDelete(params.row, params.index);
                                    }
                                }
                            }, label));
                        }
                        if (c['addChild']) {
                            label = c['addChild'] == true ? '添加子菜单' : c['addChild'];
                            renderArray.push(h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'plus'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.operationAddChild(params.row, params.index);
                                    }
                                }
                            }, label));
                        }
                        if (c["custom"].length) { // 添加自定义按钮
                            var customBtn = c["custom"];
                            for (var i = customBtn.length - 1; i >= 0; i--) {
                                renderArray.push(customBtn[0].render(h, params));
                            }
                        };
                        return h('div', renderArray);
                    };
                } else if (columns[i].type == 'tree') {
                    var treeCol = columns[i];
                    treeCol.render = (h, params) => {
                        var renderArray = [];
                        var iconType = params.row._$row_is_expand ? 'minus' : 'plus';
                        var marginLeft = params.row._$tree_order_num * 20;
                        if (params.row[this.children] == null) {
                            iconType = 'minus';
                            // marginLeft+=12;
                        }
                        renderArray.push(h("Icon", {
                            props: {
                                type: iconType,
                                size: 15
                            },
                            style: {
                                'margin-left': marginLeft + 'px'
                            }
                        }));
                        renderArray.push(h("span", {
                            style: {
                                'margin-left': '8px'
                            }
                        }, params.row[treeCol.key]));
                        return h('div', {
                            on: {
                                click: () => {
                                    this.expandClick(params);
                                }
                            }
                        }, [renderArray]);
                    };
                } else if (columns[i].type == 'editable') {
                    var editableCol = columns[i];
                    editableCol.render = (h, params) => {
                        var self = this;
                        var v = params.row[editableCol.key];
                        return h('Input', {
                            props: {
                                size: 'small',
                                value: params.row[editableCol.key],
                                number: typeof (params.row[editableCol.key]) == 'number'
                            },
                            on: {
                                input: function(value) {
                                    v = value;
                                },
                                'on-blur': function() {
                                    if (self.tableData[params.index][editableCol.key] != v) {
                                        self.tableData[params.index]._$had_edit = true; // 已经被编辑
                                        self.tableData[params.index][editableCol.key] = v;
                                    }
                                }
                            }
                        });
                    };
                }
            }
            return columns;
        },
        fun_transform: function() {
            var defaultFun = [
                {
                    type: 'add',
                    label: '添加',
                    icon: 'plus'
                },
                {
                    type: 'edit',
                    label: '编辑',
                    icon: 'edit'
                },
                {
                    type: 'delete',
                    label: '批量删除',
                    icon: 'trash-b'
                },
                {
                    type: 'savesort',
                    label: '保存排序',
                    icon: 'printer'
                },
                {
                    type: 'refresh',
                    label: '刷新',
                    icon: 'refresh'
                }
            ];
            var indexbytype = {}; // 转换为以type为key的Object方便索引
            for (var i = 0; i < defaultFun.length; i++) {
                indexbytype[defaultFun[i].type] = defaultFun[i];
            }
            for (i = 0; i < this.toolbar.length; i++) {
                var f = this.toolbar[i];
                if (f.label != null) {
                    indexbytype[f.type].label = f.label;
                }
                if (f.icon != null) {
                    indexbytype[f.type].icon = f.icon;
                }
                if (f.show != null) {
                    indexbytype[f.type].show = f.show;
                }
                if (f.type == "custom") {
                    this.customBtnRender = f.render;
                }
            }
            // 如果自定义按钮不为空，使用渲染函数将其添加到按钮上
            return defaultFun;
        },
        customBtnRender(h) { // 用来渲染顶部按钮的方法，虽然是空的方法
        },
        operationSee(row, index) { // 查看按钮点击
            this.$emit("on-row-see", row, index);
        },
        operationEdit(row, index) { // 编辑按键点击
            this.$emit("on-row-edit", row, index);
        },
        operationDelete(row, index) { // 删除按键点击
            this.$emit("on-row-delete", row, index);
        },
        operationAddChild(row, index) { // 添加子项按钮点击
            this.$emit("on-row-add-child", row, index);
        },
        selectionChange(selection) { // 多选下，改变时
            this.selection = selection;
            this.$emit("on-selection-change", selection);
        },
        onSelect(selection, row) { // 多选，当选择一行时，selection已经选，row被选行
            this.newestSelection = row;
            this.$emit("on-select", selection, row);
        },
        onSelectCancel(selection, row) { // 多选，当选择一行时，selection已经选，row被取消行
            this.$emit("on-select-cancel", selection, row);
        },
        onSelectAll(selection) { // 全选，selection被选数据
            this.$emit("on-select-all", selection);
        },
        onSortChange(column, key, order) { // 排序时有效，当点击排序时触发
            this.$emit("on-sort-change", column, key, order);
        },
        onFilterChange(col) { // 筛选时有效，筛选条件发生变化时触发
            this.$emit("on-filter-change", col);
        },
        onRowClick(row, index) { // 单击某一行时触发
            this.$emit("on-row-click", row, index);
        },
        onRowDBClick(row, index) { // 双击某一行时触发
            this.$emit("on-row-dblclick", row, index);
        },
        funClick(item) {
            if (item.type == "delete") { // 批量删除
                this.$emit("on-toolbar-delete", this.selection);
            }
            if (item.type == "add") { // 添加
                this.$emit("on-toolbar-add");
            }
            if (item.type == "edit") { // 编辑
                this.$emit("on-toolbar-edit", this.newestSelection);
            }
            if (item.type == "savesort") { // 保存排序
                var td = JSON.parse(JSON.stringify(this.tableData));
                var hadEditData = [];
                for (var i = td.length - 1; i >= 0; i--) {
                    if (td[i]._$had_edit) {
                        hadEditData.push(td[i]);
                    }
                }
                this.$emit("on-toolbar-savesort", hadEditData);
            }
            if (item.type == "refresh") { // 刷新
                this.$emit("fun-refresh");
            }
        }
    },
    computed: {
        dataCompute: function() {
            this.tableData = this.preorder(this.data, this.children, 1);
            return this.tableData;
        }
    }
};
</script>

<style>
.tree-row-hidden{
	display: none;
}
.tree-row-show{
	display: table-row;
}
.ivu-table .tree-row-children-dark td{
    background-color: #F7F7F7;
}
.ivu-table .tree-row-children-light td{
    background-color: #FFFFFF;
}
.fun-btn-hide{
	display: none;
}
</style>