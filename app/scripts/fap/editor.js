"use strict";

import $ from "jquery";

import {
    bbcode_to_html,
    //html_to_bbcode
} from './bbcode';

export const USE_NEW_EDITOR = false;
//if (USE_NEW_EDITOR) {
    //import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//}
import Tooltip from 'tooltip.js';


export function setupTextAreaEditorPreview(textarea_query,
    user_preview_text = null,
    default_preview_query = null,
    editor = null) {
    if (user_preview_text) {
        if (!editor) {
            $(textarea_query).change(function () {
                let bbcodedata = $(this).val();
                let htmldata = bbcode_to_html($(this).val());
                if (USE_NEW_EDITOR && editor) {
                    bbcodedata = editor.getData();
                    htmldata = bbcode_to_html(bbcodedata);
                    //$(textarea_query).text(bbcodedata);
                    //console.log("Editor Data: ", editor.getData());
                }

                //console.log(preview_content);

                if (user_preview_text) {
                    $(user_preview_text).html(htmldata);
                }
                if (default_preview_query) {
                    if (htmldata) {
                        $(default_preview_query).css('display', 'none');
                    } else {
                        $(default_preview_query).css('display', 'none');
                    }
                }
            });
        }

        let bbcodedata = $(textarea_query).val();
        let htmldata = bbcode_to_html($(textarea_query).val());
        if (USE_NEW_EDITOR && editor) {
            bbcodedata = editor.getData();
            htmldata = bbcode_to_html(bbcodedata);
            //$(textarea_query).text(bbcodedata);
            //console.log("Editor Data: ", editor.getData());
        }

        //console.log(preview_content);

        if (user_preview_text) {
            $(user_preview_text).html(htmldata);
        }
        if (default_preview_query) {
            if (htmldata) {
                $(default_preview_query).css('display', 'none');
            } else {
                $(default_preview_query).css('display', 'none');
            }
        }

        /*
        return setInterval(function () {
            let bbcodedata = $(textarea_query).val();
            let htmldata = bbcode_to_html($(textarea_query).val());
            if (USE_NEW_EDITOR && editor) {
                bbcodedata = editor.getData();
                htmldata = bbcode_to_html(bbcodedata);
                //$(textarea_query).text(bbcodedata);
                //console.log("Editor Data: ", editor.getData());
            }

            //console.log(preview_content);

            if (user_preview_text) {
                $(user_preview_text).html(htmldata);
            }
            if (default_preview_query) {
                if (htmldata) {
                    $(default_preview_query).css('display', 'none');
                } else {
                    $(default_preview_query).css('display', 'none');
                }
            }
        }, 200);
        */
       return null;
    } else {
        /*
        return setInterval(function () {
            let bbcodedata = $(textarea_query).val();
            let htmldata = bbcode_to_html($(textarea_query).val());
            if (USE_NEW_EDITOR && editor) {
                bbcodedata = editor.getData();
                htmldata = bbcode_to_html(bbcodedata);
                //$(textarea_query).text(bbcodedata);
                //console.log("Editor Data: ", editor.getData());
            }
        }, 200);
        */
       return null;
    }
}

