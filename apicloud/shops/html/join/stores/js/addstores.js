/**
 * 找物流
 * @authors 郭小北 (kubai666@126.com)
 * @date    2016-05-31 17:27:39
 * @version 0.0.1
 */

// 声明vue加载
var vm = new Vue({
    el: '#addstores-frm',
    data: {
        area: '请选择 省/市/区',
        // 附近图片
        contactID_attach: [],
        businesslicense_attach: [],
        photo_attach: [],
        img_attach: [],

        // 下拉列表
        scopebusiness: '请选择',
        options: [
            { text: '请选择', value: '请选择' },
            { text: '电动车/配件出售', value: '电动车/配件出售' },
            { text: '电动车修理', value: '电动车修理' },
            { text: '电池出售', value: '电池出售' },
            { text: '其他', value: '其他' }
        ],
        attachlist: [], //取附件列表
        shopselect: {
            area: '请选择 省/市/区',
            contactID: '',
            businesslicense: '',
            photo: '',
            img: [],
        }
    },
    methods: {
        //初始化
        init: function() {
            vm.storeSetdata = $api.getStorage("storeSetdata");
            // 未通过审核 重新获取店铺
            if (vm.storeSetdata.auditstatus === 1) {
                apps.axget(
                    "shop/select", {},
                    function(data) {
                        vm.shopselect = data;
                        vm.area = vm.shopselect.provincename + '  ' + vm.shopselect.cityname + '  ' + vm.shopselect.countyname;
                        // 附件
                        vm.shopselect.contactID = vm.contactID_attach.length ? vm.contactID_attach[0].url : data.contactID;
                        vm.shopselect.businesslicense = vm.businesslicense_attach.length ? vm.businesslicense_attach[0].url : data.businesslicense;
                        vm.shopselect.photo = vm.photo_attach.length ? vm.photo_attach[0].url : data.photo;
                        vm.shopselect.img = vm.img_attach.length ? vm.img_attach : data.img;
                    });
            }
        },
        //上传图片附件-身份证
        //下单附件
        upimgattach: function(attachTypes) {
            jumpUrl.upimgattach({ attachlist: vm.attachlist, attachTypes: attachTypes });
        },
    }
});

apiready = function() {
    //下拉刷新
    apps.pageDataF5(function() {
        vm.init();
    });
    vm.init();

    var addressView = api.require('addressView');
    addressView.open({
        file_addr: 'widget://res/district.txt', //数据源地址
        selected_color: '#ff0000', //颜色
        pro_id: 410000, //省id
        city_id: 410100, //市id
        dir_id: 410104 //区id
    });
    $api.addEvt($api.byId("addressView"), 'click', function() {
        addressView.show({}, function(ret, err) {
            if (ret.status) {
                vm.shopselect.provincename = ret.data[0].name;
                vm.shopselect.cityname = ret.data[1].name;
                vm.shopselect.countyname = ret.data[2].name;
                vm.area = ret.data[0].name + '  ' + ret.data[1].name + '  ' + ret.data[2].name;
            }
        });
    });
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
        "n/shopRegister/addShop", {
            //需要提交的参数值
            address: vm.shopselect.address,
            contactname: vm.shopselect.contactname,
            contactcellphone: vm.shopselect.contactcellphone,
            name: vm.shopselect.name,
            provincename: vm.shopselect.provincename,
            cityname: vm.shopselect.cityname,
            countyname: vm.shopselect.countyname,
            scopebusiness: vm.shopselect.scopebusiness,
            opentime: vm.shopselect.opentime,
            operatarea: vm.shopselect.operatarea,
            // 图片
            contactID: vm.shopselect.contactID,
            businesslicense: vm.shopselect.businesslicense,
            photo: vm.shopselect.photo,
            img: vm.img_attach,
        },
        function(data) {
            api.toast({
                msg: "添加成功",
                duration: 2000,
                location: 'middle'
            });
            //店铺审核状态监听
            api.sendEvent({
                name: 'registerInfo_stats',
                extra: {
                    registerInfo_stats: 1,
                }
            });
            setTimeout(function() {
                api.closeWin();
            }, 1000);
        });
}