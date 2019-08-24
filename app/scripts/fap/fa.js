"use strict";

import $ from "jquery";
var moment = require('moment');

import { delay, getRandomInt, getExtOptions } from './base';

export const BASE_URL = 'https://www.furaffinity.net';



let _fetch_http = function (url, retry = false) {
    const requestInit = {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'default'
    };
    let request = new Request(url, requestInit);

    return fetch(request).then(async (response) => {
        if (response.ok) {
            return response.text();
        } else {
            if (response.status === 404) {
                return null;
            }

            if (response.status === 503) {
                if (!retry) {
                    return await delay(getRandomInt(100, 150)).then(async () => {
                        console.log('retry GET ', url);
                        return await _fetch_http(url, true);
                    });
                }
            }
        }

        return '';
    })
    .catch(function (error) {
        console.error('error GET ', url, error);
        return null;
    });
};

var _callRequestOK = function (url) {
    const requestInit = {
        method: 'GET',
        credentials: 'same-origin'
    };
    let request = new Request(url, requestInit);

    return fetch(request).then(async (response) => {
        return response.ok;
    })
    .catch(function (error) {
        console.error('error GET ', url, error);
        return null;
    });
};

let _getFAUserData = function (username) {
    const userurl = BASE_URL + '/user/' + username;
    return _fetch_http(userurl).then(data => {
        return faUserContentToData(userurl, username, data);
    });
};

export function faUserContentToData (url, username, data) {
    if (data) {
        let context = $('<div>' + data + '</div>');

        var block_href = null;
        var unblock_href = null;
        var newpm_href = null;
        var unwatch_href = null;
        var watch_href = null;

        let newusername = context.find('#user-profile .userpage-flex-item .current img').attr('alt');
        let name = context.find('#user-profile .userpage-flex-item.username h2 span').text();
        if (newusername) { // when username is not find in profile, keep old
            username = newusername;
        }

        var infos = {};
        context.find('#userpage-contact-item .table-row').each(function (/*index*/) {
            let row = $(this).clone();
            let label = row.find('.userpage-profile-question strong').text();
            row.find('.userpage-profile-question strong').replaceWith('');
            
            let value = '';
            if (label) {
                value = row.text().trim();
                infos[label] = value;
            }
        });


        context.find('#user-profile .userpage-flex-container .userpage-flex-item .floatright a').each(function (/*index*/) {
            let href = $(this).attr('href');
            let block_match = href.match('\/block\/' + username + '\/(.*)');
            let unblock_match = href.match('\/unblock\/' + username + '\/(.*)');
            let newpm_match = href.match('\/newpm\/' + username + '\/(.*)');
            let unwatch_match = href.match('\/unwatch\/' + username + '\/(.*)');
            let watch_match = href.match('\/watch\/' + username + '\/(.*)');

            if (block_match && block_match.length > 1) {
                block_href = block_match[0];
            }
            if (unblock_match && unblock_match.length > 1) {
                unblock_href = unblock_match[0];
            }
            if (newpm_match && newpm_match.length > 1) {
                newpm_href = newpm_match[0];
            }
            if (unwatch_match && unwatch_match.length > 1) {
                unwatch_href = unwatch_match[0];
            }
            if (watch_match && watch_match.length > 1) {
                watch_href = watch_match[0];
            }
        });

        if (!unwatch_href) {
            context.find('#standardpage .notice-message .section-body a').each(function (/*index*/) {
                let href = $(this).attr('href');
                let unwatch_match = href.match('\/unwatch\/' + username + '\/(.*)');

                if (unwatch_match && unwatch_match.length > 1) {
                    unwatch_href = unwatch_match[0];
                }
            });
        }

        let description = context.find('#page-userpage .userpage-layout-profile .userpage-layout-profile-container div').text();
        let error = context.find('.error-message-box .container-item-bot p').text();
        if (!error) {
            error = context.find('#standardpage .notice-message .section-body').text();
        }

        let deactivated_match = error.match('deactivated by the owner');
        let disabled_match = error.match('voluntarily disabled access to their account');

        let avatar_href = context.find('img.user-nav-avatar').attr('src');

        return {
            _href: url,
            username: username,
            name: name,
            infos: infos,
            description: description,
            avatar: {
                href: avatar_href,
            },
            block: {
                href: (block_href)? BASE_URL + block_href : null,
            },
            unblock: {
                href: (unblock_href)? BASE_URL + unblock_href : null,
            },
            newpm: {
                href: (newpm_href)? BASE_URL + newpm_href : null,
            },
            unwatch: {
                href: (unwatch_href)? BASE_URL + unwatch_href : null,
            },
            watch: {
                href: (watch_href)? BASE_URL + watch_href : null,
            },
            error: error,
            deactivated: deactivated_match && deactivated_match.length > 0,
            disabled: disabled_match && disabled_match.length > 0
        };
    }

    return null;
}


