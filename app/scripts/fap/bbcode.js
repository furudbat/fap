"use strict";

//import $ from "jquery";

export function bbcode_to_html(input) {
    if (!input) {
        return input;
    }

    /// https://codepen.io/Cr45hCode/pen/KtHLj

    let rep = (re, str) => {
        input = input.replace(re, str);
    };

    let temp = null;
    let tempConvert = null;
    let re = null;


    // parse &
    rep(/&/gi, '&amp;');
    // parse < and >
    rep(/</gi, '&lt;');
    rep(/>/gi, '&gt;');

    // ___[ restructuring ]_______________________________________________________________

    // [URL]link[URL] -> [URL=link]link[URL] (to prevent loosing any applied styles)
    re = new RegExp(/\[url\](.*?)\[\/url\]/gi);
    temp = re.exec(input);
    while (temp) {
        tempConvert = temp[1].replace(/\[.*?\]/gi, '').replace(/\s+/gi, '_');
        rep(temp[0], '[url="' + tempConvert + '"]' + temp[1] + '[/url]');
        temp = re.exec(input);
    }

    // ___________________________________________________________________________________




    // loop to find every occurance of 
    //  [b] [i] [u] [spoiler] [left] [center] [right] and [block] aka [justify]
    do {
        temp = input;

        rep(/\[b\](.*?)\[\/b\]/gi, '<strong class="bbcode bbcode_b">$1</strong>');
        rep(/\[i\](.*?)\[\/i\]/gi, '<i class="bbcode bbcode_i">$1</i>');
        rep(/\[u\](.*?)\[\/u\]/gi, '<u class="bbcode bbcode_u">$1</u>');
        rep(/\[s\](.*?)\[\/s\]/gi, '<s class="bbcode bbcode_s">$1</s>');

        rep(/\[h1\](.*?)\[\/h1\]/gi, '<h1 class="bbcode bbcode_h1">$1</h1>');
        rep(/\[h2\](.*?)\[\/h2\]/gi, '<h2 class="bbcode bbcode_h2">$1</h2>');
        rep(/\[h3\](.*?)\[\/h3\]/gi, '<h3 class="bbcode bbcode_h3">$1</h3>');
        rep(/\[h4\](.*?)\[\/h4\]/gi, '<h4 class="bbcode bbcode_h4">$1</h4>');
        rep(/\[h5\](.*?)\[\/h5\]/gi, '<h5 class="bbcode bbcode_h5">$1</h5>');

        rep(/\[sup\](.*?)\[\/sup\]/gi, '<sup class="bbcode bbcode_sup">$1</sup>');
        rep(/\[sub\](.*?)\[\/sub\]/gi, '<sub class="bbcode bbcode_sub">$1</sub>');

        //rep(/\[block\](.*?)\[\/block\]/gi, '<div style="text-align:justify;">$1</div>');
        //rep(/\[justify\](.*?)\[\/justify\]/gi, '<div style="text-align:justify;">$1</div>');

        rep(/:link(\S+):/gi, '<a href="/user/$1" class="linkusername">$1</a>');

        rep(/\(c\)/gi, '©');
        rep(/\(tm\)/gi, '™');
        rep(/\(r\)/gi, '®');
    } while (temp !== input);

    // parse links
    rep(/\[url="?([^"]*?)"?\]([^\[]*?)\[\/url\]/gi, '<a href="$1" class="auto_link named_url">$2</a>');

    // loop to find every occurance of 
    //   [color=#000] [color=#000000] and [color=black]
    //   [img]path[/img]
    //   [quote] and [quote="author"]
    //   NOTE: need to be this far down, otherwise it would not be possible to write other tags in it
    do {
        temp = input;

        rep(/\[color="?(#\d{3}|#\d{6}|[a-zA-Z]*|\S*)"?\]([^\[]*?)\[\/color\]/gi, '<span class="bbcode" style="color:$1">$2</span>');
        //rep(/\[img\]([^\[]*?)\[\/img\]/gi, '<img src="$1">');
        rep(/\[quote="?([^\[]*?)"?\][\n]?([^\[]*?)\[\/quote\]/gmi, '<div class="bbcode bbcode_quote"><span class="bbcode bbcode_quote_name">$1</span>$2</div>');
        rep(/\[quote\][\n]?([^\[]*?)\[\/quote\]/gmi, '<div class="bbcode bbcode_quote">$1</div>');

        rep(/\[spoiler\][\n]?([^\[]*?)\[\/spoiler\]/gmi, '<div class="bbcode bbcode_spoiler">$1</div>');

        rep(/\[left\][\n]?([^\[]*?)\[\/left\]/gmi, '<div class="bbcode bbcode_left">$1</div>');
        rep(/\[center\][\n]?([^\[]*?)\[\/center\]/gmi, '<div class="bbcode bbcode_center">$1</div>');
        rep(/\[right\][\n]?([^\[]*?)\[\/right\]/gmi, '<div class="bbcode bbcode_right">$1</div>');

        rep(/\[yt\]([^"]*?)\[\/yt\]/gmi, '<object class="auto_link youtube" width="560" height="340"><param name="movie" value="$1"><param name="allowFullScreen" value="true"><param name="allowscriptaccess" value="always"><embed src="$1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="560" height="340"></object>');

    } while (temp !== input);


    do {
        temp = input;

        rep(/\[quote="?([^\[]*?)"?\](\n)?/gi, '<div class="bbcode bbcode_quote"><span class="bbcode bbcode_quote_name">$1</span>');
        rep(/\[\/quote\](\n)?/gi, '</div>');
        
        rep(/\[quote\](\n)?/gi, '<div class="bbcode bbcode_quote">');
        rep(/\[\/quote\](\n)?/gi, '</div>');

        rep(/\[spoiler\](\n)?/gi, '<div class="bbcode bbcode_spoiler">');
        rep(/\[\/spoiler\](\n)?/gi, '</div>');

        rep(/\[left\](\n)?/gi, '<div class="bbcode bbcode_left">');
        rep(/\[\/left\](\n)?/gi, '</div>');

        rep(/\[center\](\n)?/gi, '<div class="bbcode bbcode_center">');
        rep(/\[\/center\](\n)?/gi, '</div>');

        rep(/\[right\](\n)?/gmi, '<div class="bbcode bbcode_right">');
        rep(/\[\/right\](\n)?/gmi, '</div>');

    } while (temp !== input);

    // parse lists
    // clean up
    /*
    rep(/\[list([^\]])*\].*?\[\*\]/gi, '[list$1][*]');
    re = new RegExp(/\[list=?([^\]])*?\](.*?)\[\/list\]/gi);
    while (temp = re.exec(input) ) {
        tempConvert = temp[2].replace(/<[^>]*>/gi, '').replace(/\[\*\]([^\[]*)/gi, '<li>$1</li>').replace(/\s+/gi, ' ');
        if (temp[1]) {
            rep(temp[0], '<ol type="' + temp[1].replace(/"/gi, '') + '">' + tempConvert + '</ol>');
        } else {
            rep(temp[0], '<ul>' + tempConvert + '</ul>');
        };
    }
    */


    // parse linebreaks
    rep(/\n/gi, '<br />');

    // clean up invalid Tags
    //rep(/\[.*?\]/gi, '');

    // parse multiple whitespaces
    rep(/\s{2,}/gi, ' &nbsp;');

    return input;
}



/// https://gist.github.com/soyuka/6183947
// Adapted from http://skeena.net/htmltobb/

export function html_to_bbcode(html) {

    // paragraph handling:
    // - if a paragraph opens on the same line as another one closes, insert an extra blank line
    // - opening tag becomes two line breaks
    // - closing tags are just removed
    // html += html.replace(/<\/p><p/<\/p>\n<p/gi;
    // html += html.replace(/<p[^>]*>/\n\n/gi;
    // html += html.replace(/<\/p>//gi;

    let replaceRegexStyle = function (html, htmltag, styletag, bbcodetag, value = '.*?', multiline = false) {
        let re = new RegExp(
            '<' + htmltag + ' ' + '(.*?)style=["\'](.*?)' + styletag + ':[\\s]?(' + value + ')[;]?["\']>' +
            '(.*?)' +
            '<\\/' + htmltag + '>', 'gi' + ((multiline) ? 'm' : ''));

        return html.replace(re, (bbcodetag) ? '[' + bbcodetag + ']$4[/' + bbcodetag + ']' : '$4');
    };

    let replaceRegexStyleAttr = function (html, htmltag, styletag, bbcodetag, value = '.*?', multiline = false) {
        let re = new RegExp(
            '<' + htmltag + ' ' + '(.*?)style=["\'](.*?)' + styletag + ':[\\s]?(' + value + ')[;]?["\']>' +
            '(.*?)' +
            '<\\/' + htmltag + '>', 'gi' + ((multiline) ? 'm' : ''));

        return html.replace(re, (bbcodetag) ? '[' + bbcodetag + '=$3]$4[/' + bbcodetag + ']' : '$4');
    };

    let replaceRegexClass = function (html, htmltag, classname, bbcodetag, multiline = false) {
        let re = new RegExp(
            '<' + htmltag + ' ' + '(.*?)class=["\'](.*?)[\\s]?' + classname + '[\\s]?(.*?)[;]?["\']>' +
            '(.*?)' +
            '<\\/' + htmltag + '>', 'gi' + ((multiline) ? 'm' : ''));

        return html.replace(re, (bbcodetag) ? '[' + bbcodetag + ']$4[/' + bbcodetag + ']' : '$4');
    };


    html = html.replace(/<pre(.*?)>(.*?)<\/pre>/gmi, '[code]$2[/code]');

    // html = html.replace( /<h[1-7](.*?)>(.*?)<\/h[1-7]>/, '\n[h]$2[/h]\n' );

    html = html.replace(/<br(.*?)>/gi, '\n');
    html = html.replace(/<textarea(.*?)>(.*?)<\/textarea>/gmi, '\[code]$2\[\/code]');
    html = html.replace(/<code(.*?)>(.*?)<\/code>/gmi, '\[code]$2\[\/code]');

    html = replaceRegexClass(html, 'div', 'bbcode_b', 'b');
    html = replaceRegexClass(html, 'div', 'bbcode_i', 'i');
    html = replaceRegexClass(html, 'div', 'bbcode_u', 'u');
    html = replaceRegexClass(html, 'div', 'bbcode_s', 's');
    html = replaceRegexClass(html, 'strong', 'bbcode_b', 'b');

    html = html.replace(/<b>/gi, '[b]');
    html = html.replace(/<i>/gi, '[i]');
    html = html.replace(/<u>/gi, '[u]');
    html = html.replace(/<s>/gi, '[s]');
    html = html.replace(/<b (.*)>/gi, '[b]');
    html = html.replace(/<i (.*)>/gi, '[i]');
    html = html.replace(/<u (.*)>/gi, '[u]');
    html = html.replace(/<s (.*)>/gi, '[s]');
    html = html.replace(/<\/b>/gi, '[/b]');
    html = html.replace(/<\/i>/gi, '[/i]');
    html = html.replace(/<\/u>/gi, '[/u]');
    html = html.replace(/<\/s>/gi, '[/s]');
    html = html.replace(/<em>/gi, '[b]');
    html = html.replace(/<\/em>/gi, '[/b]');
    html = html.replace(/<strong>/gi, '[b]');
    html = html.replace(/<strong (.*)>/gi, '[b]');
    html = html.replace(/<\/strong>/gi, '[/b]');

    html = html.replace(/<sup>/gi, '[sup]');
    html = html.replace(/<sub>/gi, '[sub]');
    html = html.replace(/<\/sup>/gi, '[/sup]');
    html = html.replace(/<\/sub>/gi, '[/sub]');

    html = html.replace(/<h1>/gi, '[h1]');
    html = html.replace(/<h2>/gi, '[h2]');
    html = html.replace(/<h3>/gi, '[h3]');
    html = html.replace(/<h4>/gi, '[h4]');
    html = html.replace(/<h5>/gi, '[h5]');
    html = html.replace(/<\/h1>/gi, '[/h1]');
    html = html.replace(/<\/h2>/gi, '[/h2]');
    html = html.replace(/<\/h3>/gi, '[/h3]');
    html = html.replace(/<\/h4>/gi, '[/h4]');
    html = html.replace(/<\/h5>/gi, '[/h5]');

    html = html.replace(/<blockquote>/gi, '[quote]');
    html = html.replace(/<\/blockquote>/gi, '[/quote]');
    html = html.replace(/<cite>/gi, '[i]');
    html = html.replace(/<\/cite>/gi, '[/i]');

    html = replaceRegexStyleAttr(html, 'font', 'color', 'color');
    html = replaceRegexStyleAttr(html, 'span', 'color', 'color');
    html = replaceRegexStyleAttr(html, 'p', 'color', 'color');

    html = html.replace(/<link(.*?)>/gi, '');
    html = html.replace(/<li(.*?)>(.*?)<\/li>/gi, '[*]$2');
    html = html.replace(/<ul(.*?)>/gi, '[list]');
    html = html.replace(/<\/ul>/gi, '[/list]');


    html = replaceRegexStyle(html, 'p', 'text-align', 'left', 'left');
    html = replaceRegexStyle(html, 'p', 'text-align', 'center', 'center');
    html = replaceRegexStyle(html, 'p', 'text-align', 'right', 'right');
    html = replaceRegexStyle(html, 'p', 'text-align', null);

    html = replaceRegexStyle(html, 'span', 'text-align', 'left', 'left');
    html = replaceRegexStyle(html, 'span', 'text-align', 'center', 'center');
    html = replaceRegexStyle(html, 'span', 'text-align', 'right', 'right');
    html = replaceRegexStyle(html, 'span', 'text-align', null);

    html = replaceRegexClass(html, 'div', 'bbcode_left', 'left');
    html = replaceRegexClass(html, 'div', 'bbcode_center', 'center');
    html = replaceRegexClass(html, 'div', 'bbcode_right', 'right');

    html = replaceRegexClass(html, 'div', 'bbcode_spoiler', 'spoiler', true);
    html = replaceRegexClass(html, 'div', 'bbcode_quote', 'quote', true);


    html = html.replace(/<div class=["'](.*?)bbcode_quote(.*?)["'](.*?)>[\n]?(<span (.*?)class=["'](.*?)bbcode_quote_name["'](.*?)>[\n]?(.*?)[\n]?<\/span>)?[\n]?(.*?)<\/div>/gmi, '[quote name=$8]$9[/quote]');


    html = html.replace(/<figure(.*?)>/gi, '');
    html = html.replace(/<\/figure>/gi, '');
    html = html.replace(/<div class=["'](.*?)ck-media__wrapper["'] data-oembed-url=["'](.*?)["'"]>(.*?)[\n]?<div(.*?)>(.*?)<\/div>[\n]?(.*?)<\/div>/gi, '[yt]$2[/yt]');
    html = html.replace(/<div class=["'](.*?)ck-media__wrapper["'] data-oembed-url=["'](.*?)["'"]>[\n]?(.*?)[\n]?<\/div>/gi, '[yt]$2[/yt]');

    html = html.replace(/<td(.*?)>/gi, ' ');
    html = html.replace(/<tr(.*?)>/gi, '\n');

    html = html.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, '[img]$2[/img]');
    html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, '[url=$2]$4[/url]');

    html = html.replace(/<head>(.*?)<\/head>/gmi, '');
    html = html.replace(/<object>(.*?)<\/object>/gmi, '');
    html = html.replace(/<script(.*?)>(.*?)<\/script>/gmi, '');
    html = html.replace(/<style(.*?)>(.*?)<\/style>/gmi, '');
    html = html.replace(/<title>(.*?)<\/title>/gmi, '');
    html = html.replace(/<!--(.*?)-->/gmi, '\n');

    html = html.replace(/\/\//gi, '/');
    html = html.replace(/http:\//gi, 'http://');

    html = html.replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gmi, '');
    html = html.replace(/\r\r/gi, '');
    html = html.replace(/\[img]\//gi, '[img]');
    html = html.replace(/\[url=\//gi, '[url=');

    html = html.replace(/\[spoiler\]/gi, '[spoiler]');
    html = html.replace(/\[\/spoiler\]/gi, '[/spoiler]');
    html = html.replace(/\[yt\]/gi, '[yt]');
    html = html.replace(/\[\/yt\]/gi, '[/yt]');

    html = html.replace(/<p(.*?)>[\n]?(.*?)[\n]?<\/p>/gmi, '$2\n\n');
    html = html.replace(/&nbsp;/gi, ' ');

    // html = html.replace( /<div>/gi, '\n' );
    // html = html.replace( /<div(.*)>/gi, '\n' );
    // html = html.replace( /<\/div>/gi, '\n' );

    // html = html.replace( /(\S)\n/gi, '$1 ' );

    return html;
}