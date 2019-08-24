"use strict";

import $ from "jquery";

import { setupTextAreaWithPreview, setupTextAreaWithNewEditor } from './fap/editor';
import { getExtOptions } from './fap/base';

var _initNewJournalEditor = function (options) {
    $(document).ready(function() {
        if(options.useNewEditor && options.useNewEditorJournal) {
            $('.section-body .floatleft').css('display', 'none');

            setupTextAreaWithNewEditor('#JSMessage', 
                'Type your journal here!', 
                null, '.bbcodeformat.hand', null,
                {
                    removeProviders: [ 'dailymotion', 'spotify', 'vimeo', 'instagram', 'twitter', 'googleMaps', 'flickr', 'facebook' ]
                });
        } else {
            $('#JSMessage').css('resize', 'vertical');
            $('#JSMessage').css('min-height', '250px');

            if (options.defaultEditorPreview) {
                setupTextAreaWithPreview('#JSMessage');
            }
        }
    }); 
};


getExtOptions(['defaultEditorPreview', 'useNewEditor', 'useNewEditorJournal']).then(_initNewJournalEditor);