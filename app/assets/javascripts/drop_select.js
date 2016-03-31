//将字符串转换成对象，避免使用eval
var old_dropdata;
$(function(){
  // 下拉选择框
  $("body").on("click",".drop_select", function() {
    drop_select(this, $(this));
  });

  $('body').on('click','#submit_all_filter', function(event) {
    $(this).siblings('input#drop_query_param').val('');
  });

  $(".search_nodes").on('click', "input", function() {
    var treeObj = $.fn.zTree.getZTreeObj($(this).attr("tid"));
    if ($.isBlank($(this).val())){
      var allNodes = treeObj.transformToArray(treeObj.getNodes());
      treeObj.showNodes(allNodes);
      return
    }
    var nodeList = treeObj.getNodesByParamFuzzy("name", $(this).val());
    nodeList = treeObj.transformToArray(nodeList);
    updateNodes(true);

    function updateNodes(highlight) {
      var allNodes = treeObj.transformToArray(treeObj.getNodes());
      treeObj.hideNodes(allNodes);
      for(var n in nodeList){
        findParent(nodeList[n]);
      }
    }


    function findParent(node){
      treeObj.showNode(node);
      treeObj.expandNode(node,true,false,false);
      var pNode = node.getParentNode();
      if(pNode != null){
        findParent(pNode);
      }
    }
  });
  
  $.isBlank = function(obj) {
    return(!obj || $.trim(obj) === "");
  };

})


function parseObj(strData) {
   return (new Function("return " + strData))();
}
// 超高时出现滚动条
function overflow_y(tree_div) {
  if ($('#' + tree_div).height() > 460) {
      $('#' + tree_div).width($('#' + tree_div).width() + 20);
      $('#' + tree_div).addClass("drop_ul_overflow_y");
  }
}
//弹框里面点击搜索
function drop_query(id) {
    var this_dom = $("#" + id);
    var this_input = this_dom[0];
    drop_select(this_input, this_dom, true);
    return false;
}
//点击弹框里面的“全选”和“清除按钮”

