/**
 * 线上签约店铺管理
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#join-frm',
    data: {
        // storeSetdata: { "auditstatus": 2, "issigntreaty": 0, "isonline": 1, "costdistribute": 0, "userToken": "shop_1c5c20dc4b082f3f6a9f569261381a5d", "ispayfee": 1, "platbond": 0, "auditreason": "" }, //  店铺注册数据
        storeSetdata: {},
    },
    computed: {
        // 缴费状态变化
        ispayfeeclass: function() {
            return {
                'block-item': this.storeSetdata.ispayfee == 1,
                'block-item-success': this.storeSetdata.ispayfee == 1,
                'block-item-click': this.storeSetdata.ispayfee == 0 && this.storeSetdata.auditstatus == 2
            }
        }
    },
    methods: {
        //初始化
        init: function() {
            // vm.storeSetdata = $api.getStorage("storeSetdata");
            apps.axget(
                "n/shopRegister/registerInfo", {},
                function(data) {
                    vm.storeSetdata = data;
                    $api.setStorage('storeSetdata', vm.storeSetdata);
                });

            // isonline:"是否上线 0：否 1：是 2：初始添加"
            if (vm.storeSetdata.isonline === 1) {
                // 跳转首页
                api.sendEvent({
                    name: 'indexinit'
                });
                setTimeout(function() {
                    api.closeToWin({
                        name: 'root'
                    });
                }, 300);
            }
        },
        //客服热线
        callus: function() {
            api.call({
                type: 'tel_prompt',
                number: '400-862-5918'
            });
        },
        // 登出
        loginOut: function() {
            //同步返回结果：
            api.confirm({
                title: '确定退出当前帐号',
                // msg: 'testmsg',
                buttons: ['取消', '确定']
            }, function(ret, err) {
                if (ret.buttonIndex == 2) {
                    // 退出系统...
                    // $api.setStorage('gloabluserToken', '');
                    // $api.clearStorage(); // 清除登录数据
                    // 添加【退出】事件监听
                    /* apps.axpost(
                         "n/customerMobileLogin/logout", {},
                         function(data) {
                             api.sendEvent({
                                 name: 'loginOut',
                                 extra: {
                                     msg: '退出成功'
                                 }
                             });
                             api.removePrefs({
                                 key: 'loginStatus'
                             });
                             //页面初始化
                             jumpUrl.login();
                         });*/
                    jumpUrl.login();
                }
            });
        },
    }
});

apiready = function() {
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    // 收到监听 刷新请求
    api.addEventListener({
        name: 'registerInfo_stats'
    }, function(ret, err) {
        vm.init();
    });
    vm.init();
};