/**
 * 交纳加盟费
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#fee-frm',
    data: {
        batteryselect: {
            batteryList: [],
            platbond: 0,
        },
        paymode: 0,
        usealipay: true, //使用支付宝
        usewxpay: false, //使用微信支付
        requestalipay: '', //支付宝返回请求数据
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
                "battery/select", {},
                function(data) {
                    vm.batteryselect = data;
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
        // 遍历电池个数
        create_order: function() {
            vm.batteryselect.batteryList.forEach(function(item) {
                if (item.putway == 1) {
                    vm.checkgoodshop.push(item.id);
                }
            });
        },
        // 支付模式选择
        paymodeBtn: function(paymodeNum) {
            if (paymodeNum == '0') {
                vm.paymode = 0;
                vm.usealipay = true;
                vm.usewxpay = false;
            }
            if (paymodeNum == '1') {
                vm.paymode = 1;
                vm.usewxpay = true;
                vm.usealipay = false;
            }
        },
        //客服热线
        callus: function() {
            api.call({
                type: 'tel_prompt',
                number: '400-862-5918'
            });
        },
        //调用支付宝客户端支付
        aliPayfun: function() {
            var aliPayPlus = api.require('aliPayPlus');
            aliPayPlus.payOrder({
                orderInfo: vm.requestalipay
            }, function(ret, err) {
                if (ret) {
                    switch (ret.code) {
                        // code为 1 说明返回成功
                        case '9000':
                            alert('支付成功');
                            //店铺审核状态监听
                            api.sendEvent({
                                name: 'registerInfo_stats',
                                extra: {
                                    registerInfo_stats: 1,
                                }
                            });
                            api.closeWin();
                            break;
                        case '4000':
                            api.toast({
                                msg: '系统异常',
                                location: 'middle'
                            });
                            break;
                        case '4006':
                            api.toast({
                                msg: '订单支付失败',
                                location: 'middle'
                            });
                            break;
                        case '6000':
                            api.toast({
                                msg: '支付服务正在进行升级操作',
                                location: 'middle'
                            });
                            break;
                        case '6001':
                            api.toast({
                                msg: '用户中途取消支付操作',
                                location: 'middle'
                            });
                            break;
                        case '0001':
                            api.toast({
                                msg: '缺少商户配置信息（商户id，支付公钥，支付密钥）',
                                location: 'middle'
                            });
                            break;
                        case '0002':
                            api.toast({
                                msg: '缺少参数（subject、body、amount、tradeNO）',
                                location: 'middle'
                            });
                            break;
                        case '0003':
                            api.toast({
                                msg: '签名错误（公钥私钥错误）',
                                location: 'middle'
                            });
                            break;
                        default:
                            alert(ret.code);
                            api.toast({
                                msg: '收款方支付宝账户状态异常',
                                location: 'middle'
                            });
                            break;
                    }
                } else {
                    alert('收款方账户状态异常');
                }
            });
        },
        //调用微信客户端支付
        wxpayfun: function() {
            var wxPay = api.require('wxPay');
            wxPay.payOrder({
                apiKey: vm.requestalipay.appid,
                orderId: vm.requestalipay.prepayid,
                mchId: vm.requestalipay.partnerid,
                nonceStr: vm.requestalipay.noncestr,
                timeStamp: vm.requestalipay.timestamp,
                package: vm.requestalipay.package,
                sign: vm.requestalipay.sign
            }, function(ret, err) {
                //支付成功
                if (ret.status) {
                    //支付成功
                    alert('支付成功');
                    //店铺审核状态监听
                    api.sendEvent({
                        name: 'registerInfo_stats',
                        extra: {
                            registerInfo_stats: 1,
                        }
                    });
                    api.closeWin();
                } else {
                    // code: 1
                    //错误码：
                    //-2（用户取消，发生场景：用户不支付了，点击取消，返回APP）
                    //-1（未知错误，可能的原因：签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等）
                    //1 (apiKey值非法)
                    // alert(err.code);
                    switch (err.code) {
                        case -1:
                            api.toast({
                                msg: '系统异常或者未知错误，请联系管理员',
                                location: 'middle'
                            });
                            break;
                        case -2:
                            api.toast({
                                msg: '用户中途取消支付操作',
                                location: 'middle'
                            });
                            break;
                        default:
                            api.toast({
                                msg: '收款方账户状态异常',
                                location: 'middle'
                            });
                            break;
                    }
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
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.init();
    //上传附件信息监听变化
    api.addEventListener({
        name: 'createorderattach'
    }, function(ret) {
        vm.attachlist = ret.value;
    });
};


function saveBtn() {
    apps.axpost(
        "n/shopRegister/addPickBattery", {
            //需要提交的参数值
            battery: vm.battery,
            costdistribute: vm.totalprice,
            platbond: vm.batteryselect.platbond,
            paymode: vm.paymode,
        },
        function(data) {
            vm.requestalipay = data;
            // 如果 支付宝支付
            if (vm.paymode==0) {
                api.toast({
                    msg: '请用支付宝付款',
                    location: 'middle'
                });
                if (vm.requestalipay) {
                    vm.aliPayfun();
                }
            }
            // 如果 微信支付
            if (vm.paymode==1) {
                api.toast({
                    msg: '请用微信付款',
                    location: 'middle'
                });
                if (vm.requestalipay) {
                    vm.wxpayfun();
                }
            }
        });
}