let _getFASubmissionData = function (id) {
    const viewurl = BASE_URL + '/view/' + id;
    return _fetch_http(viewurl).then(data => {
        return faSubmissionContentToData(viewurl, id, data);
    });
};

export function faSubmissionContentToData (url, id, data) {
    if (data) {
        let context = $('<div>' + data + '</div>');

        let img = context.find('#submission_page .submission-content #submissionImg');
        let img_title = img.attr('alt');
        let img_href_fullview = img.data('fullview-src');
        let img_href_preview = img.data('preview-src');
        let img_href = img.attr('src');

        let tags = [];
        let search_tags = {};
        context.find('#submission_page .tags-row .tags').each(function (/*index*/) {
            let link = $(this).find('a');
            let tag = link.text().toLowerCase();
            let href = link.attr('href');

            tags.push(tag);
            search_tags[tag] = BASE_URL + href;
        });


        let artist_link = context.find('#submission_page .submission-description .submission-artist-container a').first();
        let artist_profile_href = artist_link.attr('href');
        let artist_name = context.find('#submission_page .submission-description .submission-artist-container h2').text();
        let artist_img = context.find('#submission_page .submission-description .submission-artist-container img').attr('src');

        let username = '';
        let re_user_href = /\/user\/(.*)(\/)/g;
        let username_match = re_user_href.exec(artist_profile_href);
        if (username_match && username_match.length > 0) {
            username = username_match[1];
        }


        var infos = {};
        context.find('#submission_page .submission-sidebar .sidebar-section-no-bottom div').each(function (/*index*/) {
            let label = $(this).find('strong').text();
            let value = '';

            if (label) {
                $(this).find('strong').replaceWith('');
                value = $(this).text().trim();

                infos[label] = value;
            }
        });


        let title = context.find('#submission_page .submission-description .submission-description-container .submission-title h2').text();
        let description = context.find('#submission_page .submission-description .submission-description-container').text();

        let fav_href = context.find('#submission_page .submission-sidebar .fav').attr('href');
        if (!fav_href.length) {
            fav_href = context.find('#submission_page .submission-sidebar .button-fav').attr('href');
        }
        if (!fav_href.length) {
            fav_href = context.find('#submission_page .submission-sidebar .button.fav').attr('href');
        }
        let isfav = context.find('#submission_page .submission-sidebar .fav').text().trim() === '- Fav' || 
                    context.find('#submission_page .submission-sidebar .button-fav').text().trim() === '- Fav' || 
                    context.find('#submission_page .submission-sidebar .button.fav').text().trim() === '- Fav' || 
                    context.find('#submission_page .submission-sidebar .fav').text().trim() === '- Favs' || 
                    context.find('#submission_page .submission-sidebar .button-fav').text().trim() === '- Favs' ||
                    context.find('#submission_page .submission-sidebar .button.fav').text().trim() === '- Favs';
        let download_href = context.find('#submission_page .submission-sidebar .download-logged-in').attr('href');

        let general = context.find('.submission-artist-stats .general').text().trim() === 'General';
        let mature = context.find('.submission-artist-stats .mature').text().trim() === 'Mature';
        let adult = context.find('.submission-artist-stats .adult').text().trim() === 'Adult';

        // add extra tags
        if (mature) {
            tags.push('mature');
        }
        if (adult) {
            tags.push('adult');
        }
        tags.push(username);

        return {
            _href: url,
            id: id,
            title: title,
            description,
            download: {
                href: download_href,
            },
            fav: {
                href: (fav_href)? BASE_URL + fav_href : null,
                isfav: isfav,
            },
            artist: {
                username: username,
                href: (artist_profile_href)? BASE_URL + artist_profile_href : null,
                name: artist_name,
                img: artist_img
            },
            img: {
                href: (img_href)? BASE_URL + img_href : null,
                title: img_title,
                fullview: {
                    href: img_href_fullview
                },
                preview: {
                    href: img_href_preview
                }
            },
            infos: infos,
            tags: tags,
            search_tags: search_tags,
            general: general,
            mature: mature,
            adult: adult
        };
    }

    return null;
}