export function setupTextAreaWithNewEditor(textarea_query,
    placeholder = null,
    default_preview_query = null,
    default_bbcodeformat_buttons_query = null,
    user_preview_text = null,
    mediaEmbed = null,
    toolbar = null) {

    $(textarea_query).css('resize', 'vertical');
    $(textarea_query).css('min-height', '240px');
    if (default_bbcodeformat_buttons_query) {
        $(default_bbcodeformat_buttons_query).css('display', 'none');
    }

    var config = {};
    if (!toolbar) {
        toolbar = [
            'heading',
            '|', 'bold', 'italic', 'underline', 'strikethrough',
            '|', 'fontColor', 'alignment',
            '|', 'subscript', 'superscript', 'blockQuote',
            '|', 'link'
        ];

        if (mediaEmbed) {
            toolbar = toolbar.concat(['|', 'mediaEmbed']);
        }

        toolbar = toolbar.concat(['|', 'undo', 'redo']);

        config.toolbar = toolbar;
    }
    if (placeholder) {
        config.placeholder = placeholder;
    }
    if (mediaEmbed) {
        config.mediaEmbed = mediaEmbed;
    }


    console.log("Original Data:", $(textarea_query).val());

    if (document.querySelector(textarea_query)) {
        var toggleCKEditorEditor = function (textarea_query, config) {
            if (!USE_NEW_EDITOR) {
                return new Promise((resolve) => {
                    //console.log("CKEditor ClassicEditor Feature: ", Array.from( editor.ui.componentFactory.names() ));
                    //console.log("CKEditor Data: ", editor.getData());

                    let timer = setupTextAreaEditorPreview(textarea_query, user_preview_text, default_preview_query, null);
                    resolve({
                        editor: null,
                        timer: timer
                    });
                })
                .then(result => {
                    let editor = result.editor;
                    let timer = result.timer;

                    $('#fap-btn-toggle-editor').text('Normal Editor');
                    $('#fap-btn-toggle-editor').unbind("click");
                    $('#fap-btn-toggle-editor').click(() => {
                        toggleNormalEditor(textarea_query, config, editor, timer);
                    });
                })
            }

            ClassicEditor
                .create(document.querySelector(textarea_query), config)
                .then(editor => {
                    //console.log("CKEditor ClassicEditor Feature: ", Array.from( editor.ui.componentFactory.names() ));
                    //console.log("CKEditor Data: ", editor.getData());

                    let timer = setupTextAreaEditorPreview(textarea_query, user_preview_text, default_preview_query, editor);
                    return {
                        editor: editor,
                        timer: timer
                    };
                })
                .then(result => {
                    let editor = result.editor;
                    let timer = result.timer;

                    $('#fap-btn-toggle-editor').text('Normal Editor');
                    $('#fap-btn-toggle-editor').unbind("click");
                    $('#fap-btn-toggle-editor').click(() => {
                        toggleNormalEditor(textarea_query, config, editor, timer);
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        };
        var toggleNormalEditor = function (textarea_query, config, editor, timer) {
            clearTimeout(timer);

            if (USE_NEW_EDITOR && editor) {
                editor.destroy()
                    .catch(error => {
                        console.error(error);
                    });
            }

            $('#fap-btn-toggle-editor').text('CKEditor Editor');
            $('#fap-btn-toggle-editor').unbind("click");
            $('#fap-btn-toggle-editor').click(() => {
                toggleCKEditorEditor(textarea_query, config);
            });
        };

        /// is someone listen to button and not the submit-button id o.0 ... if I click A button -> submit ???
        $('<p><span class="button mobile-button fap-btn-toggle-editor" id="fap-btn-toggle-editor">Normal Editor</span></p>').insertBefore(textarea_query);
        toggleCKEditorEditor(textarea_query, config);
    }
}

export function setupTextAreaWithPreview(textarea_query,
    user_preview_text = null,
    default_preview_query = null) {

    if (!user_preview_text) {
        user_preview_text = '#fap-default-preview-text';

        var previewHTML = '<div id="fap-default-preview-text" class="fap-default-preview-text default-preview-text"></div>';
        var previewToggleButtonHTML = '<div>' +
            '<span class="button mobile-button fap-btn-toggle-editor-preview" id="fap-btn-toggle-editor-preview">Preview</span>' +
            '<span class="button mobile-button fap-btn-toggle-editor-preview-help" id="fap-btn-toggle-editor-preview-help">Help</span>' +
            '</div>';

        $(previewHTML).insertAfter(textarea_query);
        $(previewToggleButtonHTML).insertBefore(textarea_query);
    }

    if ($('#fap-btn-toggle-editor-preview-help').length > 0) {
        const preview_help_tooltip = new Tooltip(document.querySelector('#fap-btn-toggle-editor-preview-help'), {
            placement: 'right',
            html: true,
            title: getPreviewHelpTooltipContent(),
            trigger: "click",
        });
        //preview_help_tooltip.show();
    }

    var toggleNormalEditor = function (textarea_query) {
        $('#fap-default-preview-text').css('display', 'none');
        $(textarea_query).css('display', 'block');

        $('#fap-btn-toggle-editor-preview').text('Preview');
        $('#fap-btn-toggle-editor-preview').unbind("click");
        $('#fap-btn-toggle-editor-preview').click(() => {
            togglePreview(textarea_query);
        });
    };
    var togglePreview = function (textarea_query) {
        $('#fap-default-preview-text').css('display', 'block');
        $(textarea_query).css('display', 'none');

        $('#fap-btn-toggle-editor-preview').text('Write');
        $('#fap-btn-toggle-editor-preview').unbind("click");
        $('#fap-btn-toggle-editor-preview').click(() => {
            toggleNormalEditor(textarea_query);
        });
    };

    toggleNormalEditor(textarea_query);
    setupTextAreaEditorPreview(textarea_query, user_preview_text, default_preview_query);
}


export function getPreviewHelpTooltipContent() {
    // https://www.browserling.com/tools/markdown-to-html
    // https://www.buildmystring.com/build.php

    return "<p><code>[h1]Header 1[/h1]</code> -> <h1 class=\"bbcode bbcode_h1\">Header 1</h1> <br />" +
        "<code>[h2]Header 2[/h2]</code> -> <h2 class=\"bbcode bbcode_h2\">Header 2</h2> <br />" +
        "<code>[h3]Header 3[/h3]</code> -> <h3 class=\"bbcode bbcode_h3\">Header 3</h3> <br />" +
        "<code>[h4]Header 4[/h4]</code> -> <h4 class=\"bbcode bbcode_h4\">Header 4</h4> <br />" +
        "<code>[h5]Header 4[/h5]</code> -> <h5 class=\"bbcode bbcode_h5\">Header 5</h5>  </p>" +
        "<h2 id=\"basics\">Basics</h2>" +
        "<p>" + 
        "<code>[b]bold text[/b]</code> -> <strong class=\"bbcode bbcode_b\">bold</strong> text <br />" +
        "<code>[i]italic text[/i]</code> -> <i class=\"bbcode bbcode_i\">italic</i> text <br />" +
        "<code>[u]underlined text[/u]</code> -> <u class=\"bbcode bbcode_u\">underlined</u> text <br />" +
        "<code>[s]striked out text[/s]</code> -> <s class=\"bbcode bbcode_s\">striked out</s> text <br />" +
        "<code>Text [sup]supscripted[/sup]</code> -> Text <sup class=\"bbcode bbcode_sup\">supscripted</sup> <br />" +
        "<code>Text [sub]subscrupted[/sub]</code> -> Text <sub class=\"bbcode bbcode_sub\">subscripted</sub> <br />" +
        "<code>[color=green]text[/color]</code> -> This is <span class=\"bbcode\" style=\"color: green;\">green</span> <br />" +
        "<code>[color=#FF0000]text[/color]</code> -> This is <span class=\"bbcode\" style=\"color: #FF0000;\">red</span>" +
        "</p>" +
        "<h2 id=\"blocks\">Blocks</h2>" +
        "<h3 id=\"quotes\">Quotes</h3>" +
        "<p><code>[quote]text[/quote]</code>: </p>" +
        "<div class=\"bbcode bbcode_quote\">Unnamed" +
        "Multiline <br>" +
        "Quote <br>" +
        "</div>" +
        "<p><code>[quote=name]text[/quote]</code>:  </p>" +
        "<div class=\"bbcode bbcode_quote\"><span class=\"bbcode_quote_name\">fafaq wrote:</span>Not an awful lot in his journal recently...</div>" +
        "<h3 id=\"alignment\">Alignment</h3>" +
        "<div class=\"bbcode bbcode_left\"><code>[left]left[/left]</code></div>" +
        "<p></p>" +
        "<div class=\"bbcode bbcode_center\"><code>[center]center[/center]</code></div>" +
        "<p></p>" +
        "<div class=\"bbcode bbcode_right\"><code>[right]right[/right]</code></div>" +
        "<h2 id=\"links\">Links</h2>" +
        "<p><code>[url=https://furaffinity.net/user/fafaq]fafaq's page[/url]</code> -> <a class=\"auto_link named_url\" href=\"#\">fafaq's page</a> <br />" +
        "<code>[url]https://furaffinity.net/user/fafaq[/url]</code> -> <a href=\"https://furaffinity.net/user/fafaq\" title=\"https://furaffinity.net/user/fafaq\" class=\"auto_link\">https://furaffinity.net/user/fafaq</a>  </p>" +
        "<h3 id=\"youtube\">YouTube</h3>" +
        "<p><code>[yt]https://www.youtube.com/watch?v=aqz-KE-bpKQ[/yt]</code></p>" +
        "<h3 id=\"icons\">Icons</h3>" +
        "<p><code>:iconusername:</code> -> <a href=\"/user/hircreacc\" class=\"iconusername\">*insert profile pic* &nbsp;hircreacc</a><i> (not working in the preview)</i></p>" +
        "<p><code>:usernameicon:</code> -> <a href=\"/user/hircreacc\" class=\"iconusername\">*insert profile pic* &nbsp;hircreacc</a><i> (not working in the preview)</i></p>" +
        "<p><code>:linkusername:</code> -> <a href=\"/user/hircreacc\" class=\"linkusername\">hircreacc</a></p>" +
        "<h2 id=\"misc\">Misc</h2>" +
        "<p><code>(c)</code> -> All your base are belong to us© <br />" +
        "<code>(tm)</code> -> 'Sup™ <br />" +
        "<code>(r)</code> -> Spam®  </p>" +
        "<h2 id=\"source\">Source:</h2>" +
        "<p>https://www.furaffinity.net/journal/833448/</p>";
}