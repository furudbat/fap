# ![Logo](https://raw.github.com/furudbat/fap/master/icon/icon-64.png) FAP - FurAffinity Patcher (Browser Extension)

The FurAffinity Patcher is a Browser Extension with some Content Scripts for [https://www.furaffinity.net/](https://www.furaffinity.net/).  
Adding some Client-Side features like Edit-Preview and some smaller tweaks.  

It all began with _"Why can't I see icons on my Watchlist ?“_, _"Who is this again ?"_ or _"No preview rendering in Submission-Upload-Page D:"_. :)  
I know [FA](https://www.furaffinity.net/) is an older site, but it's really sad to see no major feature updates in the last time. :'(  

This project should be small and adds some life improvements. I hope [FA](https://www.furaffinity.net/) gives us native Blacklist on the serverside, soon and some other fixes.   

FAP is mainly developed on Chrome and Firefox, but should be cross-browser, see [Development](#development).



### Changes

 - smaller Tweaks on Profile- and Submission-Page
 - Editor with BBCode-Preview
 - Notes-List with search and sort
 - hide Submissions: General, Mature or/and Adult


see [Features](#features) and [Screenshots](#screenshots) for more details.

## Installation

  - ~~[**Chrome** extension](https://chrome.google.com/webstore/detail/fap/ebjlnakhindifpcegigkbdjigiegohge)~~ outdated
  - [**Firefox** add-on](https://addons.mozilla.org/en-US/firefox/addon/fap)

## Usage

Install it, goto Options, set what you need and enjoy.


## Features
  
  * Small Tweaks
    * **Profile Page**
      - Replace link-Buttons with real Buttons (+Watch, -Watch, +Block, ...)
        - No more redirect, just AJAX with button.click-event
        - Buttons with new CSS
    * **(Submission) View Page**
      - Replace link-Buttons with real Buttons (+Fav, ...)
        - No more redirect, just AJAX with button.click-event
        - Buttons with new CSS
        - Add Artist in Sidebar
          - Add "+Watch"-Button

  * **Simple Editor with Preview and Help**
    - Notes
    - Profile-Edit
    - Journal
    - Upload

 * **Notes with Search and Sort**
    - Search in Notes list for Subject, Sender and Senddate
    - Sort by Subject, Sender and Sendate

  * **Options**
    - enable Editor-Preview
    - enable Tweaks

  * **Filter-List**
    - Username
    - Submission-ID
    - Title
    - hide Submissions: General, Mature or/and Adult


## Screenshots


![(Submission) View Page](https://raw.github.com/furudbat/fap/master/promo/Screenshot_View.png)  
_New "+Watch"- and "+Fav"-Buttons_

![Profile Page](https://raw.github.com/furudbat/fap/master/promo/Screenshot_Profile.png)  
_New "+Watch"- and "+Block"-Buttons_

![Profile Page Edit](https://raw.github.com/furudbat/fap/master/promo/Screenshot_ProfileEdit.png)  
_New "Update Profile Information"-Button_

![New Editor](https://raw.github.com/furudbat/fap/master/promo/Screenshot_NewEditor.png)  
_Editor with Preview_

![New Editor Preview](https://raw.github.com/furudbat/fap/master/promo/Screenshot_NewEditor_2.png)  
_Editor with Preview and Help_

![Notes-List with Search and Sort](https://raw.github.com/furudbat/fap/master/promo/Screenshot_Notes.png)  
_Notes-List with Search and Sort_


## Limitations

You must reload your Browsepage if you change or enable/disable the Blacklists.


## Credit

 - [jQuery](https://github.com/jquery/jquery)
 - [Bootstrap](https://github.com/twbs/bootstrap)
 - [Popper.js and Tooltip.js](https://github.com/FezVrasta/popper.js)
 - [BBCodeToHTML by niccolomineo](https://gist.github.com/niccolomineo/0bc0f45e86520fd508609a49e91a6251)
 - [HtmlToBBCode by soyuka](https://gist.github.com/soyuka/6183947)
 - [bbob by JiLiZART](https://github.com/JiLiZART/bbob)
 - ~~[CKEditor 5](https://github.com/ckeditor/ckeditor5), [Custom CKEditor 5 Build](https://gitlab.com/hircreacc/ckeditor5-build-classic)~~ maybe some day ... can't get it run without issues
 - [list.js by javve](https://github.com/javve/list.js)

Special thx to @Blacktiger5 for Feedback.  


### 3rd-Party Libraries Download Links (for Reference)

 - [jQuery v3.4.0](https://codeload.github.com/jquery/jquery/zip/3.4.0)
 - [Bootstrap v4.3.1](https://github.com/twbs/bootstrap/releases/download/v4.3.1/bootstrap-4.3.1-dist.zip)

see `app/js/` folder,  
see also [package.json](https://gitlab.com/hircreacc/fap/blob/master/package.json) for more details.


## Development

Packaged with [webextension-toolbox](https://github.com/HaNdTriX/webextension-toolbox).  

### Install

	$ npm install

### Development

    npm run dev chrome
    npm run dev firefox
    npm run dev opera
    npm run dev edge

### Build

    npm run build chrome
    npm run build firefox
    npm run build opera
    npm run build edge

### Environment

The build tool also defines a variable named `process.env.NODE_ENV` in your scripts. 

### Docs

* [webextension-toolbox](https://github.com/HaNdTriX/webextension-toolbox)


## License

MIT