export function getFAUserData(username) {
    return _getFAUserData(username).then(result => {
        return result;
    }).catch((err) => {
        console.error(err);
        return null;
    });
}

export function getFASubmissionData(id) {
    return _getFASubmissionData(id).then(result => {
        return result;
    }).catch((err) => {
        console.error(err);
        return null;
    });
}



export function watchFAUser(user) {
    if (user && user.watch.href) {
        let href = user.watch.href;

        return _callRequestOK(href);
    }

    return new Promise(function (resolve) {
        resolve(false);
    });
}


export function unwatchFAUser(user) {
    if (user && user.unwatch.href) {
        let href = user.unwatch.href;

        return _callRequestOK(href);
    }

    return new Promise(function (resolve) {
        resolve(false);
    });
}


export function blockFAUser(user) {
    if (user && user.block.href) {
        let href = user.block.href;

        return _callRequestOK(href);
    }

    return new Promise(function (resolve) {
        resolve(false);
    });
}

export function unblockFAUser(user) {
    if (user && user.unblock.href) {
        let href = user.unblock.href;

        return _callRequestOK(href);
    }

    return new Promise(function (resolve) {
        resolve(false);
    });
}

export function favFASubmission(submission) {
    if (submission && submission.fav.href) {
        let href = submission.fav.href;

        return _callRequestOK(href);
    }

    return new Promise(function (resolve) {
        resolve(false);
    });
}

export function unfavFASubmission(submission) {
    if (submission && submission.fav.href) {
        let href = submission.fav.href;

        return _callRequestOK(href);
    }

    return new Promise(function (resolve) {
        resolve(false);
    });
}


export function isTagInBlacklist(blacklist, tag) {
    for (let black of blacklist) {
        let re = new RegExp(black, 'gi');
        if (tag && re.exec(tag)) {
            return true;
        }
    }

    return false;
}

export function isInBlacklist(blacklist, tags) {
    if (blacklist && tags) {
        for (let black of blacklist) {
            let re = new RegExp(black, 'gi');
            for (let tag of tags) {
                if (tag && re.exec(tag)) {
                    return true;
                }
            }
        }
    }

    return false;
}



export function initButtonsFav(submission) {
    if (!submission) {
        return;
    }

    var id = submission.id;

    var newFavButton = getNewFavButtonHTML(id);
    var newUnfavButton = getNewUnfavButtonHTML(id);

    if (submission.fav.href) {
        $('#custom-viewpage-button-unfav-' + id).unbind("click");
        $('#custom-viewpage-button-unfav-' + id).click(async function () {
            var button = $(this);
            button.prop("disabled", true);

            unfavFASubmission(submission).then(succ => {
                if (succ) {
                    return getFASubmissionData(id).then((newsubmission) => {
                        button.replaceWith(newFavButton);
                        initButtonsFav(newsubmission);
                    });
                }

                return new Promise(function (resolve) {
                    resolve(false);
                });
            }).then(() => {
                button.prop("disabled", false);
            });
        });

        $('#custom-viewpage-button-fav-' + id).unbind("click");
        $('#custom-viewpage-button-fav-' + id).click(async function () {
            var button = $(this);
            button.prop("disabled", true);

            favFASubmission(submission).then(succ => {
                if (succ) {
                    return getFASubmissionData(id).then((newsubmission) => {
                        button.replaceWith(newUnfavButton);
                        initButtonsFav(newsubmission);
                    });
                }
                
                return new Promise(function (resolve) {
                    resolve(false);
                });
            }).then(() => {
                button.prop("disabled", false);
            });
        });


        let myusername = getMyUsername();
        if (submission.artist.username === myusername) {
            $('#custom-viewpage-button-fav-' + id).prop('disabled', true);
            $('#custom-viewpage-button-unfav-' + id).prop('disabled', true);
        }
    }
}




