// ==UserScript==
// @name         拒绝二维码登录
// @namespace    NoQRCodeLogin
// @version      2.0.0
// @description  新版12306、QQ、支付宝、淘宝、京东、百度云盘等网站默认使用账号密码登录，不出现二维码登录界面，原版出自https://greasyfork.org/zh-CN/scripts/27183，采用jQuery重写,有需求或问题请反馈。
// @author       Eva
// @match        *://kyfw.12306.cn/*
// @match        *://login.taobao.com/*
// @match        *://passport.jd.com/*
// @match        *://*.baidu.com/*
// @match        *://*.douban.com/*
// @match        *://passport.suning.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.alipay.com/*
// @match        *://*.qq.com/*
// @match        *://*.weiyun.com/*
// @match        *://exmail.qq.com/*
// @match        *://*.cloud.tencent.com/*
// @match        *://*.qcloud.com/*
// @match        *://*.xiami.com/*
// @match        *://*.huya.com/*
// @match        *://passport.58.com/*
// @match        *://*.baixing.com/*
// @match        *://*.sl56.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-latest.min.js
// @run-at 		 document-end
// ==/UserScript==

(function () {
    'use strict';

    // 注册菜单
    GM_registerMenuCommand("拒绝二维码登录开关设置", setBtnStart);

    //setBtnStart();

    function setBtnStart() {
        var settingdiv = $('<div class="test">Hello World</div>');
        addGlobalStyle();
        $('body').append(settingdiv)
    }

    function addGlobalStyle() {
        var globalStyle = '.test{color:red}';
        $("<style></style>").text(globalStyle).appendTo($("head"));
    }

    var settingData = [
        { 'name': '12306', 'url': 'kyfw.12306.cn', 'enabled': true },
        { 'name': '淘宝', 'url': 'login.taobao.com', 'enabled': true },
        { 'name': '京东', 'url': 'passport.jd.com', 'enabled': true },
        { 'name': '百度', 'url': 'baidu.com', 'enabled': true },
        { 'name': '豆瓣', 'url': 'douban.com', 'enabled': true },
        { 'name': '苏宁易购', 'url': 'passport.suning.com', 'enabled': true },
        { 'name': '知乎', 'url': 'zhihu.com', 'enabled': true },
        { 'name': '支付宝', 'url': 'alipay.com', 'enabled': true },
        { 'name': '腾讯QQ', 'url': ['xui.ptlogin2.qq.com', 'ssl.xui.ptlogin2.qq.com', 'ui.ptlogin2.qq.com'], 'enabled': true },
        { 'name': '微云', 'url': 'weiyun.com', 'enabled': true },
        { 'name': '腾讯云', 'url': ['cloud.tencent.com', 'qcloud.com'], 'enabled': true },
        { 'name': '腾讯企业邮箱', 'url': 'exmail.qq.com', 'enabled': true },
        { 'name': '虾米音乐', 'url': 'xiami.com', 'enabled': true },
        { 'name': '虎牙直播', 'url': 'huya.com', 'enabled': true },
        { 'name': '58同城', 'url': 'passport.58.com', 'enabled': true },
        { 'name': '百姓网', 'url': 'baixing.com', 'enabled': true },
        { 'name': '升蓝物流', 'url': 'sl56.com', 'enabled': true }
    ];

    //更新设置
    var storageData = getStorageData();
    console.log('浏览器本地数据', storageData);
    if (storageData) {
        //同步最新支持列表到本地存储的设置数据
        var needUpate = false;
        var missingData = [];
        $.each(settingData, function (i, item) {
            var matchCount = 0;
            $.each(storageData, function (r, data) {
                if (item.name == data.name) {
                    matchCount++;
                    if (item.url.toString() != data.url.toString()) {
                        console.log("变更数据", data.url, "为", item.url);
                        data.url = item.url;
                        needUpate = true;
                    }
                }
            });
            if (matchCount == 0) missingData.push(item)
        });
        if (missingData.length > 0) {
            console.log("更新数据", missingData);
            $.merge(storageData, missingData);
            needUpate = true;
        }
    } else {
        //初始化浏览器本地存储的设置数据
        storageData = settingData
        console.log("初始化数据", storageData);
        needUpate = true;
    }
    if (needUpate) setStorageData(storageData);


    //处理业务
    $.each(storageData, function (r, data) {
        if ($.isArray(data.url)) {
            $.each(data.url, function (i, u) {
                check(u, data.enabled)
            });
        } else {
            check(data.url, data.enabled)
        }
    });

    function check(url, enabled) {
        if (matchURL(url) && enabled) {
            process(url);
            return false;
        }
    }

    function process(url) {
        console.log("网址匹配,可切换二维码登录：", url);
        switch (url) {
            case 'kyfw.12306.cn':  //12306
                var auto = setInterval(function () {
                    if ($('#J-login-code-loading').css('display') === 'none' && $('.login-hd-code').hasClass('active')) {
                        $('.login-hd-account a')[0].click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'login.taobao.com':  //淘宝
                var auto = setInterval(function () {
                    if ($('#J_StaticForm').css('display') === 'none') {
                        $('#J_Quick2Static').click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'passport.jd.com':  //京东
                var auto = setInterval(function () {
                    if ($('.login-box').css('display') === 'none') {
                        $('.login-tab-r').click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'baidu.com':  //百度
                //todo optimize code
                var auto = setInterval(function () {
                    var yunbtn = $('#TANGRAM__PSP_4__footerULoginBtn');
                    var indexBtn = $('#TANGRAM__PSP_10__footerULoginBtn');
                    var passportBtn = $('#TANGRAM__PSP_3__footerULoginBtn');
                    var tiebaBtn = $('#TANGRAM__PSP_11__footerULoginBtn');
                    var tiebaBtn2 = $('#TANGRAM__PSP_28__footerULoginBtn');
                    var wenKuBtn = $('#TANGRAM__PSP_18__footerULoginBtn');
                    if (yunbtn.length > 0) {
                        yunbtn[0].click();
                        clearInterval(auto);
                    }
                    if (indexBtn.length > 0) {
                        indexBtn[0].click();
                        clearInterval(auto);
                    }
                    if (passportBtn.length > 0) {
                        passportBtn[0].click();
                        clearInterval(auto);
                    }
                    if (tiebaBtn.length > 0) {
                        tiebaBtn[0].click();
                        clearInterval(auto);
                    }
                    if (tiebaBtn2.length > 0) {
                        tiebaBtn2[0].click();
                        clearInterval(auto);
                    }
                    if (wenKuBtn.length > 0) {
                        wenKuBtn[0].click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'douban.com':  //豆瓣
                var auto = setInterval(function () {
                    if ($('.account-tab-phone').hasClass('on')) {
                        $('.account-tab-account')[0].click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'passport.suning.com':  //苏宁易购
                var auto = setInterval(function () {
                    if ($('.pc-login').css('display') === 'none') {
                        $('.tab-item')[1].click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'zhihu.com':  //知乎
                var loginDiv = $('.Login-content');
                var auto = setInterval(function () {
                    if (loginDiv.length == 0) {
                        $('.SignContainer-switch').children("span").click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'alipay.com':  //支付宝
                var auto = setInterval(function () {
                    var changeTabs = $('#J-loginMethod-tabs li');
                    var qrCode = $('#J-qrcode');
                    var ssoLogin = $('#J-ssoLogin');
                    var loginForm = $('#J-login');
                    var loginFormMethod = $('#J-loginFormMethod');
                    var popbox = $('#J_popbox');
                    if (popbox.hasClass('stat-login')) {
                        var iframe = $('#J_loginIframe');
                        if (iframe) {
                            var contentWindow = iframe[0].contentWindow;
                            if (contentWindow) {
                                var loginMethod = contentWindow.document.getElementById('J-loginFormMethod');
                                if (loginMethod) {
                                    contentWindow.document.getElementById('J-qrcode-target').click();
                                    clearInterval(auto);
                                }
                            }
                        }
                    }
                    if (changeTabs.length >= 2) {
                        changeTabs.each(function (index, element) {
                            var self = $(this);
                            if ((self.attr('data-status') === 'show_login') && (!self.hasClass("active"))) {
                                loginFormMethod.val('');
                                qrCode.addClass('fn-hide');
                                if (window.light && window.light.page && window.light.page.products && window.light.page.products.barcode) {
                                    window.light.page.products.barcode.onready(function () {
                                        this.stop();
                                    });
                                }
                                if (ssoLogin.attr('data-hide') === 'false' && ssoLogin.attr('data-state') === 'finished') {
                                    ssoLogin.removeClass('fn-hide');
                                } else {
                                    loginForm.removeClass('fn-hide');
                                }
                                self.addClass("active");
                                self.siblings().removeClass('active');
                                clearInterval(auto);
                            }
                        });
                    }
                }, 50);
                break;
            case 'xui.ptlogin2.qq.com':  //腾讯QQ
            case 'ssl.xui.ptlogin2.qq.com':
            case 'ui.ptlogin2.qq.com':
                var auto = setInterval(function () {
                    if ($('.onekey_logo').length == 1 || $('.face').length == 1) {
                        $('#switcher_plogin')[0].click();
                        $('#switcher_qlogin').on('click', function () {
                            clearInterval(auto);
                        })
                    }
                }, 50);
                break;
            case 'weiyun.com':  //微云
                var auto = setInterval(function () {
                    if ($('.face').length == 1 && $('#bottom_qlogin').css('display') === 'block') {
                        $('#switcher_plogin')[0].click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'cloud.tencent.com':  //腾讯云
            case 'qcloud.com':
                var auto = setInterval(function () {
                    if ($('.J-wxloginBox').css('display') === 'block') {
                        $('a[data-type="email"]')[0].click();
                        clearInterval(auto);
                    }
                }, 50);
                break;

            case 'exmail.qq.com':  //腾讯企业邮箱
                var auto = setInterval(function () {
                    if ($('.login_account_pwd_panel').css('display') === 'none') {
                        $('.js_show_pwd_panel')[0].click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'xiami.com':  //虾米音乐
                $('.modal-wrapper').bind('DOMNodeInserted', function (e) {
                    var auto = setInterval(function () {
                        if ($('.modal').hasClass('opened') && !$('.login').hasClass('current')) {
                            $('.login')[0].click();
                            clearInterval(auto);
                        }
                    }, 50);
                });
                break;
            case 'huya.com':  //虎牙直播
                var auto = setInterval(function () {
                    if ($('.account').hasClass('UDBSdkLgn-none')) {
                        $("img[src$='qrweb.png']").click();
                        $("img[src$='webqr.png']").on('click', function () {
                            clearInterval(auto);
                        })
                    }
                }, 50);
                break;
            case 'passport.58.com':  //58同城
                var auto = setInterval(function () {
                    if ($('#scanCode').hasClass('hide')) {
                        $('#pwdLogin').click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'baixing.com':  //百姓网
                var auto = setInterval(function () {
                    if ($('.login-window a[href="#appLogin"]').closest('li').hasClass('active')) {
                        $('.login-window a[href="#mobile"]')[0].click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
            case 'sl56.com':  //升蓝物流
                var auto = setInterval(function () {
                    if ($('#password').css('display') === 'none') {
                        $('#btnPassword').click();
                        clearInterval(auto);
                    }
                }, 50);
                break;
        }
    }

    function getStorageData() {
        return GM_getValue('NoQRCodeLoginData');
    }

    function setStorageData(value) {
        return GM_setValue('NoQRCodeLoginData', value);
    }

    function deleteStorageData() {
        GM.deleteValue("NoQRCodeLoginData");
    }

    //判断网址
    function matchURL(x) {
        return window.location.href.indexOf(x) != -1;
    }
})();