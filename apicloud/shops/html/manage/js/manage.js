/**
 * 电池管理
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#management-frm',
    data: {
        batteryselect: {
            batteryList: [],
            platbond: 0,
        },
        requestalipay: '', //支付宝返回请求数据
        costdistribute: 0,
        battery: [], //电池json
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
                });
        },
        // 加减选择
        change_goods_num: function(num, index) {
            var item = vm.batteryselect.batteryList[index];
            if (num == 1) {
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
        // 修改满电
        updateFullPowerBtn: function() {
            // 二维码大图
            apps.openMapWinUrl('updatefullpower', 'manage/updatefullpower_win.html', { batteryList: vm.batteryselect.batteryList });
        },
        //客服热线
        callus: function() {
            api.call({
                type: 'tel_prompt',
                number: '400-862-5918'
            });
        }
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
            id: item.id,
            price: item.marketprice,
            num: item.groupnum,
            total: (item.marketprice * item.groupnum)
        });
    });
    vm.totalprice = sum;
    // console.log(JSON.stringify(vm.battery));
}, { deep: true });

apiready = function() {
     // 实现沉浸式效果
    $api.fixStatusBar($api.dom("header"));
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.init();
    // 监听刷新
    api.addEventListener({
        name: 'updatedataops',
    }, function(ret, err) {
       vm.init();
    });

    api.addEventListener({
        name: 'loginsucesspst'
    }, function(ret) {
         vm.init();
    });
};