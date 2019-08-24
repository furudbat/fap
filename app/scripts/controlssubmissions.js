"use strict";

import $ from "jquery";

import { setupTextAreaWithPreview, setupTextAreaWithNewEditor } from './fap/editor';
import { getExtOptions } from './fap/base';

var _initNewSubmissionEditEditor = function (options) {
    $(document).ready(function () {
        $('.section-footer').clone().insertAfter('#JSMessage');

        if(options.useNewEditor && options.useNewEditorUpload) {
            setupTextAreaWithNewEditor('#JSMessage', 
                'Type your Submission-Description here!', 
                null, '.bbcodeformat.hand', null);
        } else {
            $('#JSMessage').css('resize', 'vertical');
            $('#JSMessage').css('min-height', '280px');

            if (options.defaultEditorPreview) {
                setupTextAreaWithPreview('#JSMessage');
                //$('#JSMessage').css('max-height', '260px');
            }
        }
    }); 
};


getExtOptions(['defaultEditorPreview', 'useNewEditor', 'useNewEditorUpload']).then(_initNewSubmissionEditEditor);