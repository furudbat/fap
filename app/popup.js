"use strict";

import $ from "jquery"; 
import {
  setExtOption,
  getExtDefaultOptions
} from './scripts/fap/base';

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
var restore_options = function () {
  return new Promise(function (resolve) {
    chrome.storage.sync.get(['options'], (items) => {
      let options = (items) ? items.options : getExtDefaultOptions();

      if (options) {
        $('#enableBlacklist').prop('checked', options.enableBlacklist);

        $('#enableBlacklistGeneral').prop('checked', options.enableBlacklistGeneral);
        $('#enableBlacklistMature').prop('checked', options.enableBlacklistMature);
        $('#enableBlacklistAdult').prop('checked', options.enableBlacklistAdult);
        $('#enableBlacklistFetish').prop('checked', options.enableBlacklistFetish);
        $('#enableBlacklistUser').prop('checked', options.enableBlacklistUser);

        $('#enableHideGeneral').prop('checked', options.enableHideGeneral);
        $('#enableHideMature').prop('checked', options.enableHideMature);
        $('#enableHideAdult').prop('checked', options.enableHideAdult);


        $('#disableBlacklistInSubmissions').prop('checked', options.disableBlacklistInSubmissions);
        $('#disableBlacklistInBrowse').prop('checked', options.disableBlacklistInBrowse);
        $('#disableBlacklistInArtist').prop('checked', options.disableBlacklistInArtist);
        $('#useBlacklistInTitles').prop('checked', options.useBlacklistInTitles);


        $('#enableBlacklistGeneral').prop('disabled', !options.enableBlacklist);
        $('#enableBlacklistMature').prop('disabled', !options.enableBlacklist);
        $('#enableBlacklistAdult').prop('disabled', !options.enableBlacklist);
        $('#enableBlacklistFetish').prop('disabled', !options.enableBlacklist);
        $('#enableBlacklistUser').prop('disabled', !options.enableBlacklist);
        $('#enableHideGeneral').prop('disabled', !options.enableBlacklist);
        $('#enableHideMature').prop('disabled', !options.enableBlacklist);
        $('#enableHideAdult').prop('disabled', !options.enableBlacklist);

        $('#disableBlacklistInSubmissions').prop('disabled', !options.enableBlacklist);
        $('#disableBlacklistInBrowse').prop('disabled', !options.enableBlacklist);
        $('#disableBlacklistInArtist').prop('disabled', !options.enableBlacklist);
        $('#useBlacklistInTitles').prop('disabled', !options.enableBlacklist);
      }

      resolve();
    });
  });
};


var open_options_page = function () {
  var optionsUrl = chrome.extension.getURL('pages/options.html');

  chrome.tabs.query({url: optionsUrl}, function(tabs) {
      if (tabs.length) {
          chrome.tabs.update(tabs[0].id, {active: true});
      } else {
          chrome.tabs.create({url: optionsUrl});
      }
  });
};


$(document).ready(function () {
  $('#open_options').click(open_options_page);

  restore_options().then(function () {
    $('#enableBlacklist').change(function () {
      setExtOption('enableBlacklist', $(this).prop("checked"));

      $('#enableBlacklistGeneral').prop('disabled', !$(this).prop("checked"));
      $('#enableBlacklistMature').prop('disabled', !$(this).prop("checked"));
      $('#enableBlacklistAdult').prop('disabled', !$(this).prop("checked"));
      $('#enableBlacklistFetish').prop('disabled', !$(this).prop("checked"));
      $('#enableBlacklistUser').prop('disabled', !$(this).prop("checked"));
  
      $('#enableHideGeneral').prop('disabled', !$(this).prop("checked"));
      $('#enableHideMature').prop('disabled', !$(this).prop("checked"));
      $('#enableHideAdult').prop('disabled', !$(this).prop("checked"));
  
      //$('#blacklistGeneral').prop('disabled', !$(this).prop("checked") || !$('#enableBlacklistGeneral').prop("checked"));
      //$('#blacklistMature').prop('disabled', !$(this).prop("checked") || !$('#enableBlacklistMature').prop("checked"));
      //$('#blacklistAdult').prop('disabled', !$(this).prop("checked") || !$('#enableBlacklistAdult').prop("checked"));
      //$('#blacklistFetish').prop('disabled', !$(this).prop("checked") || !$('#enableBlacklistFetish').prop("checked"));
  
      $('#disableBlacklistInSubmissions').prop('disabled', !$(this).prop("checked"));
      $('#disableBlacklistInBrowse').prop('disabled', !$(this).prop("checked"));
      $('#disableBlacklistInArtist').prop('disabled', !$(this).prop("checked"));
      $('#useBlacklistInTitles').prop('disabled', !$(this).prop("checked"));
    });

    $('#enableHideGeneral').change(function () {
      setExtOption('enableHideGeneral', $(this).prop("checked"));
    });
    $('#enableHideMature').change(function () {
      setExtOption('enableHideMature', $(this).prop("checked"));
    });
    $('#enableHideAdult').change(function () {
      setExtOption('enableHideAdult', $(this).prop("checked"));
    });
    

    $('#enableBlacklistGeneral').change(function () {
      setExtOption('enableBlacklistGeneral', $(this).prop("checked"));
    });
    $('#enableBlacklistMature').change(function () {
      setExtOption('enableBlacklistMature', $(this).prop("checked"));
    });
    $('#enableBlacklistAdult').change(function () {
      setExtOption('enableBlacklistAdult', $(this).prop("checked"));
    });
    $('#enableBlacklistFetish').change(function () {
      setExtOption('enableBlacklistFetish', $(this).prop("checked"));
    });


    $('#disableBlacklistInSubmissions').change(function () {
      setExtOption('disableBlacklistInSubmissions', $(this).prop("checked"));
    });
    $('#disableBlacklistInBrowse').change(function () {
      setExtOption('disableBlacklistInBrowse', $(this).prop("checked"));
    });
    $('#disableBlacklistInArtist').change(function () {
      setExtOption('disableBlacklistInArtist', $(this).prop("checked"));
    });
    $('#useBlacklistInTitles').change(function () {
      setExtOption('useBlacklistInTitles', $(this).prop("checked"));
    });
  });
});