export function initButtonsUser(user) {
    if (!user) {
        return;
    }

    var username = user.username;

    var newWatchButton = getNewWatchButtonHTML(username);
    var newUnwatchButton = getNewUnwatchButtonHTML(username);
    var newBlockButton = getNewBlockButtonHTML(username);
    var newUnblockButton = getNewUnblockButtonHTML(username);

    if (user.unwatch.href) {
        $('#custom-userpage-button-unwatch-' + username).unbind("click");
        $('#custom-userpage-button-unwatch-' + username).click(async function () {
            var button = $(this);

            button.prop("disabled", true);
            unwatchFAUser(user).then(async succ => {
                if (succ) {
                    return getFAUserData(username).then((newuser) => {
                        button.replaceWith(newWatchButton);
                        initButtonsUser(newuser);
                    });
                }

                return new Promise(function (resolve) {
                    resolve(false);
                });
            }).then(() => {
                button.prop("disabled", false);
            });
        });
    }
    if (user.watch.href) {
        $('#custom-userpage-button-watch-' + username).unbind("click");
        $('#custom-userpage-button-watch-' + username).click(async function () {
            var button = $(this);

            button.prop("disabled", true);
            watchFAUser(user).then(succ => {
                if (succ) {
                    return getFAUserData(username).then((newuser) => {
                        button.replaceWith(newUnwatchButton);
                        initButtonsUser(newuser);
                    });
                }

                return new Promise(function (resolve) {
                    resolve(false);
                });
            }).then(() => {
                button.prop("disabled", false);
            });
        });
    }


    if (user.unblock.href) {
        $('#custom-userpage-button-unblock-' + username).click(async function () {
            var button = $(this);

            button.prop("disabled", true);
            unblockFAUser(user).then(succ => {
                if (succ) {
                    return getFAUserData(username).then((newuser) => {
                        button.replaceWith(newBlockButton);
                        initButtonsUser(newuser);
                    });
                }

                return new Promise(function (resolve) {
                    resolve(false);
                });
            }).then(() => {
                button.prop("disabled", false);
            });
        });
    }
    if (user.block.href) {
        $('#custom-userpage-button-block-' + username).click(async function () {
            var button = $(this);

            button.prop("disabled", true);
            blockFAUser(user).then(succ => {
                if (succ) {
                    return getFAUserData(username).then((newuser) => {
                        button.replaceWith(newUnblockButton);
                        initButtonsUser(newuser);
                    });
                }

                return new Promise(function (resolve) {
                    resolve(false);
                });
            }).then(() => {
                button.prop("disabled", false);
            });
        });
    }
}

export function isBlacklistGeneralEnable() {
    return getExtOptions([
        'enableBlacklist', 
        'enableBlacklistGeneral'
    ]).then((options) => {
        return options.enableBlacklist && options.enableBlacklistGeneral;
    });
}
export function isBlacklistMatureEnable() {
    return getExtOptions([
        'enableBlacklist', 
        'enableBlacklistMature' 
    ]).then((options) => {
        return options.enableBlacklist && options.enableBlacklistMature;
    });
}
export function isBlacklistAdultEnable() {
    return getExtOptions([
        'enableBlacklist', 
        'enableBlacklistAdult'
    ]).then((options) => {
        return options.enableBlacklist && options.enableBlacklistAdult;
    });
}

export function getBlacklist() {
    return getExtOptions([
        'enableBlacklist', 
        'enableBlacklistGeneral', 'enableBlacklistMature', 'enableBlacklistAdult', 'enableBlacklistFetish', 
        'blacklistGeneral', 'blacklistMature', 'BlacklistAdult', 'blacklistFetish', 
    ]).then((options) => {
        let ret = [];

        if (options.enableBlacklist) {
            if (options.enableBlacklistGeneral) {
                if (options.enableBlacklistGeneral && options.enableBlacklistGeneral instanceof String) {
                    options.enableBlacklistGeneral = options.enableBlacklistGeneral.split('\n');
                }

                if (options.blacklistGeneral) {
                    ret.push(...options.blacklistGeneral);
                }
            }
            if (options.enableBlacklistMature) {
                if (options.blacklistMature && options.blacklistMature instanceof String) {
                    options.blacklistMature = options.blacklistMature.split('\n');
                }

                ret.push('mature');
                if (options.BlacklistMature) {
                    ret.push(...options.BlacklistMature);
                }
            }
            if (options.enableBlacklistAdult) {
                if (options.BlacklistAdult && options.BlacklistAdult instanceof String) {
                    options.BlacklistAdult = options.BlacklistAdult.split('\n');
                }

                ret.push('adult');
                if (options.BlacklistAdult) {
                    ret.push(...options.BlacklistAdult);
                }
            }
            if (options.enableBlacklistFetish) {
                if (options.blacklistFetish && options.blacklistFetish instanceof String) {
                    options.blacklistFetish = options.blacklistFetish.split('\n');
                }

                if (options.blacklistFetish) {
                    ret.push(...options.blacklistFetish);
                }
            }
        }
        
        return ret.filter(r => r.trim() !== '');
    });
}


