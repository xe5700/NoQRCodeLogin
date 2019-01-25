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

    //12306
    if (matchURL("kyfw.12306.cn")) {
        var auto = setInterval(function () {
            if ($('#J-login-code-loading').css('display') === 'none' && $('.login-hd-code').hasClass('active')) {
                $('.login-hd-account a')[0].click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //淘宝
    if (matchURL("login.taobao.com")) {
        var auto = setInterval(function () {
            if ($('#J_StaticForm').css('display') === 'none') {
                $('#J_Quick2Static').click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //京东
    if (matchURL("passport.jd.com")) {
        var auto = setInterval(function () {
            if ($('.login-box').css('display') === 'none') {
                $('.login-tab-r').click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //百度
    if (matchURL("baidu.com")) {
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
        return;
    }

    //豆瓣
    if (matchURL("douban.com")) {
        var auto = setInterval(function () {
            if ($('.account-tab-phone').hasClass('on')) {
                $('.account-tab-account')[0].click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //苏宁
    if (matchURL("passport.suning.com")) {
        var auto = setInterval(function () {
            if ($('.pc-login').css('display') === 'none') {
                $('.tab-item')[1].click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //知乎
    if (matchURL("zhihu.com")) {
        var loginDiv = $('.Login-content');
        var auto = setInterval(function () {
            if (loginDiv.length == 0) {
                $('.SignContainer-switch').children("span").click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //支付宝
    if (matchURL("alipay.com")) {
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
    }

    //QQ
    if (matchURL('xui.ptlogin2.qq.com') || matchURL('ssl.xui.ptlogin2.qq.com') || matchURL('ui.ptlogin2.qq.com')) {
        if (matchURL('web2.qq.com')) {
            return;
        }
        var auto = setInterval(function () {
            if ($('.onekey_logo').length == 1 || $('.face').length == 1) {
                $('#switcher_plogin')[0].click();
                $('#switcher_qlogin').on('click', function () {
                    clearInterval(auto);
                })
            }
        }, 50);
        return;
    }

    //微云
    if (matchURL("weiyun.com")) {
        var auto = setInterval(function () {
            if ($('.face').length == 1 && $('#bottom_qlogin').css('display') === 'block') {
                $('#switcher_plogin')[0].click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //腾讯企业邮箱
    if (matchURL("exmail.qq.com")) {
        var auto = setInterval(function () {
            if ($('.login_account_pwd_panel').css('display') === 'none') {
                $('.js_show_pwd_panel')[0].click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //腾讯云
    if (matchURL("cloud.tencent.com") || matchURL("qcloud.com")) {
        var auto = setInterval(function () {
            if ($('.J-wxloginBox').css('display') === 'block') {
                $('a[data-type="email"]')[0].click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //虾米
    if (matchURL("xiami.com")) {
        $('.modal-wrapper').bind('DOMNodeInserted', function (e) {
            var auto = setInterval(function () {
                if ($('.modal').hasClass('opened') && !$('.login').hasClass('current')) {
                    $('.login')[0].click();
                    clearInterval(auto);
                }
            }, 50);
            return;
        });
    }

    //虎牙
    if (matchURL("huya.com")) {
        var auto = setInterval(function () {
            if ($('.account').hasClass('UDBSdkLgn-none')) {
                $("img[src$='qrweb.png']").click();
                $("img[src$='webqr.png']").on('click', function () {
                    clearInterval(auto);
                })
            }
        }, 50);
        return;
    }

    //58同城
    if (matchURL("passport.58.com")) {
        var auto = setInterval(function () {
            if ($('#scanCode').hasClass('hide')) {
                $('#pwdLogin').click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //百姓网
    if (matchURL("baixing.com")) {
        var auto = setInterval(function () {
            if ($('.login-window a[href="#appLogin"]').closest('li').hasClass('active')) {
                $('.login-window a[href="#mobile"]')[0].click();
                clearInterval(auto);
            }
        }, 50);
        return;
    }

    //升蓝物流
    if (matchURL("sl56.com")) {
        var auto = setInterval(function () {
            if ($('#password').css('display') === 'none') {
                $('#btnPassword').click();
                clearInterval(auto);
            }
        }, 50);
        return;
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