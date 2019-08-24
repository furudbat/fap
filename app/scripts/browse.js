"use strict";

import $ from "jquery";

import { getExtOptions } from './fap/base';
import { blacklistFiguresWithOptions } from './fap/fa';

var _initSubmissionsHideWithBlacklist = function (options) {
    $(document).ready(async function() {
        if(options.enableBlacklist) {
            blacklistFiguresWithOptions(options, $('body'));
        }
    }); 
};

getExtOptions([
    'enableBlacklist', 
    'useBlacklistInTitles', 'disableBlacklistInSubmissions', 'disableBlacklistInBrowse', 'disableBlacklistInSearch', 'disableBlacklistInArtist',
    'enableHideGeneral', 'enableHideMature', 'enableHideAdult'
]).then(_initSubmissionsHideWithBlacklist);