export function getUserBlacklist() {
    return getExtOptions([
        'enableBlacklist', 
        'enableBlacklistUser', 
        'blacklistUser', 
    ]).then((options) => {
        let ret = [];

        if (options.enableBlacklist) {
            if (options.enableBlacklistUser) {
                if (options.blacklistUser && options.blacklistUser instanceof String) {
                    options.blacklistUser = options.blacklistUser.split('\n');
                }

                if (options.blacklistUser) {
                    ret.push(...options.blacklistUser);
                }
            }
        }
        
        return ret.filter(r => r.trim() !== '');
    });
}


export function getMyUsername () {
    var username = null;

    $('a[id="my-username"]').each(function (/*index*/) {
        let href = $(this).attr('href');

        let username_match = /\/user\/(.*)/.exec(href);
        if (username_match && username_match.length > 0) {
            username = username_match[1];
    
            // fix url /user/username vs /user/username/
            if (username[username.length-1] === '/') {
                username = username.slice(0, -1);
            }
    
            if (username) {
                return true;
            }
        }
    });

    return username;
}


export function getNewWatchButtonHTML(username) {
    return '<button id="custom-userpage-button-watch-' + username + '" class="button userpage-button button-watch hideonmobile">+Watch</button>';
}
export function getNewUnwatchButtonHTML(username) {
    return '<button id="custom-userpage-button-unwatch-' + username + '" class="button userpage-button button-unwatch hideonmobile">-Watch</button>';
}
export function getNewBlockButtonHTML(username) {
    return '<button id="custom-userpage-button-block-' + username + '" class="button userpage-button button-block hideonmobile">+Block</button>';
}
export function getNewUnblockButtonHTML(username) {
    return '<button id="custom-userpage-button-unblock-' + username + '" class="button userpage-button button-unblock hideonmobile">-Unblock</button>';
}

export function getNewFavButtonHTML(id) {
    return '<button id="custom-viewpage-button-fav-' + id + '" class="button fav button-fav">+ Fav</button>';
}
export function getNewUnfavButtonHTML(id) {
    return '<button id="custom-viewpage-button-unfav-' + id + '" class="button fav unfav button-unfav">- Fav</button>';
}


export function faNotesContentToData (data) {
    if (data) {
        let ret = [];
        let context = $('<div>' + data + '</div>');

        context.find('#notes-list .message-center-pms-note-list-view').each(function (/*index*/) {
            let msg_row = $(this);
            
            let input_item = msg_row.find('input[type="checkbox"]:first');
            let item_value = input_item.val();

            let subject = msg_row.find('a.notelinknote-read .note-list-subject').text();
            if (!subject) {
                subject = msg_row.find('a.notelinknote-unread .note-list-subject').text();
            }

            let read_link = msg_row.find('a.notelinknote-read');
            let read_href = read_link.attr('href');

            let unread_link = msg_row.find('a.notelinknote-unread');
            let unread_href = unread_link.attr('href');

            let sender_link = msg_row.find('.note-list-sender a');
            let sender_href = sender_link.attr('href');
            let sender_name = sender_link.text();

            let senddate_span = msg_row.find('.note-list-senddate span');
            let senddate_datestr = senddate_span.attr('title');
            let senddate_text = senddate_span.text();

            let msg = {
                item: {
                    input_html: input_item.prop('outerHTML'),
                    value: item_value,
                },
                subject: {
                    subject: subject,
                    href: (read_href)? BASE_URL + read_href : ((unread_href)? BASE_URL + unread_href : null),
                    read: (read_href)? true : ((unread_href)? false : null)
                },
                sender: {
                    href: (sender_href)? BASE_URL + sender_href : null,
                    name: sender_name
                },
                senddate: {
                    str: senddate_datestr,
                    isostr: moment(senddate_datestr, "MMM Do, YYYY, hh:mm A").toISOString(),
                    date: moment(senddate_datestr, "MMM Do, YYYY, hh:mm A").toDate(),
                    text: senddate_text
                }
            };

            ret.push(msg);
        });

        return ret;
    }

    return null;
}


export async function blacklistFigures(context) {
    return getExtOptions([
        'enableBlacklist', 
        'useBlacklistInTitles', 'disableBlacklistInSubmissions', 'disableBlacklistInBrowse', 'disableBlacklistInSearch', 'disableBlacklistInArtist',
        'enableHideGeneral', 'enableHideMature', 'enableHideAdult'
    ]).then((options) => {
        return blacklistFiguresWithOptions(options, context);
    });
}

