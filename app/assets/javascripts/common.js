//= require jquery
//= require jquery_ujs
//= require select2/select2.full.min
//= require dialog-min



/*替换全部字符*/
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
  if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
    return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
  } else {
    return this.replace(reallyDo, replaceWith);
  }
}

$(function() {
  // 判断空 $.isBlank($(this).val())
  $.isBlank = function(obj) {
    return(!obj || $.trim(obj) === "");
  };

  // select2
  $(".select2").select2({width: 'resolve', dropdownAutoWidth: 'true'});

  //更新登录状态
  // $("#main-menu-right").load('/check_user');

  // 所有表单防止多次提交
  //$("form").submit(function(){
  // $(":submit",this).attr("disabled","disabled");
  //});


    // 级联下拉框
    $(document).on('change', 'select.multi-level', function() {
      $selector = $(this);
      if(isEmpty($selector.attr("aim_id"))){
        $selector.siblings("input[type='hidden']").val($selector.val());
        $selector.siblings("input[type='hidden']").change();
      }else{
        $('#' + $selector.attr("aim_id")).val($selector.val()).change();
      }

      if (!$.isBlank($selector.attr("text_id"))) {
        $('#' + $selector.attr("text_id")).val($selector.find("option:selected").text());
      }

      $.ajax({
        type: "get",
        dataType: "html",
        url: '/dynamic_selects?id=' + $selector.val() + '&otype=' + $selector.attr("otype") + '&aim_id=' + $selector.attr("aim_id") + '&other=' + $selector.attr("other") + '&text_id=' + $selector.attr("text_id")+ '&prompt=' + $selector.attr("prompt") + '&oclass=' + $selector.attr("class"),
        beforeSend: function(XMLHttpRequest) {

        },
        success: function(data, textStatus) {
          if (data.length > 0) {
            $selector.nextAll('select').remove();
            // $selector.parent().append(data);
            $selector.after(data);
          }
        },
        complete: function(XMLHttpRequest, textStatus) {
            //HideLoading();
          },
          error: function() {
            //请求出错处理
            alert("系统错误，请刷新后重试");
          }
        });
    });


  // 日期时间控件
  $('.my97_date').click(function() {
    WdatePicker({dateFmt:'yyyy-MM-dd', readOnly:true});
  });

  $('.my97_full_time').click(function() {
    WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss', readOnly:true});
  });


  // 验证用户输入跳转页是否有效
  $(".jump_check").click(function () {
    var jump_page = $(".jump_num").val().trim();
    if (jump_page == '' || jump_page < 1 ) {
      alert('请输入有效数字！');
    } else {
      var url_str = window.location.search;
      if(url_str == '') {
        self.location = '?page=' + jump_page;
      }else {
        url_str = url_str.split('?');
        url_str = url_str[1];
        var url_ar = url_str.split('&');
        page_in_there = false;
        for(var i = 0; i < url_ar.length; i ++ ){
          i_get = url_ar[i].split('=');
          if (i_get[0] == 'page') {
            i_get[1] = jump_page;
            page_in_there = true;
          }
          url_ar[i] = i_get.join('=');
        }
        url_new = '?' + url_ar.join('&');

        if (page_in_there) {
          self.location = url_new;
        } else {
          self.location = url_new + '&page=' + jump_page;
        }
      }
    }
  })
});

// 自动适应高度textarea
function textarea_auto_height(textarea){
  textarea.style.height = "1px";
  textarea.style.height = (25+textarea.scrollHeight)+"px";
}

// 加入收藏
function addToFavorite() {
  var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
  if (document.all) {
    window.external.addFavorite('http://www.sinopr.org', '公共资源交易网')
  } else if (window.sidebar) {
    window.sidebar.addPanel('公共资源交易网', 'http://www.sinopr.org', "")
  } else {　　　　//添加收藏的快捷键
    alert('添加失败\n您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~')
  }
}

