"use strict";

import $ from "jquery";
import List from "list.js";

import { setupTextAreaWithPreview, setupTextAreaWithNewEditor } from './fap/editor';
import { faNotesContentToData } from './fap/fa';
import { getExtOptions } from './fap/base';

var _initNewNotesEditor = function (options) {
    $(document).ready(function () {
        if($('#JSMessage_blank').length) {
            if(options.useNewEditor && options.useNewEditorNotes) {
                $('.section-body .floatleft').css('display', 'none');

                setupTextAreaWithNewEditor('#JSMessage_blank', 
                            'Type your note here!', 
                            null, '.bbcodeformat.hand', null);
            } else {
                $('#JSMessage_blank').css('resize', 'vertical');
                //$('#JSMessage_blank').css('min-height', '280px');

                if (options.defaultEditorPreview) {
                    setupTextAreaWithPreview('#JSMessage_blank');
                }
            }
        }


        if($('#JSMessage_reply').length) {
            if(options.useNewEditor && options.useNewEditorNotes) {
                $('.section-body .noteresponsespacer').css('display', 'none');
                
                setupTextAreaWithNewEditor('#JSMessage_reply', 
                            'Type your note here!', 
                            null, '.bbcodeformat.hand', null);
            } else {
                $('#JSMessage_reply').css('resize', 'vertical');
                //$('#JSMessage_reply').css('min-height', '280px');

                
                if (options.defaultEditorPreview) {
                    setupTextAreaWithPreview('#JSMessage_reply');
                }
            }
        }
    }); 
};

var _initNewNotesTable = function (options) {
    $(document).ready(function () {
        if(options.useNewNotesList) {
            let notes = faNotesContentToData($('body').prop('outerHTML'));

            let currentNote = null;
            let currentNote_match = /\/msg\/pms\/(\d+)\/(\d+)/.exec(window.location.href);
            if (currentNote_match && currentNote_match.length > 2) {
                currentNote = currentNote_match[2];
        
                // fix url /user/username vs /user/username/
                if (currentNote[currentNote.length-1] === '/') {
                    currentNote = currentNote.slice(0, -1);
                }
            }

            let item = '<div class="message-center-pms-note-list-view">' +
                '<div class="note-list-container">' +
                    '<div class="note-list-selectgroup">' +
                        '<div class="note-list-checkbox-desktop notelist_checkbox">' +
                        '</div>' +
                    '</div>' +
                    '<div class="note-list-subjectgroup">' +
                        '<div class="note-list-checkbox-mobile-tablet notelist_checkbox">' +
                        '</div>' +
                        '<div class="link-override-no-icon note-list-subject-container">' +
                            '<a class="notelinknote-read read">' +
                                '<div class="note-list-subject notelist_subject"></div>' +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                    '<div class="note-list-sendgroup">' +
                        '<div class="link-override-no-icon note-list-sender-container">' +
                            '<div class="note-list-sender">' +
                                '<strong class="link-override-no-icon">~<a class="notelist_sender_href notelist_sender"></a></strong>' +
                            '</div>' +
                        '</div>' +
                        '<div class="link-override-no-icon note-list-senddate">' +
                            '<span class="popup_date notelist_senddate notelist_senddate_title notelist_senddate_iso"></span>' +        
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

            let options = {
                valueNames: [ 
                    { data: ['id', 'sender', 'senddate', 'subject', 'isread'] },
                    'notelist_checkbox',
                    { name: 'read', attr: 'href' },
                    'notelist_subject',
                    'notelist_sender',
                    { name: 'notelist_sender_href', attr: 'href' },
                    'notelist_senddate',
                    { name: 'notelist_senddate_title', attr: 'title' },
                    { name: 'notelist_senddate_iso', attr: 'data-date'}
                ],
                item: item,
                listClass: 'message-center-pms-list'
            };
            
            let values = notes.map(n => {
                return {
                    data: n,
                    id: n.item.value,
                    sender: n.sender.name,
                    senddate: n.senddate.isostr,
                    subject: n.subject.subject.trim(),
                    notelist_checkbox: n.item.input_html,
                    read: n.subject.href,
                    isread: n.subject.read,
                    notelist_subject: n.subject.subject,
                    notelist_sender_href: n.sender.href,
                    notelist_sender: n.sender.name,
                    notelist_senddate_title: n.senddate.str,
                    notelist_senddate_iso: n.senddate.isostr,
                    notelist_senddate: n.senddate.text
                };
            });

            let newlist_html = '<div id="notes-list">' +
                    '<div class="messagecenter-mail-nav-bar notes-list-messagecenter-mail-nav-bar">' +
                        '<input class="textbox search" placeholder="Search" />' +
                        '<span class="button button-small sort" data-sort="notelist_subject">Sort by Subject</span>' +
                        '<span class="button button-small sort" data-sort="notelist_sender">Sort by Sender</span>' +
                        '<span class="button button-small sort" data-sort="notelist_senddate_iso">Sort by Date</span>' +
                    '</div>' +
                    '<div class="messagecenter-mail-list-pane"><div class="message-center-pms-list"></div></div>' +
                '</div>';
            $('#notes-list').replaceWith(newlist_html);
            var notesList = new List('notes-list', options, values);

            $('.messagecenter-mail-list-pane .aligncenter').insertAfter('#notes-list .messagecenter-mail-list-pane');
            $('#pms-form div.messagecenter-mail-list-pane:first').removeClass('messagecenter-mail-list-pane');

            $('#notes-list .message-center-pms-list .message-center-pms-note-list-view').each(function (/*index*/) {
                let id = String($(this).data('id'));
                if (currentNote === id) {
                    $(this).addClass('selected-view');
                } else {
                    $(this).removeClass('selected-view');
                }
            });


            $('.message-center-pms-note-list-view').each(function (/*index*/) {
                let id = $(this).data('id');
                let isread = $(this).data('isread');
                let subject = $(this).data('subject');

                if (!isread) {
                    $(this).find('.notelinknote-read')
                        .addClass('notelinknote-unread')
                        .removeClass('notelinknote-read')
                        .addClass('unread')
                        .removeClass('read');
                    $(this).find('.note-list-subject').html(((!isread)? '<img class="unread" alt="unread" src="/themes/beta/img/icons/pms-unread.png">' : '') + subject);
                } else {
                    $(this).find('.notelinknote-unread')
                        .addClass('notelinknote-read')
                        .removeClass('notelinknote-unread')
                        .addClass('read')
                        .removeClass('unread');
                    $(this).find('.note-list-subject').html(subject);
                }
            });

            $('.notelist_checkbox input[type="checkbox"]').each(function (/*index*/) {
                $(this).change(function () {
                    let id = $(this).val();
                    let ischecked = $(this).is(":checked");

                    if (ischecked) {
                        $('.message-center-pms-note-list-view[data-id="' + id + '"]').addClass('checked');
                    } else {
                        $('.message-center-pms-note-list-view[data-id="' + id + '"]').removeClass('checked');
                    }
                });
            });
        }
    });
}

getExtOptions(['defaultEditorPreview', 'useNewEditor', 'useNewEditorNotes']).then(_initNewNotesEditor);
getExtOptions(['useNewNotesList']).then(_initNewNotesTable);