//主函数
function drop_select(this_input, this_dom, query) {
    if (query == undefined) {
        query = false
    }
    var dropdata = this_dom.attr("dropdata") == undefined ? "" : this_dom.attr("dropdata");
    var name_split = this_dom.attr("name_split") == undefined ? "" : this_dom.attr("name_split");
    var chkbox_type = this_dom.attr("chkbox_type") == undefined ? 0 : this_dom.attr("chkbox_type");
    var nocheck = this_dom.attr("nocheck") == undefined ? true : false;
    var auto_open_lv = this_dom.attr("auto_open_lv") == undefined ? 1 : this_dom.attr("auto_open_lv");
    var droplimit = this_dom.attr("droplimit") == undefined ? 0 : this_dom.attr("droplimit");
    var click_open = this_dom.attr("click_open") == undefined ? false : this_dom.attr("click_open");
    var droptree = this_dom.attr("droptree") == undefined ? 'false' : this_dom.attr("droptree");
    var text_area_tag = this_dom.attr("text_area_tag") == undefined ? 'false' : this_dom.attr("text_area_tag");
    var dialog_title = droplimit > 0 ? "请选择[最多" + droplimit + "项]" : "请选择";
    var dropwidth = this_dom.attr("dropwidth") == undefined ? "145px" : this_dom.attr("dropwidth");
    var dialog_width = this_dom.attr("art_width") == undefined ? this_dom.width() + 145 : this_dom.attr("art_width");
    var dialog_dom = dialog.get('float_' + this_dom.attr("id"));
    var tree_div = "drop_select_tree_" + this_dom.attr("id");
    var tree_div_title = tree_div + "_title";
    var tree_div_content = tree_div + "_content";
    var join_mark = this_dom.attr("join_mark") == undefined ? "," : this_dom.attr("join_mark");

    //关闭所有下拉选择窗口 

    var list = dialog.list;
    for (var i in list) {
      if (list[i] != dialog_dom) {
        list[i].close();
      }
    }

    if (query == true) {
      query_data();
    }else {
      if($.isBlank(dialog_dom) || old_dropdata != dropdata) {
        old_dropdata = dropdata;
        if (!$.isBlank(dialog_dom)){dialog_dom.remove();}
        var btn = [
            {
              value: '确定',
              callback: function () {
                this.close();
                return false;
              }
            }
        ];
        if (droplimit != 1) {
          // {value: '全部选中',callback: function() {
          //       drop_checkall(this_dom, true);
          //       return false;
          //   }},
          btn = btn.concat( {value: '清除已选',callback: function() {
              drop_checkall(this_dom, false);
              return false;
          }});
        }
        dialog_dom = dialog({
            id: 'float_' + this_dom.attr("id"),
            title: dialog_title,
            width: dialog_width,
            button: btn,
            cancelDisplay: false,
            zIndex: 2000
        });
        //     加载内容开始
        if ($("#" + tree_div).length == 0) {
            $("#drop_select_tree").append("<div id=\"" + tree_div + "\" class=\"float_content drop_ul_overflow_y\"></div>");
            $("#" + tree_div).append('<div id="' + tree_div_title + '"><div id="' + tree_div_title + '_tips" class="red"></div><input tid="' + tree_div_content  + '" class="search_nodes string optional hide" size="6" /><form onSubmit="drop_query(\'' + this_dom.attr('id') + '\');return false;"><input id="drop_query_param" style="width:120px"/>&nbsp;<input class="btn btn-info btn-small w50" type="submit" value="查 询" />&nbsp;<input class="btn btn-info btn-small w50" type="submit" id="submit_all_filter" value="全 部" /></form></div>');
            $("#" + tree_div_title).append("<ul id=\"" + tree_div_content + "\"></ul>");
        }

        //加载树开始
        $("#" + tree_div_content).addClass("ztree");
        var setting = ztree_setting(droplimit);

        // var tree_id = "drop_select_tree_" + this_dom.attr("id") + "_content"
        // if ($.isBlank($.fn.zTree.getZTreeObj(tree_id))){
        //   $.fn.zTree.init($("#" + tree_div_content), setting);
        // }
        $.fn.zTree.init($("#" + tree_div_content), setting);
        //加载树结束
        dialog_dom.content(document.getElementById(tree_div));
        //超宽或者超高的加入滚动条
        overflow_y(tree_div_content);
      }
      dialog_dom.show();
      // $("select").hide(); //ie6
      //  .show(this_input);
    }

    function filter(treeId, parentNode, childNodes) {
        if (!childNodes) return null;
        for (var i = 0, l = childNodes.length; i < l; i++) {
            childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        }
        return childNodes;
    }

    function drop_checkall(this_dom, ischeck) {
    // //    var this_input = this_dom[0];
      var tree_id = "drop_select_tree_" + this_dom.attr("id") + "_content"
      var treeObj = $.fn.zTree.getZTreeObj(tree_id);
      treeObj.checkAllNodes(ischeck);
      after_check(tree_id, null);
    }

    function zTreeOnExpand(event, treeId, treeNode) {
        overflow_y(tree_div_content);
    }

    function zTreeOnCheck(event, treeId, treeNode) {
      after_check(treeId, treeNode);
      if (droplimit == 1 && treeNode.checked) {
        // var dialog_dom = dialog.get('float_' + this_dom.attr("id"));
        dialog_dom.close();
        this_dom.focus();
      }
    }

    function zTreeOnClick(event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        if (treeNode.isParent && click_open) {
              treeObj.expandNode(treeNode, true, false, true);
              return false;
         }
        drop_checkall(this_dom, false);
        ancestor_array = treeNode.name;
        this_dom.val(ancestor_array);
        $("input[type='hidden'][droptree_id='" + this_dom.attr("id") + "']").val(treeNode.id).triggerHandler('change');
        dialog_dom.close();
        this_dom.focus();
    }
    // 返回祖先节点名称
    function getzTreeNodeAncestors(treeNode){
      if(treeNode == null){
        return []
      }
      array = [treeNode.name]
      aa = treeNode.getParentNode()
      if (aa) {
          for (var i = aa.level; i > -1; i--) {
              array.unshift(aa.name);
              aa = aa.getParentNode();
          }
      };
      return array
    }

    function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
        var checked_id = "";
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var nodes = treeObj.transformToArray(treeObj.getNodes());
        if ($("input[type='hidden'][droptree_id='" + this_dom.attr("id") + "']").length > 0) {
            checked_id = $("input[type='hidden'][droptree_id='" + this_dom.attr("id") + "']").val();
        }
        var array_id = checked_id.split(",");
        for (var i = 0; i < nodes.length; i++) {
         if (nodes[i].level < auto_open_lv) {        // 展开两层
             treeObj.expandNode(nodes[i], true, false, true);
         }
          if (nodes[i].isParent && droplimit == 1) {     // 如果是单选不允许选择父节点
              nodes[i].nocheck = nocheck;
              treeObj.updateNode(nodes[i]);
          }
          if ($.inArray(nodes[i].id + "", array_id) >= 0) {  // 勾上默认值
            treeObj.checkNode(nodes[i], true, true);
            // treeObj.expandNode(nodes[i], true, false, true);
          }
        }
        var cnodes = treeObj.getCheckedNodes(true);
        $.each(cnodes, function(n, node) {
          if(node.isParent){
            treeObj.expandNode(cnodes[n], true, false, true);
          }
        });
        // if (query == true) {
        //     treeObj.expandAll(true);   // 查询时展开全部节点
        // }
    }

    function after_check(treeId,treeNode) {

      var tip_div = $("#" + tree_div_title + "_tips");
      //        tip_div.html('');
      var treeObj = $.fn.zTree.getZTreeObj(treeId);
      var nodes = treeObj.getCheckedNodes(true);
      var node_ids = [];
      var node_names = [];
      var check_count = 0;
      var too_much = false;
      $.each(nodes, function(n, node) {
        treeObj.expandNode(node, true, false, true);
        if (!node.isParent || !nocheck) {
          check_count += 1;
          if (check_count > droplimit && droplimit > 0) {
            too_much = true;
          }
          else {
            node_ids.push(node.id);
            if (name_split == ""){
              node_names.push(node.name);  
            }else{
              node_name = node.name.split(name_split)[0]
              node_names.push(node_name);  
            }
          }
        }
        if (too_much == true) {
          tip_div.html("最多只能选" + droplimit + "项");
          treeObj.checkNode(node, false, false);
        }
      });
      // 单选的时候 显示父级树
      if (nodes.length == 1) {
        // node_names = getzTreeNodeAncestors(treeNode);
      };
      // node_names = unique(node_names);
      node_ids = node_ids;
      this_dom.val(node_names.join(join_mark));
      $("input[type='hidden'][droptree_id='" + this_dom.attr("id") + "']").val(node_ids.join(",")).triggerHandler('change');
      if (text_area_tag == "true"){
        if (nodes.length > 0){
          this_dom.show();
        }else{
          this_dom.hide();
        }
      }
      textarea_auto_height(this_input);
    }
    // 自动适应高度textarea
    function textarea_auto_height(textarea){
      // textarea.style.height = "1px";
      // textarea.style.height = (0 + textarea.scrollHeight)+"px";
    }
    //默认勾上已选项
    var vv = this_dom.val() == "" ? this_dom.attr("value") : this_dom.val();
    var dom_value = vv.split(",");
    $("#opts_float_" + this_dom.attr("id") + " input[type='checkbox'][name='drop_option[]']").each(function() {
        if ($.inArray($(this).val(), dom_value) >= 0) {
            $(this).attr("checked", 'true');
        }
    })

    // 输入关键字后搜索
    function query_data() {
        var queryparam = $("#drop_query_param").val();
        var setting = ztree_setting(droplimit, queryparam);
        $.fn.zTree.destroy();
        $.fn.zTree.init($("#" + tree_div_content), setting);
    }

    function ztree_setting(droplimit, queryparam) {
        var check_type = droplimit == 1 ? "radio" : "checkbox";
        if(chkbox_type == 1){chkbox_type = { "Y": "", "N": "" }}else{chkbox_type = { "Y": "ps", "N": "ps" }};
        var otherparam = (queryparam == undefined) ? {} : {'query' : queryparam};
        var setting = {
            check: {
                enable: true,
                chkStyle: check_type,
                autoCheckTrigger: false,
                chkboxType: chkbox_type,
                radioType: "all"
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            async: {
                type:'get',
                async:false,
                enable: true,
                url:dropdata,
                autoParam:["id", "name=n", "level=lv"],
                otherParam:otherparam,
                dataFilter: filter
            },
            callback: {
                onAsyncSuccess: zTreeOnAsyncSuccess,
                onCollapse: zTreeOnExpand,
                onExpand: zTreeOnExpand,
                onCheck: zTreeOnCheck,
                onClick: zTreeOnClick
            }
        };
        return setting;
    }
}
