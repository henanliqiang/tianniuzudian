/**
 *  login 登录JS 逻辑功能
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-06-02 14:50:40
 * @version v0.0.1
 */

// 登录部分、操作
// 查看是否有本地数据（记住用户名）
// (function() {

// 声明vue加载
var vm = new Vue({
    el: '#app-login-form',
    data: {
        // login_data: {
        username: "",
        password: "",
        gloabluserToken: "",
        remembercheck: true,
        localrememberstas: '', //本地缓存记住状态
        storeSetdata: {}, //店铺数据基础设置缓存
        // },
    },
    methods: {
        loginBtn: function() {
            //验证 用户名、密码
            if (!loginUserName()) {
                return false;
            }
            if (!loginPassword()) {
                return false;
            }
            var password = Encrypt(vm.password); // 加密
            api.toast({
                msg: "正在登录，请稍后...",
                location: 'middle'
            });
            // 登录系统...
            apps.axpost(
                "n/shopLogin/login", { //需要提交的参数值
                    username: vm.username,
                    password: password
                },
                function(data) {
                    // 传值全局userToken标识
                    vm.gloabluserToken = GLOBALconfig.gloabluserToken = data.userToken;
                    vm.storeSetdata = data;
                    //api.setPrefs设置登录成功状态
                    api.setPrefs({
                        key: 'loginStatus',
                        value: 'loginSuccess'
                    });
                    // 添加【登录成功】事件监听
                    api.sendEvent({
                        name: 'loginSuccess',
                        extra: {
                            username: vm.username,
                            userToken: vm.gloabluserToken
                        }
                    });
                    // 存入本地缓存数据
                    vm.saveusernameStorage();
                });
        },
        // 记住用户名保存本地
        saveusernameStorage: function() {
            var remembercheck = vm.remembercheck;
            var username = vm.username;
            /*if (remembercheck) {
                $api.setStorage("remembercheck", "yes");
            } else {
                var username = '';
                $api.setStorage("remembercheck", "no");
            }*/
            // 存入用户名和usertoken
            $api.setStorage("appusername", username);
            api.setPrefs({
                key: 'appusername',
                value: username
            });
            // usertoken
            $api.setStorage('gloabluserToken', vm.gloabluserToken);
            // 店铺基础设置
            $api.setStorage('storeSetdata', vm.storeSetdata);
            api.setPrefs({
                key: 'gloabluserToken',
                value: vm.gloabluserToken
            });
            vm.isloginUrl();
        },
        // 读取本地缓存
        loadusernameStorage: function() {
            var username = $api.getStorage("appusername");
            var remembercheck = $api.getStorage("remembercheck");
            vm.username = username;
            if (remembercheck == 'yes') {
                vm.remembercheck = true;
            } else {
                vm.remembercheck = false;
            }
        },
        init: function() {
            // 获取本地记录数据
            vm.loadusernameStorage();
        },
        // 登陆跳转页面
        isloginUrl: function() {
            var storeSetdata = $api.getStorage("storeSetdata");
            api.sendEvent({
                name: 'loginsucesspst'
            });
            // 是否上线店铺
            // isonline:"是否上线 0：否 1：是 2：初始添加"
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
            } else {
                // 如果没店铺信息 跳转到注册
                // auditstatus:"审核状态 0：初始添加 1：审核不通过 2：审核通过"
                jumpUrl.join();
            }
        }
    }
});

// 用户名验证
var loginUserName = function() {
    //  * 前端判断状态 为空
    if (vm.username) {
        return true;
    } else {
        api.toast({
            msg: "手机号/用户名不能为空",
            location: 'middle'
        });
        return false;
    }
};

// 密码验证
var loginPassword = function() {
    if (vm.password) {
        vm.password_state = false;
        if (vm.password.length < 6) {
            // 密码少于6位数
            api.toast({
                msg: "密码最少为6位",
                location: 'middle'
            });
            return false;
        }
        return true;
    } else {
        api.toast({
            msg: "请输入有效密码",
            location: 'middle'
        });
        return false;
    }
};

// })();
apiready = function() {
    // 初始化
    vm.init();
}