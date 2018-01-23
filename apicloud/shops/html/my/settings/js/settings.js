/**
 * 店铺管理信息
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#management-frm',
    data: {

        headportrait_attach: [],
        shopselect: {
            username: '',
            nickname: '',
            headportrait: '',
        }
    },
    methods: {
        //初始化
        init: function() {
            // 重新获取店铺
            apps.axget(
                "shopUser/selectInfo", {},
                function(data) {
                    vm.shopselect = data;
                    vm.shopselect.headportrait = vm.headportrait_attach.length ? vm.headportrait_attach[0].url : data.headportrait;
                });
        },
        //上传图片附件
        upimgattach: function(attachTypes) {
            jumpUrl.upimgattach({ attachlist: vm.attachlist, attachTypes: attachTypes });
        },
        editnameBrn: function() {
            api.prompt({
                title: '请输入您的姓名',
                text: '',
                buttons: ['确定', '取消']
            }, function(ret, err) {
                var index = ret.buttonIndex;
                var text = ret.text;
                if (index == 1) {
                    vm.shopselect.nickname = text;
                    saveBtn();
                }
            });
        },
        // 登出
        loginOut: function() {
            //同步返回结果：
            api.confirm({
                    title: '确定退出当前帐号',
                    // msg: 'testmsg',
                    buttons: ['确定', '取消']
                },
                function(ret, err) {
                    if (ret.buttonIndex==1) {
                        // 退出系统...
                        apps.axpost(
                            "n/shopLogin/logout", { //需要提交的参数值

                            },
                            function(data) {
                                $api.setStorage('gloabluserToken', '');
                                // $api.clearStorage(); // 清除登录数据
                                // 添加【退出】事件监听
                                api.sendEvent({
                                    name: 'loginOut',
                                    extra: {
                                        msg: '退出成功'
                                    }
                                });
                                api.removePrefs({
                                    key: 'loginStatus'
                                });
                                //跳转到 登录
                                jumpUrl.login();
                            });
                    }

                }
            );
        },
    }
});

apiready = function() {
    vm.init();
    //上传附件信息监听变化
    api.addEventListener({
        name: 'headportrait_attach'
    }, function(ret) {
        vm.headportrait_attach = JSON.parse(ret.value);
        vm.shopselect.headportrait = vm.headportrait_attach[0].url;
        saveBtn();
    });
};


function saveBtn() {
    api.toast({
        msg: "正在提交...请稍后",
        duration: 1000,
        location: 'middle'
    });
    apps.axpost(
        "shopUser/updateInfo", {
            //需要提交的参数值
            nickname: vm.shopselect.nickname,
            headportrait: vm.shopselect.headportrait,
        },
        function(data) {
            api.toast({
                msg: "修改成功",
                duration: 2000,
                location: 'middle'
            });
            vm.init();
            // api.closeWin();
        });
}