/**
 * 减少订单
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#addobtarder-frm',
    data: {
        batteryselect: {
            batteryList: [],
            platbond: 0,
        },
        costdistribute: 0,
        battery: [], //电池json
        goodsCount: 1,
        totalprice: 0, //商品成本总计
    },
    methods: {
        //初始化
        init: function() {
            vm.getbatterySelect();
        },
        //获取电池
        getbatterySelect: function() {
            apps.axget(
                "shopBattery/select", {},
                function(data) {
                    vm.batteryselect.batteryList = data;

                    // /归0
                    vm.batteryselect.batteryList.forEach(function(item) {
                        item.groupnum = 0;
                    });
                });
        },
        // 加减选择
        change_goods_num: function(num, index) {
            var item = vm.batteryselect.batteryList[index];

            if (num == 1) {
                if (item.groupnum >= item.distrinum) {
                    api.toast({
                        msg: '不能超过网点最大配货数',
                        location: 'middle'
                    });
                    return false;
                }
                item.groupnum++;
            } else {
                if (item.groupnum <= 0) {
                    item.groupnum = 0;
                    api.toast({
                        msg: '订购数量最低为 0',
                        location: 'middle'
                    });
                    return false;
                }
                item.groupnum--;
            }
        },
        // 遍历电池个数
        create_order: function() {
            vm.batteryselect.batteryList.forEach(function(item) {
                if (item.putway == 1) {
                    vm.checkgoodshop.push(item.id);
                }
            });
        },
    }
});

//计算成本价
vm.$watch('batteryselect.batteryList', function() {
    var sum = 0;
    //  电池json串
    vm.battery = [];
    vm.batteryselect.batteryList.forEach(function(item) {
        item.sumprice = item.pickcost * item.groupnum;
        sum += item.sumprice;
        vm.battery.push({
            id: item.batteryid,
            price: item.pickcost,
            num: item.groupnum,
            total: (item.pickcost * item.groupnum)
        });
    });
    vm.totalprice = sum;
    // console.log(JSON.stringify(vm.battery));
}, { deep: true });

apiready = function() {
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.init();
};


function saveBtn() {
    apps.axpost(
        "shopBattery/reduceBatteryOrder", {
            //需要提交的参数值
            battery: vm.battery,
            costdistribute: vm.totalprice,
        },
        function(data) {
            api.sendEvent({
                name: 'updatedataops',
            });
            //支付成功跳转到 提示页面
            api.alert({
                title: '',
                msg: '减配订单提交成功，请等待平台审核，通过审核后，退货款将返还至您的钱包可随时提现',
            }, function(ret, err) {
                api.closeWin();
            });
        });
}