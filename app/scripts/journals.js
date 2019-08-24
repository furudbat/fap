"use strict";

import $ from "jquery";

import { getExtOptions } from './fap/base';
import { BASE_URL, getMyUsername } from './fap/fa';

var _initUserJournalsList = function (username) {
    $(document).ready(function() {
        $('#pageid-journals-list .content section').each(function (/*index*/){
            let jid = $(this).attr('id');
            let id = jid.replace('jid:', '');
            let journal_href = BASE_URL + '/journal/' + id;

            let title = $(this).find('.section-body h2:first').text();
            let journal_title_html = '<a href="' + journal_href +  '">' + title + '</a>';
            if (username === getMyUsername()) {
                let journal_edit_href = '/controls/journal/1/' + id;
                let journal_edit_button_html = '<a href="' + journal_edit_href + '" class="owner_edit_journal action-link">[Edit]</a>'
                journal_title_html = journal_title_html + ' ' + journal_edit_button_html;
            }

            $(this).find('.section-body h2:first').html(journal_title_html);
        });
    });
};



var _initUserJournals = function (options) {
    if (options.profileTweaks) {
        let username_match = /\/journals\/(.*)[\/]?(.*)/g.exec(window.location.href);
        if (username_match && username_match.length > 1) {
            let username = username_match[1];

            // fix url /journals/username vs /journals/username/
            if (username[username.length-1] === '/') {
                username = username.slice(0, -1);
            } else {
                let username_match = /\/journals\/(.*)\/(.*)/g.exec(window.location.href);
                if (username_match && username_match.length > 1) {
                    username = username_match[1];
                }
            }

            _initUserJournalsList(username);
        }
    }
};


getExtOptions(['profileTweaks']).then(_initUserJournals);