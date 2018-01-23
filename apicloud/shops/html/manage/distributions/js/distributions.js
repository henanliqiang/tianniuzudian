/**
 * 电池库存订单
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#distributis-form',
    data: {
        BatteryOrder_data: {
            batteryOrderList: [], //商品列表
        },
        chooselectstats: true,
        tabbtnnum: 1,
        moredatatxt: '',
        pageSize: 6,
        pageNo: 1,
        totalPage: 0, //总页数
    },
    methods: {
        //初始化
        init: function() {
            // 增配訂單
            vm.getselectBatteryOrder(1);
            vm.pageNo = 1;
            // tab效果
            var tab = new auiTab({
                element: document.getElementById("tab"),
            }, function(ret) {
                vm.pageNo = 1;
                if (ret.index == 1) {
                    vm.tabbtnnum = 1;
                    // 增配訂單
                }
                if (ret.index == 2) {
                    vm.tabbtnnum = 2;
                    // 简配訂單
                }
                vm.getselectBatteryOrder(vm.tabbtnnum);
            });
        },
        // 获取店铺信息详情
        getselectBatteryOrder: function(type) {
            apps.axget(
                "shopBattery/selectBatteryOrder", {
                    type: type,
                    pageNo: vm.pageNo,
                    pageSize: vm.pageSize,
                },
                function(data) {
                    if (data.totalPage <= 1 || vm.pageNo == data.totalPage) {
                        vm.moredatatxt = "暂无更多记录";
                    } else {
                        vm.moredatatxt = "上滑获取更多记录";
                    }
                    if (vm.pageNo == 1) {
                        vm.BatteryOrder_data.batteryOrderList = [];
                        data.datas.forEach(function(item) {
                            if (item) {
                                vm.BatteryOrder_data.batteryOrderList.push(item);
                            }
                        });
                        vm.totalPage = data.totalPage; //总页数
                    } else {
                        //如果存在数据并且当前的页面小于等于总页码时push
                        if (data.datas.length && vm.pageNo <= data.totalPage) {
                            data.datas.forEach(function(item) {
                                vm.BatteryOrder_data.batteryOrderList.push(item);
                            });
                        }
                    }
                    vm.pageNo++;
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
    //上拉加载
    api.addEventListener({
        name: 'scrolltobottom',
        extra: {
            threshold: 0 //设置距离底部多少距离时触发，默认值为0，数字类型
        }
    }, function(ret, err) {
        if (vm.pageNo <= vm.totalPage) {
            vm.getselectBatteryOrder(vm.tabbtnnum);
        }
    });
}