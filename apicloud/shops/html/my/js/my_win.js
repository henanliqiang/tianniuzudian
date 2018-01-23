/**
 * 我的中心
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#mywin-frm',
    data: {
        shopUserInfodata:{}
    },
    methods: {
        //初始化
        init: function() {
            vm.getshopUserInfo();
        },
        //获取电池
        getshopUserInfo: function() {
            apps.axget(
                "shopUser/selectInfo", {},
                function(data) {
                    vm.shopUserInfodata = data;
                });
        },
        //客服热线
        callus: function() {
            api.call({
                type: 'tel_prompt',
                number: '400-666-666'
            });
        }
    }
});

apiready = function() {
     // 实现沉浸式效果
    $api.fixStatusBar($api.dom("header"));
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.init();

    api.addEventListener({
        name: 'loginsucesspst'
    }, function(ret) {
         vm.init();
    });
};