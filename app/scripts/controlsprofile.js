"use strict";

import $ from "jquery";

import { setupTextAreaWithPreview, setupTextAreaWithNewEditor } from './fap/editor';
import { getExtOptions } from './fap/base';

var _initNewProfileEditEditor = function (options) {
    $(document).ready(function () {
        $('input[value="Update Profile Information"]').clone().insertAfter($('textarea[name="profileinfo"]'));

        if(options.useNewEditor && options.useNewEditorEditProfile) {
            setupTextAreaWithNewEditor('textarea[name="profileinfo"]', 
                'Type your Profile-Info here!', 
                null, '.bbcodeformat.hand', null);
        } else {
            //$('textarea[name="profileinfo"]').css('resize', 'vertical');
            $('textarea[name="profileinfo"]').css('min-height', '280px');

            if (options.defaultEditorPreview) {
                setupTextAreaWithPreview('textarea[name="profileinfo"]');
                //$('#fap-default-preview-text').css('max-height', '260px');
            }
        }
    }); 
};


getExtOptions(['defaultEditorPreview', 'useNewEditor', 'useNewEditorEditProfile']).then(_initNewProfileEditEditor);