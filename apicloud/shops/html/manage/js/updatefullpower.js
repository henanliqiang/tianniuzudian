/**
 * 修改满电电池
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#updatefullpower-frm',
    data: {
        batteryselect: {
            batteryList: [],
            platbond: 0,
        },
        UILoadId: '',
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
            vm.batteryselect.batteryList = api.pageParam.batteryList;
        },
        // 加减选择
        change_goods_num: function(num, index) {
            var item = vm.batteryselect.batteryList[index];
            if (num == 1) {
                if (item.fullpowernum >= item.stocknum) {
                    api.toast({
                        msg: '不能超过网点库存数',
                        location: 'middle'
                    });
                    return false;
                }
                item.fullpowernum++;
            } else {
                if (item.fullpowernum <= 0) {
                    item.fullpowernum = 0;
                    api.toast({
                        msg: '数量最低为 0',
                        location: 'middle'
                    });
                    return false;
                }
                item.fullpowernum--;
            }
        }
    }
});

//计算成本价
vm.$watch('batteryselect.batteryList', function() {
    //  电池json串
    vm.battery = [];
    vm.batteryselect.batteryList.forEach(function(item) {
        vm.battery.push({
            id: item.id,
            fullpowernum: item.fullpowernum,
        });
    });
}, { deep: true });

apiready = function() {
    vm.init();
};

function close_Winiframs() {
    api.setFrameAttr({
        name: 'updatefullpower',
        hidden: true
    });
}

function saveBtn() {
    apps.axpost(
        "shopBattery/updateFullPower", {
            //需要提交的参数值
            battery: vm.battery,
        },
        function(data) {
            // 添加更新监听
            api.sendEvent({
                name: 'updatedataops',
            });
            //支付成功跳转到 提示页面
            api.alert({
                title: '操作提醒',
                msg: '修改满电成功',
            }, function(ret, err) {
                close_Winiframs();
            });
        });
}