// 设为首页
function addHomePage() {
  var url = this.href;
  try {
    this.style.behavior = "url(#default#homepage)";
    this.setHomePage(url);
  } catch (e) {
    if (document.all) {
      document.body.style.behavior="url(#default#homepage)";
      document.body.setHomePage(url);
    } else if (window.sidebar) {
      if (window.netscape) {
        try {
          netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (e) {
          alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
          return false;
        }
      }
      var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
      prefs.setCharPref('browser.startup.homepage',url);
    } else {
      //alert('您的浏览器不支持自动设置首页, 使用浏览器菜单或在浏览器地址栏输入“chrome://settings/browser”手动设置!');
      $("#sethomepage").href();
    }
  }
  return false;
}

//日期时间格式化
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 判断是否是空
 * @param value
 */
function isEmpty(value){
  if(value == null || value == "" || value == "undefined" || value == undefined || value == "null"){
    return true;
  }
  else{
    value = value.replace(/\s/g,"");
    if(value == ""){
      return true;
    }
    return false;
  }
}

//正则
function trimTxt(txt){
 return txt.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 检查是否含有非法字符
 * @param temp_str
 * @returns {Boolean}
 */
function is_forbid(temp_str){
    temp_str=trimTxt(temp_str);
  temp_str = temp_str.replace('*',"@");
  temp_str = temp_str.replace('--',"@");
  temp_str = temp_str.replace('/',"@");
  temp_str = temp_str.replace('+',"@");
  temp_str = temp_str.replace('\'',"@");
  temp_str = temp_str.replace('\\',"@");
  temp_str = temp_str.replace('$',"@");
  temp_str = temp_str.replace('^',"@");
  temp_str = temp_str.replace('.',"@");
  temp_str = temp_str.replace(';',"@");
  temp_str = temp_str.replace('<',"@");
  temp_str = temp_str.replace('>',"@");
  temp_str = temp_str.replace('"',"@");
  temp_str = temp_str.replace('=',"@");
  temp_str = temp_str.replace('{',"@");
  temp_str = temp_str.replace('}',"@");
  var forbid_str=new String('@,%,~,&');
  var forbid_array=new Array();
  forbid_array=forbid_str.split(',');
  for(i=0;i<forbid_array.length;i++){
    if(temp_str.search(new RegExp(forbid_array[i])) != -1)
    return false;
  }
  return true;
}

/**
 * 检查手机号码
 * @param mobile
 * @returns {Boolean}
 */
function check_mobile(mobile){
  var regu = /^\d{11}$/;
  var re = new RegExp(regu);
  if(!re.test(mobile)){
   return  false;
  }
  return true;
}

/**
 * 验证电话号码，带"(,),-"字符和数字其他不通过
 * @param str
 * @returns {Boolean}
 */
function checkPhone(str){
   if(str.length > 20){
    return false;
   }
   var patternStr = "(0123456789-)";
   var  strlength=str.length;
   for(var i=0;i<strlength;i++){
        var tempchar=str.substring(i,i+1);
    if(patternStr.indexOf(tempchar)<0){
        return false;
    }
   }
   return true ;
}

// 等待一个元素加载完成
// $("#btn_comment_submit").wait(function() { //等待#btn_comment_submit元素的加载
// this.removeClass("comment_btn").addClass("btn"); //提交按钮
// //这里的 this 就是 $("#btn_comment_submit")
// });
jQuery.fn.wait = function (func, times, interval) {
  var _times = times || -1, //100次
  _interval = interval || 20, //20毫秒每次
  _self = this,
  _selector = this.selector, //选择器
  _iIntervalID; //定时器id
  if( this.length ){ //如果已经获取到了，就直接执行函数
  func && func.call(this);
  } else {
  _iIntervalID = setInterval(function() {
  if(!_times) { //是0就退出
  clearInterval(_iIntervalID);
  }
  _times <= 0 || _times--; //如果是正数就 --

  _self = $(_selector); //再次选择
  if( _self.length ) { //判断是否取到
  func && func.call(_self);
  clearInterval(_iIntervalID);
  }
  }, _interval);
  }
  return this;
}

// 截取字符串
// $(this).text(cutstr(s, 40));
function cutstr(str, len) {
  var str_length = 0;
  var str_len = 0;
  str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat("...");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串；
  if (str_length < len) {
    return str + "&nbsp;&nbsp;&nbsp;&nbsp;";
  }
}

function AmountLtoU(num) {
    ///<summery>小写金额转化大写金额</summery>
    ///<param name=num type=number>金额</param>
    if(isNaN(num))return "无效数值！";
    var strPrefix="";
    if(num<0)strPrefix ="(负)";
    num=Math.abs(num);
    if(num>=1000000000000)return "无效数值！";
    var strOutput = "";
    var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
    var strCapDgt='零壹贰叁肆伍陆柒捌玖';
    num += "00";
    var intPos = num.indexOf('.');
    if (intPos >= 0){
        num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
    }
    strUnit = strUnit.substr(strUnit.length - num.length);
    for (var i=0; i < num.length; i++){
        strOutput += strCapDgt.substr(num.substr(i,1),1) + strUnit.substr(i,1);
    }
    return strPrefix+strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
};
