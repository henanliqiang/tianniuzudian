/**
 * 签约合同
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#bespeakshops-frm',
    data: {
        agreeTxtSta: 1,
        daystatistics: {},
        selOneNotice: {},
    },
    methods: {
        //初始化
        init: function() {
            var storeSetdata = $api.getStorage("storeSetdata");
            // 是否上线店铺
            // isonline:"是否上线 0：否 1：是 2：初始添加"
            if (storeSetdata) {
                if (storeSetdata.isonline === 1) {
                    // 跳转首页
                    api.sendEvent({
                        name: 'indexinit'
                    });
                    setTimeout(function() {
                        api.closeToWin({
                            name: 'root'
                        });
                    }, 300);
                    vm.getdaystatistics();
                } else {
                    // 如果没店铺信息 跳转到注册
                    // auditstatus:"审核状态 0：初始添加 1：审核不通过 2：审核通过"
                    jumpUrl.join();
                }
            } else {
                jumpUrl.login();
            }
        },
        // 输入验证码
        identcodeBtn: function() {
            api.prompt({
                title: '请输入订单验证码',
                text: '',
                buttons: ['确定', '取消']
            }, function(ret, err) {
                var index = ret.buttonIndex;
                var text = ret.text;
                if (index == 1) {
                    // 查询信息，是否跳入详情
                    vm.fisdServiceInfo(text);
                }
            });
        },
        fisdServiceInfo: function(identcode) {
            // 预约服务详情
            apps.axget(
                "shopBatteryService/selectServiceInfo", {
                    identcode: identcode
                },
                function(data) {
                    // 预约服务详情
                    jumpUrl.servicedetail({ identcode: identcode });
                },
                // 错误信息
                function(code, message) {
                    api.alert({
                        title: '提示信息',
                        msg: message,
                    });
                });
        },
        // 打开二维码事件
        openFNScannerBtn: function() {
            var FNScanner = api.require('FNScanner');
            // 二维码扫码开关
            $api.addEvt($api.byId("openFNScannerBtn"), 'click', function() {
                FNScanner.openScanner({
                    autorotation: true
                }, function(ret, err) {
                    if (ret) {
                        var eventType = ret.eventType;
                        if (ret.eventType == 'success') {
                            // 查询信息，是否跳入详情
                            vm.fisdServiceInfo(ret.content);
                        }
                        if (ret.eventType == 'fail') {
                            api.toast({
                                msg: "扫描失败，请稍后重试",
                                location: 'middle'
                            });
                        }
                        if (ret.eventType == 'cancel') {
                            api.toast({
                                msg: "您已取消扫码",
                                location: 'middle'
                            });
                        }
                    } else {
                        api.toast({
                            msg: err.msg,
                            location: 'middle'
                        });
                    }
                });
            });
        },

        getdaystatistics: function() {
            // 今日预约
            apps.axget(
                "shopBatteryService/statistics", {},
                function(data) {
                    vm.daystatistics = data;
                });
            // 公告一条
            apps.axget(
                "platformNotice/selectOneNotice", {},
                function(data) {
                    vm.selOneNotice = data;
                });
        }
    }
});
apiready = function() {
    // 实现沉浸式效果
    $api.fixStatusBar($api.dom("header"));
    vm.init();
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.openFNScannerBtn();
    api.addEventListener({
        name: 'loginsucesspst'
    }, function(ret) {
        vm.init();
    });
    api.addEventListener({
        name: 'shopBatteryServicesucesspst'
    }, function(ret) {
        vm.init();
    });
}