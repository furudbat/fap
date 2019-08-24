"use strict";

import $ from "jquery";

import { setupTextAreaEditorPreview, setupTextAreaWithNewEditor } from './fap/editor';
import { getExtOptions } from './fap/base';

var _initUploadEditor = function (options) {
    $(document).ready(function () {
        if(options.useNewEditor && options.useNewEditorUpload) {
            setupTextAreaWithNewEditor('#message',
                                'Type your description here!',
                                '.default-preview-text:first', null, '.user-preview-text:first');
        } else {
            $('#message').css('resize', 'vertical');
            //$('#message').css('min-height', '280px');

            $('#submit-finalize .submission-preview .bg2').css('font-size', '12px');
            $('#submit-finalize .submission-preview .user-preview-text').css('font-size', '14px');

            setupTextAreaEditorPreview('#message', '.user-preview-text:first', '.default-preview-text:first');
        }
    }); 
};

getExtOptions(['useNewEditor', 'useNewEditorUpload']).then(_initUploadEditor);