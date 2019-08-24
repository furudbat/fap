"use strict";

//import $ from "jquery";

export function getExtOption(name) {
    return new Promise(function (resolve) {
        chrome.storage.sync.get(['options'], (items) => {
            if (items.options) {
                resolve(items.options[name]);
            } else {
                resolve(null);
            }
        });
    });
}

export function getExtOptions(names) {
    return new Promise(function (resolve) {
        chrome.storage.sync.get(['options'], (items) => {
            if (items.options) {
                resolve(
                    Object.keys(items.options)
                    .filter(key => names.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = items.options[key];
                        return obj;
                    }, {})
                );
            } else {
                resolve(null);
            }
        });
    });
}




export function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




export function getExtDefaultOptions () {
    return {
        useNewEditor: false,
        useNewEditorNotes: false,
        useNewEditorJournal: false,
        useNewEditorUpload: false,
        useNewEditorEditProfile: false,

        defaultEditorPreview: true,

        profileTweaks: true,
        viewTweaks: true,
        useNewNotesList: true,
        watchlistWithIcons: false,
        watchlistWithPaging: true,

        enableBlacklist: false,
        enableBlacklistGeneral: true,
        enableBlacklistMature: true,
        enableBlacklistAdult: true,
        enableBlacklistFetish: true,
        enableBlacklistUser: false,

        enableHideGeneral: false,
        enableHideMature: false,
        enableHideAdult: false,

        blacklistGeneral: [],
        blacklistMature: [],
        blacklistAdult: [],
        blacklistFetish: [],
        blacklistUser: [],

        disableBlacklistInSubmissions: false,
        disableBlacklistInBrowse: false,
        disableBlacklistInArtist: false,
        useBlacklistInTitles: true,
    };
}


export function setExtOption (option, value) {
    return new Promise(function (resolve) {
      chrome.storage.sync.get(['options'], (items) => {
        let options = (items)? items.options : getExtDefaultOptions();

        options[option] = value;

        chrome.storage.sync.set({options: options}, function() {
            resolve(options);
        });
      });
    });
}
