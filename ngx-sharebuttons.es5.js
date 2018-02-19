import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Inject, Injectable, InjectionToken, Input, NgModule, Output, Pipe, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';

var FacebookButton = (function () {
    /**
     * @param {?} prop
     * @param {?} http
     */
    function FacebookButton(prop, http) {
        this.prop = prop;
        this.http = http;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    FacebookButton.prototype.link = function (url, args) {
        var /** @type {?} */ shareUrl = this.prop.shareUrl + url;
        if (args.title) {
            shareUrl += '&quote=' + args.title;
        }
        return shareUrl;
    };
    /**
     * @param {?} url
     * @return {?}
     */
    FacebookButton.prototype.count = function (url) {
        return this.http.get(this.prop.countUrl + url)
            .filter(function (res) { return !!(res.share && res.share.share_count); })
            .map(function (res) { return +res.share.share_count; })
            .catch(function (err) { return Observable.empty(); });
    };
    return FacebookButton;
}());

/** TWITTER DOCS: https://dev.twitter.com/web/tweet-button/web-intent */
var TwitterButton = (function () {
    /**
     * @param {?} prop
     */
    function TwitterButton(prop) {
        this.prop = prop;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    TwitterButton.prototype.link = function (url, args) {
        var /** @type {?} */ shareUrl = this.prop.shareUrl + url;
        if (args.description) {
            shareUrl += '&text=' + args.description;
        }
        if (args.via) {
            shareUrl += '&via=' + args.via;
        }
        if (args.tags) {
            shareUrl += '&hashtags=' + args.tags;
        }
        return shareUrl;
    };
    /**
     * @return {?}
     */
    TwitterButton.prototype.count = function () {
        return Observable.empty();
    };
    return TwitterButton;
}());

/** LINKEDIN DOCS https://developer.linkedin.com/docs/share-on-linkedin#! */
var LinkedinButton = (function () {
    /**
     * @param {?} prop
     * @param {?} http
     */
    function LinkedinButton(prop, http) {
        this.prop = prop;
        this.http = http;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    LinkedinButton.prototype.link = function (url, args) {
        var /** @type {?} */ shareUrl = this.prop.shareUrl + url;
        if (args.title) {
            shareUrl += '&title=' + args.title;
        }
        if (args.description) {
            shareUrl += '&summary=' + args.description;
        }
        return shareUrl;
    };
    /**
     * @param {?} url
     * @return {?}
     */
    LinkedinButton.prototype.count = function (url) {
        return this.http.jsonp(this.prop.countUrl + url, 'callback')
            .filter(function (res) { return !!res.count; })
            .map(function (res) { return +res.count; })
            .catch(function (err) { return Observable.empty(); });
    };
    return LinkedinButton;
}());

/** TUMBLR DOCS: https://www.tumblr.com/docs/en/share_button */
var TumblrButton = (function () {
    /**
     * @param {?} prop
     * @param {?} http
     */
    function TumblrButton(prop, http) {
        this.prop = prop;
        this.http = http;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    TumblrButton.prototype.link = function (url, args) {
        var /** @type {?} */ shareUrl = this.prop.shareUrl + url;
        if (args.description) {
            shareUrl += '&caption=' + args.description;
        }
        if (args.tags) {
            shareUrl += '&tags=' + args.tags;
        }
        return shareUrl;
    };
    /**
     * @param {?} url
     * @return {?}
     */
    TumblrButton.prototype.count = function (url) {
        return this.http.jsonp(this.prop.countUrl + url, 'callback')
            .filter(function (res) { return !!(res.response && res.response.note_count); })
            .map(function (res) { return +res.response.note_count; })
            .catch(function (err) { return Observable.empty(); });
    };
    return TumblrButton;
}());

var WhatsappButton = (function () {
    /**
     * @param {?} prop
     */
    function WhatsappButton(prop) {
        this.prop = prop;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    WhatsappButton.prototype.link = function (url, args) {
        var /** @type {?} */ shareUrl = this.prop.shareUrl;
        if (args.description) {
            shareUrl += args.description + ' %0A';
        }
        return shareUrl + url;
    };
    /**
     * @return {?}
     */
    WhatsappButton.prototype.count = function () {
        return Observable.empty();
    };
    return WhatsappButton;
}());

var PinterestButton = (function () {
    /**
     * @param {?} prop
     * @param {?} http
     */
    function PinterestButton(prop, http) {
        this.prop = prop;
        this.http = http;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    PinterestButton.prototype.link = function (url, args) {
        var /** @type {?} */ shareUrl = this.prop.shareUrl + url;
        /** The description and the image are required to get the pin button to work. */
        if (args.description) {
            shareUrl += '&description=' + args.description;
        }
        else if (document) {
            /**
             * If user didn't add description, get it from the OG meta tag
             */
            var ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) {
                shareUrl += '&description=' + ogDescription.getAttribute('content');
            }
            else {
                console.warn('[ShareButtons]: You didn\'t set the description text for Pinterest button');
            }
        }
        if (args.image) {
            shareUrl += '&media=' + args.image;
        }
        else if (document) {
            var /** @type {?} */ ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) {
                shareUrl += '&media=' + ogImage.getAttribute('content');
            }
            else {
                console.warn('[ShareButtons]: You didn\'t set the image URL for Pinterest button');
            }
        }
        return shareUrl;
    };
    /**
     * @param {?} url
     * @return {?}
     */
    PinterestButton.prototype.count = function (url) {
        return this.http.get(this.prop.countUrl + url, { responseType: 'text' })
            .map(function (text) { /** @type {?} */ return (JSON.parse(text.replace(/^receiveCount\((.*)\)/, '$1'))); })
            .filter(function (res) { return !!res.count; })
            .map(function (res) { return +res.count; })
            .catch(function (err) { return Observable.empty(); });
    };
    return PinterestButton;
}());

/** REDDIT DOCS: http://stackoverflow.com/questions/24823114/post-to-reddit-via-url */
var RedditButton = (function () {
    /**
     * @param {?} prop
     * @param {?} http
     */
    function RedditButton(prop, http) {
        this.prop = prop;
        this.http = http;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    RedditButton.prototype.link = function (url, args) {
        var /** @type {?} */ shareUrl = this.prop.shareUrl + url;
        if (args.title) {
            shareUrl += '&title=' + args.title;
        }
        return shareUrl;
    };
    /**
     * @param {?} url
     * @return {?}
     */
    RedditButton.prototype.count = function (url) {
        return this.http.get(this.prop.countUrl + url)
            .filter(function (res) { return !!(res.data && res.data.children && res.data.children.length); })
            .map(function (res) { return +res.data.children[0].data.score; })
            .catch(function (err) { return Observable.empty(); });
    };
    return RedditButton;
}());

/** GPLUS DOCS: https://developers.google.com/+/web/share/#sharelink */
var GoogleButton = (function () {
    /**
     * @param {?} prop
     * @param {?} http
     */
    function GoogleButton(prop, http) {
        this.prop = prop;
        this.http = http;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    GoogleButton.prototype.link = function (url) {
        return this.prop.shareUrl + url;
    };
    /**
     * @param {?} url
     * @return {?}
     */
    GoogleButton.prototype.count = function (url) {
        return Observable.empty();
    };
    return GoogleButton;
}());

/** STUMBLE DOCS: http://stackoverflow.com/questions/10591424/how-can-i-create-a-custom-stumbleupon-button */
var StumbleButton = (function () {
    /**
     * @param {?} prop
     */
    function StumbleButton(prop) {
        this.prop = prop;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    StumbleButton.prototype.link = function (url) {
        return this.prop.shareUrl + url;
    };
    /**
     * @return {?}
     */
    StumbleButton.prototype.count = function () {
        return Observable.empty();
    };
    return StumbleButton;
}());

var TelegramButton = (function () {
    /**
     * @param {?} prop
     */
    function TelegramButton(prop) {
        this.prop = prop;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    TelegramButton.prototype.link = function (url, args) {
        var /** @type {?} */ shareUrl = this.prop.shareUrl + url;
        if (args.description) {
            shareUrl += '&text=' + args.description;
        }
        return shareUrl;
    };
    /**
     * @return {?}
     */
    TelegramButton.prototype.count = function () {
        return Observable.empty();
    };
    return TelegramButton;
}());

var EmailButton = (function () {
    /**
     * @param {?} prop
     */
    function EmailButton(prop) {
        this.prop = prop;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    EmailButton.prototype.link = function (url, args) {
        var /** @type {?} */ shareUrl = this.prop.shareUrl + args.email;
        if (args.title) {
            shareUrl += '&subject=' + args.title;
        }
        shareUrl += '&body=';
        if (args.description) {
            shareUrl += args.description + ' %0A';
        }
        return shareUrl + url;
    };
    /**
     * @return {?}
     */
    EmailButton.prototype.count = function () {
        return Observable.empty();
    };
    return EmailButton;
}());

var CopyButton = (function () {
    /**
     * @param {?} prop
     */
    function CopyButton(prop) {
        this.prop = prop;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    CopyButton.prototype.link = function (url, args) {
        this.copyURLToClipboard(url, args.directive);
        return null;
    };
    /**
     * @return {?}
     */
    CopyButton.prototype.count = function () {
        return Observable.empty();
    };
    /**
     * copy URL to clipboard
     * @param {?} url
     * @param {?} directive
     * @return {?}
     */
    CopyButton.prototype.copyURLToClipboard = function (url, directive) {
        var _this = this;
        var /** @type {?} */ temp = { text: directive.shareButton.prop.text, icon: directive.shareButton.prop.icon };
        Observable.of({}).take(1).do(function () {
            url = decodeURIComponent(url);
            var /** @type {?} */ textArea = directive.renderer.createElement('textarea');
            // Place in top-left corner of screen regardless of scroll position.
            directive.renderer.setStyle(textArea, 'position', 'fixed');
            directive.renderer.setStyle(textArea, 'top', 0);
            directive.renderer.setStyle(textArea, 'left', 0);
            // Ensure it has a small width and height. Setting to 1px / 1em
            // doesn't work as directive gives a negative w/h on some browsers.
            directive.renderer.setStyle(textArea, 'width', '2em');
            directive.renderer.setStyle(textArea, 'height', '2em');
            // We don't need padding, reducing the size if it does flash render
            directive.renderer.setStyle(textArea, 'padding', 0);
            // Clean up any borders.
            directive.renderer.setStyle(textArea, 'border', 'none');
            directive.renderer.setStyle(textArea, 'outline', 'none');
            directive.renderer.setStyle(textArea, 'boxShadow', 'none');
            // Avoid flash of white box if rendered for any reason.
            directive.renderer.setStyle(textArea, 'background', 'transparent');
            directive.renderer.setProperty(textArea, 'value', url);
            directive.renderer.appendChild(directive.el, textArea);
            textArea.select();
            document.execCommand('copy');
            directive.renderer.removeChild(directive.el, textArea);
            directive.shareButton.prop.text = _this.prop.successText;
            directive.shareButton.prop.icon = _this.prop.successIcon;
            directive.cd.markForCheck();
        }, function () {
            directive.shareButton.prop.text = _this.prop.failText;
            directive.shareButton.prop.icon = _this.prop.failIcon;
            directive.cd.markForCheck();
            console.warn('[ShareButtons]: Print button could not copy URL to clipboard');
        })
            .delay(2000)
            .do(function () {
            directive.shareButton.prop.text = temp.text;
            directive.shareButton.prop.icon = temp.icon;
            directive.cd.markForCheck();
        })
            .subscribe();
    };
    return CopyButton;
}());

var PrintButton = (function () {
    /**
     * @param {?} prop
     */
    function PrintButton(prop) {
        this.prop = prop;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    PrintButton.prototype.link = function (url, args) {
        args.directive.window.print();
        return null;
    };
    /**
     * @return {?}
     */
    PrintButton.prototype.count = function () {
        return Observable.empty();
    };
    return PrintButton;
}());

/** VK DOCS: https://vk.com/dev/widget_share */
var VKontakteButton = (function () {
    /**
     * @param {?} prop
     */
    function VKontakteButton(prop) {
        this.prop = prop;
    }
    /**
     * @param {?} url
     * @param {?=} args
     * @return {?}
     */
    VKontakteButton.prototype.link = function (url, args) {
        return this.prop.shareUrl + url;
    };
    /**
     * @return {?}
     */
    VKontakteButton.prototype.count = function () {
        return Observable.empty();
    };
    return VKontakteButton;
}());

var Buttons = {
    facebook: {
        type: 'facebook',
        text: 'Facebook',
        icon: 'fa fa-facebook',
        color: '#3b5998',
        supportCount: true,
        shareUrl: 'https://www.facebook.com/sharer/sharer.php?u=',
        androidUrl: 'com.facebook.katana',
        iosUrl: 'fb://',
        countUrl: 'https://graph.facebook.com?id='
    },
    twitter: {
        type: 'twitter',
        text: 'Twitter',
        icon: 'fa fa-twitter',
        color: '#00acee',
        supportCount: false,
        shareUrl: 'https://twitter.com/intent/tweet?url=',
        androidUrl: 'com.twitter.package',
        iosUrl: 'twitter://tweet?url='
    },
    google: {
        type: 'google',
        text: 'Google+',
        icon: 'fa fa-google-plus',
        color: '#DB4437',
        supportCount: false,
        shareUrl: 'https://plus.google.com/share?url=',
        androidUrl: '',
        iosUrl: '',
    },
    linkedin: {
        type: 'linkedin',
        text: 'LinkedIn',
        icon: 'fa fa-linkedin',
        color: '#006fa6',
        supportCount: true,
        shareUrl: 'http://www.linkedin.com/shareArticle?url=',
        androidUrl: 'com.linkedin.android',
        iosUrl: 'linkedin://',
        countUrl: 'https://www.linkedin.com/countserv/count/share?url='
    },
    pinterest: {
        type: 'pinterest',
        text: 'Pinterest',
        icon: 'fa fa-pinterest-p',
        color: '#BD091D',
        supportCount: true,
        shareUrl: 'https://in.pinterest.com/pin/create/button/?url=',
        androidUrl: '',
        iosUrl: '',
        countUrl: 'https://api.pinterest.com/v1/urls/count.json?callback=receiveCount&url='
    },
    reddit: {
        type: 'reddit',
        text: 'Reddit',
        icon: 'fa fa-reddit-alien',
        color: '#FF4006',
        supportCount: true,
        shareUrl: 'http://www.reddit.com/submit?url=',
        androidUrl: '',
        iosUrl: '',
        countUrl: 'https://buttons.reddit.com/button_info.json?url='
    },
    tumblr: {
        type: 'tumblr',
        text: 'Tumblr',
        icon: 'fa fa-tumblr',
        color: '#36465D',
        supportCount: true,
        shareUrl: 'http://tumblr.com/widgets/share/tool?canonicalUrl=',
        androidUrl: '',
        iosUrl: '',
        countUrl: 'https://api.tumblr.com/v2/share/stats?url='
    },
    print: {
        type: 'print',
        text: 'Print',
        icon: 'fa fa-print',
        color: 'brown',
        supportCount: false
    },
    stumble: {
        type: 'stumble',
        text: 'Stumble',
        icon: 'fa fa-stumbleupon',
        color: '#eb4924',
        supportCount: false,
        shareUrl: 'http://www.stumbleupon.com/submit?url=',
        androidUrl: '',
        iosUrl: ''
    },
    telegram: {
        type: 'telegram',
        text: 'Telegram',
        icon: 'fa fa-send',
        color: '#0088cc',
        supportCount: false,
        shareUrl: 'https://t.me/share/url?url=',
        androidUrl: '',
        iosUrl: ''
    },
    vk: {
        type: 'vk',
        text: 'VKontakte',
        icon: 'fa fa-vk',
        color: '#4C75A3',
        supportCount: false,
        shareUrl: 'http://vk.com/share.php?url=',
        androidUrl: '',
        iosUrl: ''
    },
    copy: {
        type: 'copy',
        text: 'Copy link',
        successText: 'Copied',
        successIcon: 'fa fa-check',
        failText: 'Error',
        failIcon: 'fa fa-exclamation',
        icon: 'fa fa-link',
        color: '#607D8B',
        supportCount: false
    },
    whatsapp: {
        type: 'whatsapp',
        text: 'WhatsApp',
        icon: 'fa fa-whatsapp',
        color: '#25D366',
        supportCount: false,
        shareUrl: 'https://web.whatsapp.com/send?text=',
        androidUrl: 'com.whatsapp.package',
        iosUrl: 'whatsapp://?text='
    },
    email: {
        type: 'email',
        text: 'Email',
        icon: 'fa fa-envelope',
        color: '#32A1A3',
        supportCount: false,
        shareUrl: 'mailto:?'
    }
};

var OPTIONS = new InjectionToken('OPTIONS');
var BUTTONS_META = new InjectionToken('BUTTONS_META');

var ShareButtonsService = (function () {
    /**
     * @param {?} http
     * @param {?} options
     * @param {?} meta
     */
    function ShareButtonsService(http, options, meta) {
        this.http = http;
        /**
         * All buttons
         */
        this.allButtons = [
            'facebook',
            'twitter',
            'linkedin',
            'pinterest',
            'google',
            'stumble',
            'reddit',
            'whatsapp',
            'tumblr',
            'vk',
            'telegram',
            'email',
            'copy',
            'print'
        ];
        /**
         * Default options
         */
        this.options = {
            theme: 'default',
            dialogWidth: 500,
            dialogHeight: 400,
            include: this.allButtons,
            exclude: [],
            size: 0,
            title: null,
            image: null,
            description: null,
            tags: null,
            gaTracking: false,
            twitterAccount: null
        };
        /**
         * Button's meta data such as icon,color and text of each button
         */
        this.meta = Buttons;
        /** Override global options with user's preference */
        this.options = mergeDeep(this.options, options);
        this.meta = mergeDeep(this.meta, meta);
    }
    Object.defineProperty(ShareButtonsService.prototype, "twitterAccount", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.twitterAccount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsService.prototype, "dialogSize", {
        /**
         * @return {?}
         */
        get: function () {
            return "width=" + this.options.dialogWidth + ", height=" + this.options.dialogHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsService.prototype, "buttons", {
        /**
         * Get all wanted buttons
         * @return {?}
         */
        get: function () {
            var _this = this;
            if (!this.options.exclude.length) {
                return this.options.include;
            }
            return this.options.include.filter(function (btn) { return _this.options.exclude.indexOf(btn) < 0; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsService.prototype, "theme", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.theme;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsService.prototype, "title", {
        /**
         * Global meta tags
         * @return {?}
         */
        get: function () {
            return this.options.title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsService.prototype, "description", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsService.prototype, "image", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.image;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsService.prototype, "tags", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.tags;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsService.prototype, "gaTracking", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.gaTracking;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsService.prototype, "size", {
        /**
         * @return {?}
         */
        get: function () {
            return this.options.size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} buttonName
     * @return {?}
     */
    ShareButtonsService.prototype.createShareButton = function (buttonName) {
        switch (buttonName.toLowerCase()) {
            case this.meta.facebook.type:
                return new FacebookButton(this.meta.facebook, this.http);
            case this.meta.twitter.type:
                return new TwitterButton(this.meta.twitter);
            case this.meta.google.type:
                return new GoogleButton(this.meta.google, this.http);
            case this.meta.pinterest.type:
                return new PinterestButton(this.meta.pinterest, this.http);
            case this.meta.linkedin.type:
                return new LinkedinButton(this.meta.linkedin, this.http);
            case this.meta.reddit.type:
                return new RedditButton(this.meta.reddit, this.http);
            case this.meta.tumblr.type:
                return new TumblrButton(this.meta.tumblr, this.http);
            case this.meta.stumble.type:
                return new StumbleButton(this.meta.stumble);
            case this.meta.whatsapp.type:
                return new WhatsappButton(this.meta.whatsapp);
            case this.meta.vk.type:
                return new VKontakteButton(this.meta.vk);
            case this.meta.telegram.type:
                return new TelegramButton(this.meta.telegram);
            case this.meta.email.type:
                return new EmailButton(this.meta.email);
            case this.meta.copy.type:
                return new CopyButton(this.meta.copy);
            case this.meta.print.type:
                return new PrintButton(this.meta.print);
            default:
                return null;
        }
    };
    /**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     *
     * @return {?}
     */
    ShareButtonsService.prototype.getMobileOS = function () {
        // const userAgent = navigator.userAgent || navigator.vendor || (window || global).opera;
        // Windows Phone must come first because its UA also contains "Android"
        // if (/windows phone/i.test(userAgent)) {
        //   return 'WindowsPhone';
        // }
        // if (/android/i.test(userAgent)) {
        //   return 'Android';
        // }
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        // if (/iPad|iPhone|iPod/.test(userAgent) && !(window || global).MSStream) {
        //   return 'iOS';
        // }
        return undefined;
    };
    return ShareButtonsService;
}());
ShareButtonsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ShareButtonsService.ctorParameters = function () { return [
    { type: HttpClient, },
    { type: undefined, decorators: [{ type: Inject, args: [OPTIONS,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [BUTTONS_META,] },] },
]; };
/**
 * Simple object check.
 * @param {?} item
 * @return {?}
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
/**
 * Deep merge two objects.
 * @param {?} target
 * @param {...?} sources
 * @return {?}
 */
function mergeDeep(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (!sources.length) {
        return target;
    }
    var /** @type {?} */ source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (var /** @type {?} */ key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, (_a = {}, _a[key] = {}, _a));
                }
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, (_b = {}, _b[key] = source[key], _b));
            }
        }
    }
    return mergeDeep.apply(void 0, [target].concat(sources));
    var _a, _b;
}

var UniversalSupportService = (function () {
    function UniversalSupportService() {
    }
    Object.defineProperty(UniversalSupportService.prototype, "nativeWindow", {
        /**
         * @return {?}
         */
        get: function () {
            try {
                return window;
            }
            catch (e) {
                return global;
            }
        },
        enumerable: true,
        configurable: true
    });
    return UniversalSupportService;
}());
UniversalSupportService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
UniversalSupportService.ctorParameters = function () { return []; };

var ShareButtonDirective = (function () {
    /**
     * @param {?} share
     * @param {?} renderer
     * @param {?} cd
     * @param {?} el
     * @param {?} universal
     */
    function ShareButtonDirective(share, renderer, cd, el, universal) {
        this.share = share;
        this.renderer = renderer;
        this.cd = cd;
        /**
         * Share meta tags
         */
        this.sbTitle = this.share.title;
        this.sbDescription = this.share.description;
        this.sbImage = this.share.image;
        this.sbTags = this.share.tags;
        /**
         * Google analytics tracking
         */
        this.gaTracking = this.share.gaTracking;
        /**
         * Share count event
         */
        this.sbCount = new EventEmitter();
        /**
         * Share dialog opened event
         */
        this.sbOpened = new EventEmitter();
        /**
         * Share dialog closed event
         */
        this.sbClosed = new EventEmitter();
        this.el = el.nativeElement;
        this.window = universal.nativeWindow;
    }
    Object.defineProperty(ShareButtonDirective.prototype, "createButton", {
        /**
         * Set share button e.g facebook, twitter...etc
         * @param {?} buttonName
         * @return {?}
         */
        set: function (buttonName) {
            /**
             * Create a new button of type <buttonName>
             */
            var button = this.share.createShareButton(buttonName);
            if (button) {
                this.shareButton = button;
                /** Remove old button class in case user changed the button */
                this.renderer.removeClass(this.el, 'sb-' + this.buttonClass);
                /** Add new button class e.g.: sb-facebook, sb-twitter ...etc */
                this.renderer.addClass(this.el, 'sb-' + button.prop.type);
                /** Keep a copy of current class */
                this.buttonClass = button.prop.type;
                /** Get link's shared count */
                this.getCount();
            }
            else {
                throw new Error("[ShareButtons]: The share button \"" + buttonName + "\" does not exist. Make sure the button name is correct!");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonDirective.prototype, "sbUrl", {
        /**
         * Set share URL
         * @param {?} url
         * @return {?}
         */
        set: function (url) {
            /** Check if current URL equals previous URL */
            if (url !== this.url) {
                this.url = this.validateUrl(url);
                this.getCount();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Open share dialog
     * @return {?}
     */
    ShareButtonDirective.prototype.onClick = function () {
        var _this = this;
        /** Set user did not set the url using [sbUrl], use window URL */
        if (!this.url) {
            this.url = encodeURIComponent(this.window.location.href);
        }
        /**
         * Get sharing link
         */
        var shareUrl = this.shareButton.link(this.url, {
            title: this.sbTitle,
            description: this.sbDescription,
            image: this.sbImage,
            tags: this.sbTags,
            mobile: this.share.getMobileOS(),
            via: this.share.twitterAccount,
            directive: this
        });
        /** GA tracking */
        if (this.gaTracking && typeof ga !== 'undefined') {
            ga('send', 'social', this.shareButton.prop.type, 'click', this.url);
        }
        var /** @type {?} */ popUp;
        if (shareUrl) {
            /** Open share dialog */
            popUp = this.window.open(shareUrl, 'newwindow', this.share.dialogSize);
        }
        /** Emit opened dialog type */
        this.sbOpened.emit(this.shareButton.prop.type);
        /** If dialog closed event has subscribers, emit closed dialog type */
        if (this.sbClosed.observers.length && popUp) {
            var /** @type {?} */ pollTimer_1 = this.window.setInterval(function () {
                if (popUp.closed) {
                    _this.window.clearInterval(pollTimer_1);
                    _this.sbClosed.emit(_this.shareButton.prop.type);
                }
            }, 200);
        }
    };
    /**
     * @return {?}
     */
    ShareButtonDirective.prototype.getCount = function () {
        var _this = this;
        /** Only if share count has observers & the button has support for share count */
        if (this.url && this.sbCount.observers.length && this.shareButton.prop.supportCount) {
            /** Emit share count to (sbCount) Output */
            this.shareButton.count(this.url).subscribe(function (count) { return _this.sbCount.emit(count); });
        }
    };
    /**
     * @param {?} url
     * @return {?}
     */
    ShareButtonDirective.prototype.validateUrl = function (url) {
        /** Use encodeURIComponent to let URLs with the hash location strategy to work in tweets */
        if (url) {
            var /** @type {?} */ r = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            if (r.test(url)) {
                return encodeURIComponent(url);
            }
            console.warn("[ShareButtons]: The share URL \"" + url + "\" is invalid!");
        }
        /** fallback to current page URL */
        return encodeURIComponent(this.window.location.href);
    };
    return ShareButtonDirective;
}());
ShareButtonDirective.decorators = [
    { type: Directive, args: [{
                selector: '[shareButton]'
            },] },
];
/**
 * @nocollapse
 */
ShareButtonDirective.ctorParameters = function () { return [
    { type: ShareButtonsService, },
    { type: Renderer2, },
    { type: ChangeDetectorRef, },
    { type: ElementRef, },
    { type: UniversalSupportService, },
]; };
ShareButtonDirective.propDecorators = {
    'sbTitle': [{ type: Input },],
    'sbDescription': [{ type: Input },],
    'sbImage': [{ type: Input },],
    'sbTags': [{ type: Input },],
    'createButton': [{ type: Input, args: ['shareButton',] },],
    'sbUrl': [{ type: Input },],
    'gaTracking': [{ type: Input },],
    'sbCount': [{ type: Output },],
    'sbOpened': [{ type: Output },],
    'sbClosed': [{ type: Output },],
    'onClick': [{ type: HostListener, args: ['click',] },],
};

var NFormatterPipe = (function () {
    function NFormatterPipe() {
    }
    /**
     * @param {?} num
     * @param {?=} digits
     * @return {?}
     */
    NFormatterPipe.prototype.transform = function (num, digits) {
        if (typeof num !== 'number') {
            num = 1;
        }
        return nFormatter(num, digits);
    };
    return NFormatterPipe;
}());
NFormatterPipe.decorators = [
    { type: Pipe, args: [{
                name: 'nFormatter'
            },] },
];
/**
 * @nocollapse
 */
NFormatterPipe.ctorParameters = function () { return []; };
/**
 * Change share counts to a readable number e.g 35.6k
 */
var nFormatter = function (num, digits) {
    var si = [
        { value: 1E18, symbol: 'E' },
        { value: 1E15, symbol: 'P' },
        { value: 1E12, symbol: 'T' },
        { value: 1E9, symbol: 'G' },
        { value: 1E6, symbol: 'M' },
        { value: 1E3, symbol: 'K' }
    ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    for (var i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
        }
    }
    return num.toFixed(digits).replace(rx, '$1');
};

/**
 * @param {?} httpClient
 * @param {?} options
 * @param {?} buttonsMeta
 * @return {?}
 */
function ShareButtonsFactory$2(httpClient, options, buttonsMeta) {
    return new ShareButtonsService(httpClient, options, buttonsMeta);
}
var ShareDirectiveModule = (function () {
    function ShareDirectiveModule() {
    }
    /**
     * @param {?=} options
     * @param {?=} buttonsMeta
     * @return {?}
     */
    ShareDirectiveModule.forRoot = function (options, buttonsMeta) {
        return {
            ngModule: ShareDirectiveModule,
            providers: [
                { provide: OPTIONS, useValue: options },
                { provide: BUTTONS_META, useValue: buttonsMeta },
                {
                    provide: ShareButtonsService,
                    useFactory: ShareButtonsFactory$2,
                    deps: [HttpClient, OPTIONS, BUTTONS_META]
                }
            ]
        };
    };
    return ShareDirectiveModule;
}());
ShareDirectiveModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ShareButtonDirective,
                    NFormatterPipe
                ],
                imports: [
                    CommonModule
                ],
                exports: [
                    CommonModule,
                    ShareButtonDirective,
                    NFormatterPipe
                ],
                providers: [UniversalSupportService]
            },] },
];
/**
 * @nocollapse
 */
ShareDirectiveModule.ctorParameters = function () { return []; };

var ShareButtonComponent = (function () {
    /**
     * @param {?} cd
     * @param {?} share
     */
    function ShareButtonComponent(cd, share) {
        this.cd = cd;
        this.share = share;
        /**
         * Show button icon
         */
        this.showIcon = true;
        /**
         * Show button name
         */
        this.showName = false;
        /**
         * Button size
         */
        this.size = this.share.size;
        /**
         * Get and display share count
         */
        this.showCount = false;
        /**
         * Set theme as button class
         */
        this.buttonClass = 'sb-button sb-' + this.share.theme;
        /**
         * Share count event
         */
        this.count = new EventEmitter();
        /**
         * Share dialog opened event
         */
        this.opened = new EventEmitter();
        /**
         * Share dialog closed event
         */
        this.closed = new EventEmitter();
    }
    Object.defineProperty(ShareButtonComponent.prototype, "createButton", {
        /**
         * @param {?} button
         * @return {?}
         */
        set: function (button) {
            this.shareCount = 0;
            this.button = button;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonComponent.prototype, "setUrl", {
        /**
         * on set share URL
         * @param {?} newUrl
         * @return {?}
         */
        set: function (newUrl) {
            /** Reset share count when url changes */
            this.shareCount = 0;
            this.url = newUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonComponent.prototype, "setShowCount", {
        /**
         * @param {?} show
         * @return {?}
         */
        set: function (show) {
            var _this = this;
            this.showCount = show;
            /** Subscribe to count event */
            /** Check if sbCount has observers already, don't subscribe again */
            if (!this.shareDirective.sbCount.observers.length) {
                /** Subscribe to the directive count's event only if 'show' is true or 'sbCount' has observers */
                if (this.showCount || this.count.observers.length) {
                    this.shareDirective.sbCount.subscribe(function (count) {
                        _this.shareCount = count;
                        _this.count.emit(count);
                        _this.cd.markForCheck();
                    });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonComponent.prototype, "setTheme", {
        /**
         * Button theme
         * @param {?} theme
         * @return {?}
         */
        set: function (theme) {
            this.buttonClass = 'sb-button sb-' + theme;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ShareButtonComponent.prototype.ngOnDestroy = function () {
        this.shareDirective.sbCount.complete();
    };
    return ShareButtonComponent;
}());
ShareButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-button',
                template: "\n    <button class=\"sb-wrapper\"\n            [shareButton]=\"button\"\n            [sbUrl]=\"url\"\n            [sbImage]=\"image\"\n            [sbTitle]=\"title\"\n            [sbDescription]=\"description\"\n            [sbTags]=\"tags\"\n            (sbOpened)=\"opened.emit($event)\"\n            (sbClosed)=\"closed.emit($event)\"\n            [class.sb-show-count]=\"showCount && shareCount\"\n            [class.sb-show-template]=\"template.innerText?.length\"\n            [class.sb-show-text]=\"showName && !template.childElementCount\"\n            [class.sb-show-icon]=\"showIcon && !template.childElementCount\"\n            [style.fontSize.px]=\"(1 + size/20) * 14\">\n\n      <div class=\"sb-inner\">\n\n        <!-- HIDE BUTTON'S ICON AND TEXT IF CUSTOM TEMPLATE IS USED -->\n\n        <div class=\"sb-content\" *ngIf=\"!template.childElementCount\">\n\n          <!-- BUTTON ICON -->\n          <div *ngIf=\"showIcon\" class=\"sb-icon\">\n            <i [class]=\"shareDirective.shareButton.prop.icon\" aria-hidden=\"true\"></i>\n          </div>\n\n          <!-- BUTTON TEXT -->\n          <div *ngIf=\"showName\" class=\"sb-text\">\n            {{ shareDirective.shareButton.prop.text }}\n          </div>\n\n        </div>\n\n        <!-- FOR CUSTOM TEMPLATE -->\n        <div #template class=\"sb-template\">\n          <ng-content></ng-content>\n        </div>\n\n        <!-- BUTTON COUNT -->\n        <div *ngIf=\"showCount && shareCount\" class=\"sb-count\">\n          <span>{{ shareCount | nFormatter }}</span>\n        </div>\n\n      </div>\n    </button>\n  ",
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
ShareButtonComponent.ctorParameters = function () { return [
    { type: ChangeDetectorRef, },
    { type: ShareButtonsService, },
]; };
ShareButtonComponent.propDecorators = {
    'createButton': [{ type: Input, args: ['button',] },],
    'setUrl': [{ type: Input, args: ['url',] },],
    'title': [{ type: Input },],
    'description': [{ type: Input },],
    'image': [{ type: Input },],
    'tags': [{ type: Input },],
    'showIcon': [{ type: Input },],
    'showName': [{ type: Input },],
    'size': [{ type: Input },],
    'setShowCount': [{ type: Input, args: ['showCount',] },],
    'setTheme': [{ type: Input, args: ['theme',] },],
    'buttonClass': [{ type: HostBinding, args: ['class',] },],
    'count': [{ type: Output },],
    'opened': [{ type: Output },],
    'closed': [{ type: Output },],
    'shareDirective': [{ type: ViewChild, args: [ShareButtonDirective,] },],
    'template': [{ type: ViewChild, args: ['template',] },],
};

/**
 * @param {?} httpClient
 * @param {?} options
 * @param {?} buttonsMeta
 * @return {?}
 */
function ShareButtonsFactory$1(httpClient, options, buttonsMeta) {
    return new ShareButtonsService(httpClient, options, buttonsMeta);
}
var ShareButtonModule = (function () {
    function ShareButtonModule() {
    }
    /**
     * @param {?=} options
     * @param {?=} buttonsMeta
     * @return {?}
     */
    ShareButtonModule.forRoot = function (options, buttonsMeta) {
        return {
            ngModule: ShareButtonModule,
            providers: [
                { provide: OPTIONS, useValue: options },
                { provide: BUTTONS_META, useValue: buttonsMeta },
                {
                    provide: ShareButtonsService,
                    useFactory: ShareButtonsFactory$1,
                    deps: [HttpClient, OPTIONS, BUTTONS_META]
                }
            ]
        };
    };
    return ShareButtonModule;
}());
ShareButtonModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ShareButtonComponent
                ],
                imports: [
                    ShareDirectiveModule
                ],
                exports: [
                    ShareDirectiveModule,
                    ShareButtonComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
ShareButtonModule.ctorParameters = function () { return []; };

var ShareButtonsComponent = (function () {
    /**
     * @param {?} cd
     * @param {?} share
     */
    function ShareButtonsComponent(cd, share) {
        this.cd = cd;
        this.share = share;
        /**
         * Share Buttons array
         */
        this.buttons = [];
        /**
         * Buttons to include
         */
        this.includeButtons = this.share.buttons;
        /**
         * Buttons to exclude
         */
        this.excludeButtons = [];
        /**
         * Number of shown buttons
         */
        this.shownButtons = this.includeButtons.length;
        /**
         * Disable more/less buttons
         */
        this.showAll = false;
        /**
         * Show button icon
         */
        this.showIcon = true;
        /**
         * Show button name
         */
        this.showName = false;
        /**
         * Get and display share count
         */
        this.showCount = false;
        /**
         * Set theme as buttons' container class
         */
        this.containerClass = 'sb-group sb-' + this.share.theme;
        /**
         * Share count event
         */
        this.count = new EventEmitter();
        /**
         * Share dialog opened event
         */
        this.opened = new EventEmitter();
        /**
         * Share dialog closed event
         */
        this.closed = new EventEmitter();
    }
    Object.defineProperty(ShareButtonsComponent.prototype, "include", {
        /**
         * @param {?} includeButtons
         * @return {?}
         */
        set: function (includeButtons) {
            var _this = this;
            this.includeButtons = includeButtons;
            this.buttons = this.includeButtons.filter(function (btn) { return _this.excludeButtons.indexOf(btn) < 0; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsComponent.prototype, "exclude", {
        /**
         * @param {?} excludeButtons
         * @return {?}
         */
        set: function (excludeButtons) {
            var _this = this;
            this.excludeButtons = excludeButtons;
            this.buttons = this.includeButtons.filter(function (btn) { return _this.excludeButtons.indexOf(btn) < 0; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsComponent.prototype, "setShownButtons", {
        /**
         * @param {?} shownCount
         * @return {?}
         */
        set: function (shownCount) {
            this.shownButtons = shownCount;
            this.totalButtons = this.buttons.length;
            /** Set showAll to true if shown buttons count = selected buttons count */
            this.showAll = this.shownButtons === this.totalButtons + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsComponent.prototype, "setUrl", {
        /**
         * Set share URL
         * @param {?} newUrl
         * @return {?}
         */
        set: function (newUrl) {
            /** Reset share count on url changes */
            this.shareCount = 0;
            this.url = newUrl;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsComponent.prototype, "setShowCount", {
        /**
         * @param {?} show
         * @return {?}
         */
        set: function (show) {
            var _this = this;
            this.showCount = show;
            if (this.shareComponents) {
                /** Subscribe to count event */
                this.shareComponents.forEach(function (shareComponent) {
                    /** Check if sbCount has observers already, don't subscribe again */
                    if (!shareComponent.count.observers.length) {
                        /** Subscribe to the component count event (only if [showCount]=true) */
                        if (show || _this.count.observers.length) {
                            shareComponent.count.subscribe(function (count) {
                                _this.shareCount = count;
                                _this.count.emit(count);
                                _this.cd.markForCheck();
                            });
                        }
                    }
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShareButtonsComponent.prototype, "setTheme", {
        /**
         * @param {?} theme
         * @return {?}
         */
        set: function (theme) {
            /** Set buttons' theme to override the default theme */
            this.theme = theme;
            /** Set buttons' container theme */
            this.containerClass = 'sb-group sb-' + theme;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ShareButtonsComponent.prototype.ngOnInit = function () {
        var _this = this;
        /**  if use didn't select the buttons use all */
        if (!this.excludeButtons.length) {
            this.buttons = this.includeButtons.filter(function (btn) { return _this.excludeButtons.indexOf(btn) < 0; });
        }
    };
    /**
     * @return {?}
     */
    ShareButtonsComponent.prototype.ngOnDestroy = function () {
        this.shareComponents.forEach(function (shareComponent) {
            shareComponent.count.unsubscribe();
        });
    };
    /**
     * @return {?}
     */
    ShareButtonsComponent.prototype.more = function () {
        this.totalButtons = this.shownButtons;
        this.shownButtons = this.buttons.length;
        this.showAll = true;
    };
    /**
     * @return {?}
     */
    ShareButtonsComponent.prototype.less = function () {
        this.shownButtons = this.totalButtons;
        this.showAll = false;
    };
    return ShareButtonsComponent;
}());
ShareButtonsComponent.decorators = [
    { type: Component, args: [{
                selector: 'share-buttons',
                template: "\n    <share-button *ngFor=\"let button of buttons | slice: 0:shownButtons\" \n      [button]=\"button\" \n      [theme]=\"theme\"\n      [url]=\"url\"\n      [title]=\"title\"\n      [description]=\"description\" \n      [image]=\"image\" \n      [tags]=\"tags\" \n      [showCount]=\"showCount\" \n      [showIcon]=\"showIcon\" \n      [showName]=\"showName\"\n      [size]=\"size\" \n      (opened)=\"opened.emit($event)\" \n      (closed)=\"closed.emit($event)\"></share-button>\n\n    <div [class]=\"'sb-button sb-' + theme\" \n      [style.fontSize.px]=\"(1 + size/20) * 14\">\n\n      <!-- SHOW LESS BUTTON -->\n\n      <button *ngIf=\"showAll && shownButtons === buttons.length\" \n              class=\"sb-wrapper sb-more sb-show-icon\" (click)=\"less()\">\n\n        <div class=\"sb-inner\">\n          <div class=\"sb-content\">\n            <div class=\"sb-icon\"><i class=\"fa fa-minus\" aria-hidden=\"true\"></i></div>\n          </div>\n        </div>\n      </button>\n\n      <!-- SHOW MORE BUTTON -->\n\n        <button *ngIf=\"!showAll && shownButtons < buttons.length\"\n                class=\"sb-wrapper sb-more sb-show-icon\" (click)=\"more()\">\n      \n          <div class=\"sb-inner\">\n            <div class=\"sb-content\">\n              <div class=\"sb-icon\"><i class=\"fa fa-ellipsis-h\" aria-hidden=\"true\"></i></div>\n            </div>\n          </div>\n        </button>\n\n    </div>\n  ",
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
ShareButtonsComponent.ctorParameters = function () { return [
    { type: ChangeDetectorRef, },
    { type: ShareButtonsService, },
]; };
ShareButtonsComponent.propDecorators = {
    'include': [{ type: Input, args: ['include',] },],
    'exclude': [{ type: Input, args: ['exclude',] },],
    'setShownButtons': [{ type: Input, args: ['show',] },],
    'setUrl': [{ type: Input, args: ['url',] },],
    'title': [{ type: Input },],
    'description': [{ type: Input },],
    'image': [{ type: Input },],
    'tags': [{ type: Input },],
    'showIcon': [{ type: Input },],
    'showName': [{ type: Input },],
    'size': [{ type: Input },],
    'setShowCount': [{ type: Input, args: ['showCount',] },],
    'setTheme': [{ type: Input, args: ['theme',] },],
    'containerClass': [{ type: HostBinding, args: ['class',] },],
    'count': [{ type: Output },],
    'opened': [{ type: Output },],
    'closed': [{ type: Output },],
    'shareComponents': [{ type: ViewChildren, args: [ShareButtonComponent,] },],
};

/**
 * @param {?} httpClient
 * @param {?} options
 * @param {?} buttonsMeta
 * @return {?}
 */
function ShareButtonsFactory(httpClient, options, buttonsMeta) {
    return new ShareButtonsService(httpClient, options, buttonsMeta);
}
var ShareButtonsModule = (function () {
    function ShareButtonsModule() {
    }
    /**
     * @param {?=} options
     * @param {?=} buttonsMeta
     * @return {?}
     */
    ShareButtonsModule.forRoot = function (options, buttonsMeta) {
        return {
            ngModule: ShareButtonsModule,
            providers: [
                { provide: OPTIONS, useValue: options },
                { provide: BUTTONS_META, useValue: buttonsMeta },
                {
                    provide: ShareButtonsService,
                    useFactory: ShareButtonsFactory,
                    deps: [HttpClient, OPTIONS, BUTTONS_META]
                }
            ]
        };
    };
    return ShareButtonsModule;
}());
ShareButtonsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ShareButtonsComponent
                ],
                imports: [
                    ShareButtonModule
                ],
                exports: [
                    ShareButtonModule,
                    ShareButtonsComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
ShareButtonsModule.ctorParameters = function () { return []; };

/**
 * Generated bundle index. Do not edit.
 */

export { ShareButtonsModule, ShareButtonModule, ShareDirectiveModule, ShareButtonDirective, ShareButtonComponent, ShareButtonsComponent, ShareButtonsService, NFormatterPipe, ShareButtonsFactory$1 as ɵb, ShareButtonsFactory as ɵa, ShareButtonsFactory$2 as ɵc, BUTTONS_META as ɵf, OPTIONS as ɵe, UniversalSupportService as ɵg };
//# sourceMappingURL=ngx-sharebuttons.es5.js.map
