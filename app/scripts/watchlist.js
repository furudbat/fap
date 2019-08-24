"use strict";

import $ from "jquery";
import List from "list.js";

import { getExtOptions } from './fap/base';
import { BASE_URL } from './fap/fa';

var _initWatchlistWithPaging = function (options) {
    $(document).ready(async function() {
        if(options.watchlistWithPaging) {
            var userelements = [];

            $('.section-body').addClass('.container-fluid');
            $('.section-body.watch-list .watch-list-items.watch-row').each(function () {
                let link = $(this).find('a');
                let href = link.attr('href');
                let username_match = /\/user\/(.*)\//g.exec(href);

                if (username_match.length > 1) {
                    let username = username_match[1];
                    // fix url /user/username vs /user/username/
                    if (username[username.length-1] === '/') {
                        username = username.slice(0, -1);
                    }

                    let userurl = BASE_URL + '/user/' + username + '/';

                    userelements.push({
                        href: userurl,
                        username: username
                    });
                }
            });


            let item = '<div class="watch-list-items watch-row inline">' +
                            '~ <a class="watchlist_href watchlist_username" target="_blank"></a>' +
                        '</div>';

            let options = {
                valueNames: [ 
                    { data: ['username'] },
                    'watchlist_username',
                    { name: 'watchlist_href', attr: 'href' },
                ],
                item: item,
                page: 100,
                innerWindow: 5,
                pagination: true
            };
            
            let values = userelements.map(u => {
                return {
                    data: u,
                    username: u.username,
                    watchlist_href: u.href,
                    watchlist_username: u.username
                };
            });

            let newlist_html = '<div class="section-body watch-list" id="watch-list">' +
                    '<div class="watchlist-nav-bar watch-list-nav-bar">' +
                        '<input class="textbox search" placeholder="Search" />' +
                    '</div>' +
                    '<div class="list"></div>' +
                    '<div class="center center-block"><ul class="pagination"></ul></div>' +
                '</div>';
            $('.watch-list').attr('id', 'watch-list');
            $('#watch-list').replaceWith(newlist_html);

            var watchList = new List('watch-list', options, values);
        }
    });
};

getExtOptions(['watchlistWithPaging']).then(_initWatchlistWithPaging);