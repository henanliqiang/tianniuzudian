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
        areaaddress: '省市区',
        // 附近图片
        contactID_attach: [],
        businesslicense_attach: [],
        photo_attach: [],
        img_attach: [],

        // 下拉列表
        scopebusiness: '请选择',
        attachlist: [], //取附件列表
        shopselect: {
            businestatus:0,
            comprofile:'',
            contactID: '',
            photo: '',
            img: [],
        }
    },
    methods: {
        //初始化
        init: function() {
            // 重新获取店铺
                apps.axget(
                    "shop/select", {},
                    function(data) {
                        vm.shopselect = data;
                        vm.areaaddress = vm.shopselect.provincename + '  ' + vm.shopselect.cityname + '  ' + vm.shopselect.countyname+ '  ' + vm.shopselect.address;
                        // 附件
                        vm.shopselect.contactID = vm.contactID_attach.length ? vm.contactID_attach[0].url : data.contactID;
                        vm.shopselect.businesslicense = vm.businesslicense_attach.length ? vm.businesslicense_attach[0].url : data.businesslicense;
                        vm.shopselect.photo = vm.photo_attach.length ? vm.photo_attach[0].url : data.photo;
                        vm.shopselect.img = vm.img_attach.length ? vm.img_attach : data.img;
                    });
        },
        //上传图片附件-身份证
        //下单附件
        upimgattach: function(attachTypes) {
            jumpUrl.upimgattach({ attachlist: vm.attachlist, attachTypes: attachTypes });
        },
    }
});

apiready = function() {
    vm.init();
    //上传附件信息监听变化
    api.addEventListener({
        name: 'contactID_attach'
    }, function(ret) {
        vm.contactID_attach = ret.value.attachlist;
        vm.shopselect.contactID = vm.contactID_attach[0].url;
    });
    api.addEventListener({
        name: 'businesslicense_attach'
    }, function(ret) {
        vm.businesslicense_attach = ret.value.attachlist;
        vm.shopselect.businesslicense = vm.businesslicense_attach[0].url;

    });
    api.addEventListener({
        name: 'photo_attach'
    }, function(ret) {
        vm.photo_attach = ret.value.attachlist;
        vm.shopselect.photo = vm.photo_attach[0].url;
    });
    api.addEventListener({
        name: 'img_attach'
    }, function(ret) {
        vm.img_attach = ret.value.attachlist;
    });
};


function saveBtn() {
    /*if (vm.area.trim() == '' || vm.space.trim() == '' || vm.leasebudget .trim() == '' || vm.contacts.trim() == '' || vm.gender == '' || vm.contactsphone.trim() == '') {
        api.toast({
            msg: "请将必填项填写完整",
            location: 'middle'
        });
        return false;
    }*/
    api.toast({
        msg: "正在提交...请稍后",
        duration: 1000,
        location: 'middle'
    });
    apps.axpost(
        "shop/update", {
            //需要提交的参数值
            comprofile: vm.shopselect.comprofile,
            businestatus: vm.shopselect.businestatus,
            businessbegin: vm.shopselect.businessbegin,
            businessend: vm.shopselect.businessend,
            photo: vm.shopselect.photo,
            img: vm.img_attach,
        },
        function(data) {
            api.toast({
                msg: "修改成功",
                duration: 2000,
                location: 'middle'
            });
        });
}