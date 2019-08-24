"use strict";

import $ from "jquery"; ///< already loaded
import { getExtDefaultOptions, local_cache_cleanup_all } from './scripts/fap/base';
import { FEATURES_HELP_TEXT } from './scripts/fap/fa';

// Saves options to chrome.storage
var save_options = function() {
  let useNewEditor = $('#useNewEditor').prop("checked");
  let useNewEditorNotes = $('#useNewEditorNotes').prop("checked");
  let useNewEditorJournal = $('#useNewEditorJournal').prop("checked");
  let useNewEditorUpload = $('#useNewEditorUpload').prop("checked");
  let useNewEditorEditProfile = $('#useNewEditorEditProfile').prop("checked");
  
  let defaultEditorPreview = $('#defaultEditorPreview').prop("checked");

  let profileTweaks = $('#profileTweaks').prop("checked");
  let viewTweaks = $('#viewTweaks').prop("checked");
  let useNewNotesList = $('#useNewNotesList').prop("checked");
  let watchlistWithPaging = $('#watchlistWithPaging').prop("checked");

  let enableBlacklist = $('#enableBlacklist').prop("checked");
  let enableBlacklistGeneral = $('#enableBlacklistGeneral').prop("checked");
  let enableBlacklistMature = $('#enableBlacklistMature').prop("checked");
  let enableBlacklistAdult = $('#enableBlacklistAdult').prop("checked");
  let enableBlacklistFetish = $('#enableBlacklistFetish').prop("checked");
  let enableBlacklistUser = $('#enableBlacklistUser').prop("checked");

  let enableHideGeneral = $('#enableHideGeneral').prop("checked");
  let enableHideMature = $('#enableHideMature').prop("checked");
  let enableHideAdult = $('#enableHideAdult').prop("checked");

  let blacklistGeneral = $('#blacklistGeneral').val().split('\n');
  let blacklistMature = $('#blacklistMature').val().split('\n');
  let blacklistAdult = $('#blacklistAdult').val().split('\n');
  let blacklistFetish = $('#blacklistFetish').val().split('\n');
  let blacklistUser = $('#blacklistUser').val().split('\n');


  let disableBlacklistInSubmissions = $('#disableBlacklistInSubmissions').prop("checked");
  let disableBlacklistInBrowse = $('#disableBlacklistInBrowse').prop("checked");
  let disableBlacklistInArtist = $('#disableBlacklistInArtist').prop("checked");
  let useBlacklistInTitles = $('#useBlacklistInTitles').prop("checked");

  chrome.storage.sync.set({options: {
    useNewEditor: useNewEditor,
    useNewEditorNotes: useNewEditorNotes,
    useNewEditorJournal: useNewEditorJournal,
    useNewEditorUpload: useNewEditorUpload,
    useNewEditorEditProfile: useNewEditorEditProfile,

    defaultEditorPreview: defaultEditorPreview,

    profileTweaks: profileTweaks,
    viewTweaks: viewTweaks,
    useNewNotesList: useNewNotesList,
    watchlistWithPaging: watchlistWithPaging,

    enableBlacklist: enableBlacklist,
    enableBlacklistGeneral: enableBlacklistGeneral,
    enableBlacklistMature: enableBlacklistMature,
    enableBlacklistAdult: enableBlacklistAdult,
    enableBlacklistFetish: enableBlacklistFetish,
    enableBlacklistUser: enableBlacklistUser,

    enableHideGeneral: enableHideGeneral,
    enableHideMature: enableHideMature,
    enableHideAdult: enableHideAdult,

    blacklistGeneral: blacklistGeneral,
    blacklistMature: blacklistMature,
    blacklistAdult: blacklistAdult,
    blacklistFetish: blacklistFetish,
    blacklistUser: blacklistUser,

    disableBlacklistInSubmissions: disableBlacklistInSubmissions,
    disableBlacklistInBrowse: disableBlacklistInBrowse,
    disableBlacklistInArtist: disableBlacklistInArtist,
    useBlacklistInTitles: useBlacklistInTitles,
  }}, function() {
    $("#save").delay(50).fadeOut().fadeIn('slow');
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
var restore_options = function () {
  return new Promise(function (resolve) {
    chrome.storage.sync.get(['options'], (items) => {
      let options = (items)? items.options : getExtDefaultOptions();
      
      if (options) {
        $('#defaultEditorPreview').prop('checked', options.defaultEditorPreview);

        $('#profileTweaks').prop('checked', options.profileTweaks);
        $('#viewTweaks').prop('checked', options.viewTweaks);
        $('#useNewNotesList').prop('checked', options.useNewNotesList);
        $('#watchlistWithPaging').prop('checked', options.watchlistWithPaging);

        $('#enableBlacklist').prop('checked', options.enableBlacklist);

        $('#enableBlacklistGeneral').prop('checked', options.enableBlacklistGeneral);
        $('#enableBlacklistMature').prop('checked', options.enableBlacklistMature);
        $('#enableBlacklistAdult').prop('checked', options.enableBlacklistAdult);
        $('#enableBlacklistFetish').prop('checked', options.enableBlacklistFetish);
        $('#enableBlacklistUser').prop('checked', options.enableBlacklistUser);

        $('#enableHideGeneral').prop('checked', options.enableHideGeneral);
        $('#enableHideMature').prop('checked', options.enableHideMature);
        $('#enableHideAdult').prop('checked', options.enableHideAdult);

        if (options.blacklistGeneral) {
          $('#blacklistGeneral').val(options.blacklistGeneral.join('\n'));
        }
        if (options.blacklistMature) {
          $('#blacklistMature').val(options.blacklistMature.join('\n'));
        }
        if (options.blacklistAdult) {
          $('#blacklistAdult').val(options.blacklistAdult.join('\n'));
        }
        if (options.blacklistFetish) {
          $('#blacklistFetish').val(options.blacklistFetish.join('\n'));
        }
        if (options.blacklistUser) {
          $('#blacklistUser').val(options.blacklistUser.join('\n'));
        }

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

        //$('#blacklistGeneral').prop('disabled', !$(this).prop("checked") || !$('#enableBlacklistGeneral').prop("checked"));
        //$('#blacklistMature').prop('disabled', !$(this).prop("checked") || !$('#enableBlacklistMature').prop("checked"));
        //$('#blacklistAdult').prop('disabled', !$(this).prop("checked") || !$('#enableBlacklistAdult').prop("checked"));
        //$('#blacklistFetish').prop('disabled', !$(this).prop("checked") || !$('#enableBlacklistFetish').prop("checked"));

        $('#disableBlacklistInSubmissions').prop('disabled', !options.enableBlacklist);
        $('#disableBlacklistInBrowse').prop('disabled', !options.enableBlacklist);
        $('#disableBlacklistInArtist').prop('disabled', !options.enableBlacklist);
        $('#useBlacklistInTitles').prop('disabled', !options.enableBlacklist);


        $('#useNewEditor').prop('checked', options.useNewEditor);
        $('#useNewEditorNotes').prop('checked', options.useNewEditorNotes);
        $('#useNewEditorJournal').prop('checked', options.useNewEditorJournal);
        $('#useNewEditorUpload').prop('checked', options.useNewEditorUpload);
        $('#useNewEditorEditProfile').prop('checked', options.useNewEditorEditProfile);

        $('#useNewEditorNotes').prop('disabled', !options.useNewEditor);
        $('#useNewEditorJournal').prop('disabled', !options.useNewEditor);
        $('#useNewEditorUpload').prop('disabled', !options.useNewEditor);
        $('#useNewEditorEditProfile').prop('disabled', !options.useNewEditor);
      }

      resolve();
    });
  });
};

var reset_options = function () {
  return new Promise(function (resolve) {
    let options = getExtDefaultOptions();
        
    chrome.storage.sync.set({options: options}, function() {
      restore_options().then(function () {
        $("#reset").delay(25).fadeOut().fadeIn('slow');
        resolve();
      });
    });
  });
};


$(document).ready(function() {
  $('#useNewEditor').change(function() {
    $('#useNewEditorNotes').prop('disabled', !$(this).prop("checked"));
    $('#useNewEditorJournal').prop('disabled', !$(this).prop("checked"));
    $('#useNewEditorUpload').prop('disabled', !$(this).prop("checked"));
    $('#useNewEditorEditProfile').prop('disabled', !$(this).prop("checked"));
  });

  $('#enableBlacklist').change(function() {
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

  /*
  $('#enableBlacklistGeneral').change(function() {
    $('#blacklistGeneral').prop('disabled', !$(this).prop("checked"));
  });
  $('#enableBlacklistMature').change(function() {
    $('#blacklistMature').prop('disabled', !$(this).prop("checked"));
  });
  $('#enableBlacklistAdult').change(function() {
    $('#blacklistAdult').prop('disabled', !$(this).prop("checked"));
  });
  $('#enableBlacklistFetish').change(function() {
    $('#blacklistFetish').prop('disabled', !$(this).prop("checked"));
  });
  */

  restore_options().then(function () {
    $('#save').click(save_options);
    $('#clear_cache').click(local_cache_cleanup_all_options);
    $('#reset').click(reset_options);
  });
});