
var buildTree = function(node, rootarray, pidKey, idKey) {
    for (var i = 0; i < rootarray.length; i++) {
        var children = [];
        for (var k = 0; k < node.length; k++) {
            if (node[k][pidKey] == rootarray[i][idKey]) {
                children.push(node[k]);
            }
        }
        if (children.length != 0) {
            rootarray[i].children = children;
            buildTree(node, children, pidKey, idKey);
        }
    }
    return rootarray;
};
var getTree = function(node, pidKey, idKey) {
    var rootarray = [];
    for (var i = 0; i < node.length; i++) {
        if (node[i][pidKey] == 0) {
            rootarray.push(node[i]);
        }
    }
    // alert(rootarray.length);
    return buildTree(node, rootarray, pidKey, idKey);
};
export default getTree;
