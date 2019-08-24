"use strict";

import $ from "jquery";

import { getExtOptions } from './fap/base';
import { BASE_URL, faSubmissionContentToData, getBlacklist, getNewWatchButtonHTML, getNewUnwatchButtonHTML, getNewFavButtonHTML, getNewUnfavButtonHTML, initButtonsUser, initButtonsFav, getFAUserData, isTagInBlacklist } from './fap/fa';

var _initSubmission = function (submission) {
    $(document).ready(async function () {

        var id = submission.id;

        var newFavButton = getNewFavButtonHTML(id);
        var newUnfavButton = getNewUnfavButtonHTML(id);

        let fav_a = $('#submission_page .sidebar-section .fav');
        if (!fav_a.length) {
            fav_a = $('#submission_page .sidebar-section .button-fav');
        }
        let href = $(fav_a).attr('href');
        let fav_match = (href)? href.match('\/fav\/' + id + '\/(.*)') : null;
        let isfav = fav_a.text().trim() === '+ Fav' || fav_a.text().trim() === '+ Favs';
        if (!isfav) {
            fav_a.addClass('unfav');
        }


        if (fav_match && fav_match.length > 1 && isfav) {
            //var fav_href = fav_match[0];

            $(fav_a).replaceWith(newFavButton);
        }
        if (fav_match && fav_match.length > 1 && !isfav) {
            //var fav_href = fav_match[0];

            $(fav_a).replaceWith(newUnfavButton);
        }

        initButtonsFav(submission);

        var blacklist = await getBlacklist('blacklist');

        if (blacklist) {
            $('#submission_page .submission-sidebar .tags-row .tags').each(function(){
                let tag = $(this).find('a').text();
                
                if (isTagInBlacklist(blacklist, tag)) {
                    $(this).addClass('blacklisted_tag');
                }
            });
        }

        let artist_element = $('#submission_page .submission-artist-container').clone();
        if ($('#submission_page .submission-sidebar .submission-artist-container').length === 0) {
            artist_element.insertBefore('#submission_page .submission-sidebar .sidebar-section:first');
        }

        artist_element.addClass('submission-sidebar-margin-top');
        $('#submission_page .submission-sidebar .sidebar-section-no-bottom').addClass('submission-sidebar-margin-buttom');

        artist_element.addClass('sidebar-section sidebar-section-block');

        let username = submission.artist.username;
        getFAUserData(username).then((user) => {
            var newWatchButton = '<div class="sidebar-section sidebar-section-flow-root">' + getNewWatchButtonHTML(username) + '</div>';
            var newUnwatchButton = '<div class="sidebar-section sidebar-section-flow-root">' + getNewUnwatchButtonHTML(username) + '</div>';

            if (user) {
                if (user.watch && user.watch.href) {
                    if ($('#submission_page .submission-sidebar .button-watch').length === 0) {
                        $(newWatchButton).insertAfter('#submission_page .submission-sidebar .submission-artist-container');
                    }
                }
                if (user.unwatch && user.unwatch.href) {
                    if ($('#submission_page .submission-sidebar .button-unwatch').length === 0) {
                        $(newUnwatchButton).insertAfter('#submission_page .submission-sidebar .submission-artist-container');
                    }
                }
            }

            initButtonsUser(user);
            $('#custom-userpage-button-watch-' + username).css('float', '');
            $('#custom-userpage-button-unwatch-' + username).css('float', '');
        });
    });
};

var _initSubmissionView = function() {
    let id_match = /\/view\/(.*)/g.exec(window.location.href);
    if (id_match && id_match.length > 1) {
        let id = id_match[1];

        // fix url /view/id vs /view/id/
        if (id[id.length-1] === '/') {
            id = id.slice(0, -1);
        }

        if (id) {
            let data = faSubmissionContentToData(BASE_URL + '/view/' + id, id, $('body').prop('outerHTML'));
            console.log(data);
            
            if (data) {
                _initSubmission(data);
            }
        }
    }
};

var _initView = function (options) {
    if (options.viewTweaks) {
        _initSubmissionView();
    }
};

getExtOptions(['viewTweaks']).then(_initView);