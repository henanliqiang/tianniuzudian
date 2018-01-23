/**
 * 预约服务详情
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#servicedetail-frm',
    data: {
        selectAppointInfo: {},
        // 预约id
        identcode: '',
        shopsAddress: '',
        batterishdamage_attach: [], // 传图
        batterishdamage: '', // 传图
    },
    methods: {
        //初始化
        init: function() {
            vm.identcode = api.pageParam.identcode;
            if (vm.identcode != '') {
                vm.selectServiceInfo();
            } else {
                api.toast({
                    msg: '预约信息为空',
                    duration: 2000,
                    location: 'middle'
                });
            }
        },
        // 获取店铺信息详情
        selectServiceInfo: function() {
            // 加载框
            var UILoading = api.require('UILoading');
            UILoading.flower({
                center: {
                    x: (api.winWidth / 2),
                    y: (api.winHeight / 2)
                },
                size: 30,
                fixed: true
            }, function(ret) {
                vm.UILoadId = ret.id;
            });
            apps.axget(
                "shopBatteryService/selectServiceInfo", {
                    identcode: vm.identcode
                },
                function(data) {
                    if (data) {
                        // 关闭打开的加载提示框
                        UILoading.closeFlower({
                            id: vm.UILoadId
                        });
                        vm.selectAppointInfo = data;
                        vm.shopsAddress = vm.selectAppointInfo.provincename + '' + vm.selectAppointInfo.cityname + '' + vm.selectAppointInfo.countyname + '' + vm.selectAppointInfo.address;
                    }
                });
        },
        // 电池预约确认完成
        finishServiceBtn: function(type, msgotbat) {
            var title, msg, typetsg;
            msg = "";
            title = "";
            typetsg = "";
            var getsurlt = "shopBatteryService/finishService";
            if (vm.selectAppointInfo.type == 2) {
                typetsg = '回收';
            }
            if (vm.selectAppointInfo.type == 1) {
                typetsg = '更换';
            }

            if (type == 0) {
                // 安装
                title = '确定已完成本预约电池安装？';
            }
            if (type == 1) {
                // 电池已更换
                title = '确定已完成本订单电池更换？';
            }
            if (type == 2) {
                // 电池已收回
                title = '确定已拆卸回收的是' + msgotbat + '电池，并没有损坏？';
                msg = '标记此状态后，该用户押金可赎回';
            }
            if (type == 3) {
                getsurlt = "shopBatteryService/modelError";

                // 型号不符
                title = '电池型号不符，不予' + typetsg;
            }
            if (type == 4) {
                // 电池损坏
                title = '电池已损坏，不予' + typetsg;
                msg = '请提交电池损毁部位照片，平台进行定损处理；定损结果确认前，该用户电池无法更换及退还；';
            }
            api.confirm({
                title: title,
                msg: msg,
                buttons: ['确定', '取消']
            }, function(ret, err) {
                var index = ret.buttonIndex;
                if (index == 1) {
                    if (type == 4) {
                        // 电池损坏照片
                        jumpUrl.upimgattach({ attachlist: vm.attachlist, attachTypes: 'batterishdamage' });
                    } else {
                        apps.axpost(
                            getsurlt, {
                                id: vm.selectAppointInfo.id
                            },
                            function(data) {
                                api.sendEvent({
                                    name: 'shopBatteryServicesucesspst'
                                });
                                api.alert({
                                    title: '',
                                    msg: '操作成功',
                                }, function(ret, err) {
                                    api.closeWin();
                                });
                            });
                    }
                }
            });
        },
    },
});

apiready = function() {
    api.parseTapmode();
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.init();
    //上传附件信息监听变化
    api.addEventListener({
        name: 'batterishdamage_attach'
    }, function(ret) {
        vm.batterishdamage_attach = ret.value.attachlist;
        vm.batterishdamage = vm.batterishdamage_attach[0].url;
        saveBtn();
    });

}

function saveBtn() {
    api.toast({
        msg: "正在提交...请稍后",
        duration: 1000,
        location: 'middle'
    });
    apps.axpost(
        "shopBatteryService/damage", {
            //需要提交的参数值
            id: vm.selectAppointInfo.id,
            lossimg: vm.batterishdamage,
        },
        function(data) {
            api.alert({
                title: '',
                msg: '操作成功',
            }, function(ret, err) {
                api.closeWin();
            });
        });
}