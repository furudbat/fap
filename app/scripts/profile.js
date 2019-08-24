"use strict";

import $ from "jquery";

import { getExtOptions } from './fap/base';
import { BASE_URL, faUserContentToData, getNewWatchButtonHTML, getNewUnwatchButtonHTML, getNewBlockButtonHTML, getNewUnblockButtonHTML, initButtonsUser } from './fap/fa';

var _initUserNav = function (user) {
    $(document).ready(function() {
        let username = $('#user-profile .userpage-flex-item .current img').attr('alt');

        var newWatchButton = getNewWatchButtonHTML(username);
        var newUnwatchButton = getNewUnwatchButtonHTML(username);
        var newBlockButton = getNewBlockButtonHTML(username);
        var newUnblockButton = getNewUnblockButtonHTML(username);

        $('#user-profile .userpage-flex-container .userpage-flex-item .floatright a').each( function (/*index*/) {
            let href = $(this).attr('href');
            let block_match = href.match('\/block\/' + username + '\/(.*)');
            let unblock_match = href.match('\/unblock\/' + username + '\/(.*)');
            //let newpm_match = href.match('\/newpm\/' + username + '\/(.*)');
            let unwatch_match = href.match('\/unwatch\/' + username + '\/(.*)');
            let watch_match = href.match('\/watch\/' + username + '\/(.*)');

            //if (newpm_match && newpm_match.length > 1) {
                //var newpm_href = newpm_match[0];

            //}

            if (watch_match && watch_match.length > 1) {
                //var watch_href = watch_match[0];

                $(this).replaceWith(newWatchButton);
            }
            
            if (unwatch_match && unwatch_match.length > 1) {
                //var unwatch_href = unwatch_match[0];

                $(this).replaceWith(newUnwatchButton);
            }

            if (unblock_match && unblock_match.length > 1) {
                //var unblock_href = unblock_match[0];

                $(this).replaceWith(newUnblockButton);
            }
            if (block_match && block_match.length > 1) {
                //var block_href = block_match[0];

                $(this).replaceWith(newBlockButton);
            }
        });
        
        initButtonsUser(user);
    });
};



var _initUserNavByHref = function (re_href) {
    let username_match = re_href.exec(window.location.href);
    if (username_match && username_match.length > 1) {
        let username = username_match[1];

        // fix url /user/username vs /user/username/
        if (username[username.length-1] === '/') {
            username = username.slice(0, -1);
        }

        if (username) {
            let user = faUserContentToData(BASE_URL + '/user/' + username, username, $('body').prop('outerHTML'));
            console.log(user);
            
            if (user) {
                _initUserNav(user);
            }
        }
    }
};

var _initUserNavs = function (options) {
    if (options.profileTweaks) {
        _initUserNavByHref(/\/user\/(.*)/g, true);
        _initUserNavByHref(/\/gallery\/(.*)/g);
        _initUserNavByHref(/\/scraps\/(.*)/g);
        _initUserNavByHref(/\/favorites\/(.*)/g);
        _initUserNavByHref(/\/journals\/(.*)/g);
        _initUserNavByHref(/\/commissions\/(.*)/g);
    }
};

getExtOptions(['profileTweaks']).then(_initUserNavs);