export async function blacklistFiguresWithOptions(options, context) {
    let blacklist = await getBlacklist();
    let userBlacklist = await getUserBlacklist();
    let isGeneralBlacklisted = options.enableHideGeneral;
    let isMatureBlacklisted = options.enableHideMature;
    let isAdultBlacklisted = options.enableHideAdult;

    //var start = new Date().getTime();

    var pushToFigures = (fig) => {
        let id = fig.attr('id').replace('sid-', '');
        var username = '';
        var title = '';

        let links = fig.find('figcaption a');
        links.each(function (/*index*/) {
            let href = $(this).attr('href');

            let username_match = /\/user\/(.*)/.exec(href);
            if (username_match && username_match.length > 1) {
                username = username_match[1];
        
                // fix url /user/username vs /user/username/
                if (username[username.length-1] === '/') {
                    username = username.slice(0, -1);
                }
            }

            let view_match = /\/view\/(.*)/.exec(href);
            if (view_match && view_match.length > 1) {
                title = $(this).attr('title');
            }
        });

        let tags = [
            'u-' + username,
            's-' + id
        ];
        if (options.useBlacklistInTitles) {
            tags.push(title);
        }

        figures.push({
            fig: fig, 
            id: id,
            general: fig.hasClass('r-general') || fig.is('.r-general'),
            mature: fig.hasClass('r-mature') || fig.is('.r-mature'),
            adult: fig.hasClass('r-adult') || fig.is('.r-adult'),
            hide: fig.css('display') === 'none',
            username: username,
            title: title,
            tags: tags
        });
    };

    var hideFigure = function (figure) {
        let id = figure.id;
        let fig = figure.fig;

        if(id && !figure.hide) {
            fig.css('display', 'none');
            figure.hide = true;
            console.log('hide ' + BASE_URL + '/view/' + id);
        }

        return figure;
    };

    var showFigure = function (figure) {
        let id = figure.id;
        let fig = figure.fig;

        if(id && figure.hide) {
            fig.css('display', 'inline-block');
            figure.hide = false;
            console.log('show ' + BASE_URL + '/view/' + id);
        }

        return figure;
    };

    var figures = [];  
    var promises = [];

    if (!options.disableBlacklistInBrowse) {
        // front page
        context.find('#gallery-frontpage-submissions figure').each(function (/*index*/) {
            pushToFigures($(this));
        });
        // search
        context.find('#browse-search figure').each(function (/*index*/) {
            pushToFigures($(this));
        });
        // browse page
        context.find('#gallery-browse figure').each(function (/*index*/) {
            pushToFigures($(this));
        });
    }

    if (!options.disableBlacklistInSubmissions) {
        // submissions
        context.find('#messagecenter-submissions figure').each(function (/*index*/) {
            pushToFigures($(this));
        });
        context.find('#messagecenter-new-submissions figure').each(function (/*index*/) {
            pushToFigures($(this));
        });
    }

    // artist gallery/fav
    if (!options.disableBlacklistInArtist) {
        context.find('#page-galleryscraps figure').each(function (/*index*/) {
            pushToFigures($(this));
        });
        context.find('#gallery-favorites figure').each(function (/*index*/) {
            pushToFigures($(this));
        });
        context.find('#gallery-latest-submissions figure').each(function (/*index*/) {
            pushToFigures($(this));
        });
    }

    for (let figure of figures) {
        if (figure) {
            let p = new Promise((resolve) => {
                let blacklisted = false;
                if (isGeneralBlacklisted && figure.general) {
                    figure = hideFigure(figure);
                    blacklisted = true;
                }
                if (isMatureBlacklisted && figure.mature) {
                    figure = hideFigure(figure);
                    blacklisted = true;
                }
                if (isAdultBlacklisted && figure.adult) {
                    figure = hideFigure(figure);
                    blacklisted = true;
                }
                if (figure.username && isTagInBlacklist(userBlacklist, figure.username)) {
                    figure = hideFigure(figure);
                    blacklisted = true;
                }
                if (isInBlacklist(blacklist, figure.tags)) {
                    figure = hideFigure(figure);
                    blacklisted = true;
                }

                if (!blacklisted && figure.hide) {
                    figure = showFigure(figure);
                    blacklisted = false;
                }

                resolve();
            });
            promises.push(p);
        }
    }
}