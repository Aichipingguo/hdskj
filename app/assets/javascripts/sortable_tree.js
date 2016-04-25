var contentSelector = '.menu_content',
    className = "dark"
    // newCount = 1,
function loading(id) {
  $(id).html('<img src="/assets/loading.gif" />');
}

function getzTree() {
  return $.fn.zTree.getZTreeObj(treeOpts.current_tree);
}

function getChildren(ids,curTreeNode){
  var treeNode = curTreeNode.getParentNode()
  if (treeNode && treeNode.isParent){
    ids.push(treeNode.id);
    for(var obj in treeNode.children){
      // getChildren(ids,treeNode.children[obj]); //will get all nodes of the treeNode
      ids.push(treeNode.children[obj].id); // just get nodes for the current node
    }
  } else {
    ids.push(0);
    topTree = getzTree();
    for(var obj in topTree.getNodes()){
      ids.push(topTree.getNodes()[obj].id);
    }
  }
  return ids;
}

function beforeDrag(treeId, treeNodes) {
  for (var i=0,l=treeNodes.length; i<l; i++) {
    dragId = treeNodes[i].pId;
    if (treeNodes[i].drag === false) {
      return false;
    }
  }
  return true;
}

function beforeDrop(treeId, treeNodes, targetNode, moveType) {
  return targetNode.pId === dragId
}

function onDrop(event, treeId, treeNodes, targetNode, moveType) {
  var sortableIds = getChildren([],treeNodes[0])
  $.ajax({
    url: '/sort_tree',
    type: 'post',
    data: {sorted_array: sortableIds, model_name: treeOpts.model_name},
    success:function(success){
        $('.success').show();
        $('.success').fadeOut(2000);
        $(".menu_content").html("");
      },
      error:function(error){
        $('.failed').show();
        $('.failed').fadeOut(6000);
      }
  })
};

function beforeEditName(treeId, treeNode) {
  className = (className === "dark" ? "":"dark");
  getzTree().selectNode(treeNode);
  loading(contentSelector);
  $(contentSelector).load(treeOpts.url + treeNode.id +"/edit");
  $("html, body").animate({scrollTop:0}, "slow");
  return false;
}

function beforeRemove(treeId, treeNode) {
  className = (className === "dark" ? "":"dark");
  var tree = getzTree()
  tree.selectNode(treeNode);
  if(confirm("确认删除 " + treeNode.name + " 吗,下级会一并被删除？")){
    $.ajax(treeOpts.url + treeNode.id +".json" ,{
      type:'post',
      data:{_method:"delete"},
      success:function(success){
        $('.success').show();
        $('.success').fadeOut(2000);
        tree.removeChildNodes(treeNode);
        tree.removeNode(treeNode);
        $(".menu_content").html("");
      },
      error:function(error){
        var json = JSON.parse(error.responseText).errors;
        var text = ""
        for (var key in json) {
          text += json[key].join();

        };
        $('.failed').text(" 操作失败！ " + text);
        $('.failed').show();
        $('.failed').fadeOut(6000);
      }
    })
  }
  return false;

}

function onRemove(e, treeId, treeNode) {

}

function beforeRename(treeId, treeNode, newName, isCancel) {
  className = (className === "dark" ? "":"dark");
  if (newName.length == 0) {
    alert("节点名称不能为空.");

    setTimeout(function(){getzTree().editName(treeNode)}, 10);
    return false;
  }
  return true;
}

function onRename(e, treeId, treeNode, isCancel) {
  return false;
}

function onClick(e, treeId, treeNode, isCancel) {
  loading(contentSelector);
  $(contentSelector).load(treeOpts.url + treeNode.id +"/edit");
}

function addHoverDom(treeId, treeNode) {
  var sObj = $("#" + treeNode.tId + "_span");
  if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
  var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
    + "' title='add node' onfocus='this.blur();'></span>";
  sObj.after(addStr);
  var btn = $("#addBtn_"+treeNode.tId);
  if (btn) btn.bind("click", function(){
    loading(contentSelector);
    $(contentSelector).load(treeOpts.url + "new?parent_id="+ treeNode.id);
    return false;
  });
};

function removeHoverDom(treeId, treeNode) {
  $("#addBtn_"+treeNode.tId).unbind().remove();
};

