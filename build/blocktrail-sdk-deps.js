/** @preserve
 * jsPDF - PDF Document creation from JavaScript
 * Version 1.0.0-trunk Built on ${buildDate}
 * Commit ${commitID}
 *
 * Copyright (c) 2010-2014 James Hall, https://github.com/MrRio/jsPDF
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, willow-systems.com
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth, 
 */

/**
Creates new jsPDF document object instance
@class
@param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l")
@param unit Measurement unit to be used when coordinates are specified. One of "pt" (points), "mm" (Default), "cm", "in"
@param format One of 'a0', 'a1', 'a2', 'a3', 'a4' (Default) etc to 'a10', 'b0' to 'b10', 'c0' to 'c10', 'letter', 'government-letter', 'legal', 'junior-legal', 'ledger' or 'tabloid'
@returns {jsPDF}
@name jsPDF
*/
var jsPDF = (function (global) {
    'use strict';
    /*jslint browser:true, plusplus: true, bitwise: true, nomen: true */
    /*global document: false, btoa, atob, zpipe, Uint8Array, ArrayBuffer, Blob, saveAs, adler32cs, Deflater */

// this will run on <=IE9, possibly some niche browsers
// new webkit-based, FireFox, IE10 already have native version of this.
    if (typeof btoa === 'undefined') {
        global.btoa = function (data) {
        // DO NOT ADD UTF8 ENCODING CODE HERE!!!!

        // UTF8 encoding encodes bytes over char code 128
        // and, essentially, turns an 8-bit binary streams
        // (that base64 can deal with) into 7-bit binary streams.
        // (by default server does not know that and does not recode the data back to 8bit)
        // You destroy your data.

        // binary streams like jpeg image data etc, while stored in JavaScript strings,
        // (which are 16bit arrays) are in 8bit format already.
        // You do NOT need to char-encode that before base64 encoding.

        // if you, by act of fate
        // have string which has individual characters with code
        // above 255 (pure unicode chars), encode that BEFORE you base64 here.
        // you can use absolutely any approch there, as long as in the end,
        // base64 gets an 8bit (char codes 0 - 255) stream.
        // when you get it on the server after un-base64, you must
        // UNencode it too, to get back to 16, 32bit or whatever original bin stream.

        // Note, Yes, JavaScript strings are, in most cases UCS-2 -
        // 16-bit character arrays. This does not mean, however,
        // that you always have to UTF8 it before base64.
        // it means that if you have actual characters anywhere in
        // that string that have char code above 255, you need to
        // recode *entire* string from 16-bit (or 32bit) to 8-bit array.
        // You can do binary split to UTF16 (BE or LE)
        // you can do utf8, you can split the thing by hand and prepend BOM to it,
        // but whatever you do, make sure you mirror the opposite on
        // the server. If server does not expect to post-process un-base64
        // 8-bit binary stream, think very very hard about messing around with encoding.

        // so, long story short:
        // DO NOT ADD UTF8 ENCODING CODE HERE!!!!

        /* @preserve
        ====================================================================
        base64 encoder
        MIT, GPL

        version: 1109.2015
        discuss at: http://phpjs.org/functions/base64_encode
        +   original by: Tyler Akins (http://rumkin.com)
        +   improved by: Bayron Guevara
        +   improved by: Thunder.m
        +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        +   bugfixed by: Pellentesque Malesuada
        +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        +   improved by: Rafal Kukawski (http://kukawski.pl)
        +                Daniel Dotsenko, Willow Systems Corp, willow-systems.com
        ====================================================================
        */

            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                b64a = b64.split(''),
                o1,
                o2,
                o3,
                h1,
                h2,
                h3,
                h4,
                bits,
                i = 0,
                ac = 0,
                enc = "",
                tmp_arr = [],
                r;

            do { // pack three octets into four hexets
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hexets to index into b64, and append result to encoded string
                tmp_arr[ac++] = b64a[h1] + b64a[h2] + b64a[h3] + b64a[h4];
            } while (i < data.length);

            enc = tmp_arr.join('');
            r = data.length % 3;
            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
            // end of base64 encoder MIT, GPL
        };
    }

    if (typeof atob === 'undefined') {
        global.atob = function (data) {
        // http://kevin.vanzonneveld.net
        // +   original by: Tyler Akins (http://rumkin.com)
        // +   improved by: Thunder.m
        // +      input by: Aman Gupta
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // +   bugfixed by: Pellentesque Malesuada
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
        // *     returns 1: 'Kevin van Zonneveld'
        // mozilla has this native
        // - but breaks in 2.0.0.12!
        //if (typeof this.global['atob'] == 'function') {
        //    return atob(data);
        //}
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                o1,
                o2,
                o3,
                h1,
                h2,
                h3,
                h4,
                bits,
                i = 0,
                ac = 0,
                dec = "",
                tmp_arr = [];

            if (!data) {
                return data;
            }

            data += '';

            do { // unpack four hexets into three octets using index points in b64
                h1 = b64.indexOf(data.charAt(i++));
                h2 = b64.indexOf(data.charAt(i++));
                h3 = b64.indexOf(data.charAt(i++));
                h4 = b64.indexOf(data.charAt(i++));

                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                o1 = bits >> 16 & 0xff;
                o2 = bits >> 8 & 0xff;
                o3 = bits & 0xff;

                if (h3 === 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1);
                } else if (h4 === 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2);
                } else {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                }
            } while (i < data.length);
            dec = tmp_arr.join('');
            return dec;
        };
    }

    var getObjectLength = typeof Object.keys === 'function' ?
                function (object) {
                    return Object.keys(object).length;
                } :
                function (object) {
                    var i = 0, e;
                    for (e in object) {
                        if (object.hasOwnProperty(e)) {
                            i++;
                        }
                    }
                    return i;
                };

/**
PubSub implementation

@class
@name PubSub
*/
        global.PubSub = function (context) {
            /**  @preserve
            -----------------------------------------------------------------------------------------------
            JavaScript PubSub library
            2012 (c) ddotsenko@willowsystems.com
            based on Peter Higgins (dante@dojotoolkit.org)
            Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.
            Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
            http://dojofoundation.org/license for more information.
            -----------------------------------------------------------------------------------------------
            */
            /**
            @private
            @fieldOf PubSub
            */
            this.topics = {};
            /**
            Stores what will be `this` within the callback functions.

            @private
            @fieldOf PubSub#
            */
            this.context = context;
            /**
            Allows caller to emit an event and pass arguments to event listeners.
            @public
            @function
            @param topic {String} Name of the channel on which to voice this event
            @param args Any number of arguments you want to pass to the listeners of this event.
            @methodOf PubSub#
            @name publish
            */
            this.publish = function (topic, args) {
                if (this.topics[topic]) {
                    var currentTopic = this.topics[topic],
                        toremove = [],
                        fn,
                        i,
                        l,
                        pair,
                        emptyFunc = function () {};
                    args = Array.prototype.slice.call(arguments, 1);
                    for (i = 0, l = currentTopic.length; i < l; i++) {
                        pair = currentTopic[i]; // this is a [function, once_flag] array
                        fn = pair[0];
                        if (pair[1]) { /* 'run once' flag set */
                            pair[0] = emptyFunc;
                            toremove.push(i);
                        }
                        fn.apply(this.context, args);
                    }
                    for (i = 0, l = toremove.length; i < l; i++) {
                        currentTopic.splice(toremove[i], 1);
                    }
                }
            };
            /**
            Allows listener code to subscribe to channel and be called when data is available
            @public
            @function
            @param topic {String} Name of the channel on which to voice this event
            @param callback {Function} Executable (function pointer) that will be ran when event is voiced on this channel.
            @param once {Boolean} (optional. False by default) Flag indicating if the function is to be triggered only once.
            @returns {Object} A token object that cen be used for unsubscribing.
            @methodOf PubSub#
            @name subscribe
            */
            this.subscribe = function (topic, callback, once) {
                if (!this.topics[topic]) {
                    this.topics[topic] = [[callback, once]];
                } else {
                    this.topics[topic].push([callback, once]);
                }
                return {
                    "topic": topic,
                    "callback": callback
                };
            };
            /**
            Allows listener code to unsubscribe from a channel
            @public
            @function
            @param token {Object} A token object that was returned by `subscribe` method
            @methodOf PubSub#
            @name unsubscribe
            */
            this.unsubscribe = function (token) {
                if (this.topics[token.topic]) {
                    var currentTopic = this.topics[token.topic], i, l;

                    for (i = 0, l = currentTopic.length; i < l; i++) {
                        if (currentTopic[i][0] === token.callback) {
                            currentTopic.splice(i, 1);
                        }
                    }
                }
            };
        };


/**
@constructor
@private
*/
    function jsPDF(orientation, unit, format, compressPdf) { /** String orientation, String unit, String format, Boolean compressed */
        var options = {};

        if (typeof orientation === 'object') {
            options = orientation;

            orientation = options.orientation;
            unit        = options.unit || unit;
            format      = options.format || format;
            compressPdf = options.compress || options.compressPdf || compressPdf;
        }

        // Default parameter values
        if (typeof orientation === 'undefined') {
            orientation = 'p';
        } else {
            orientation = orientation.toString().toLowerCase();
        }
        if (typeof unit === 'undefined') { unit = 'mm'; }
        if (typeof format === 'undefined') { format = 'a4'; }
        if (typeof compressPdf === 'undefined' && typeof zpipe === 'undefined') { compressPdf = false; }

        var format_as_string = format.toString().toLowerCase(),
            content = [],
            content_length = 0,
            compress = compressPdf,
            pdfVersion = '1.3', // PDF Version
            pageFormats = { // Size in pt of various paper formats
                'a0': [2383.94, 3370.39],
                'a1': [1683.78, 2383.94],
                'a2': [1190.55, 1683.78],
                'a3': [841.89,  1190.55],
                'a4': [595.28,  841.89],
                'a5': [419.53,  595.28],
                'a6': [297.64,  419.53],
                'a7': [209.76,  297.64],
                'a8': [147.4 ,  209.76],
                'a9': [104.88,  147.4],
                'a10': [73.7,  104.88],
                'b0': [2834.65, 4008.19],
                'b1': [2004.09, 2834.65],
                'b2': [1417.32, 2004.09],
                'b3': [1000.63, 1417.32],
                'b4': [708.66,  1000.63],
                'b5': [498.9,  708.66],
                'b6': [354.33,  498.9],
                'b7': [249.45,  354.33],
                'b8': [175.75,  249.45],
                'b9': [124.72,  175.75],
                'b10': [87.87,  124.72],
                'c0': [2599.37, 3676.54],
                'c1': [1836.85, 2599.37],
                'c2': [1298.27, 1836.85],
                'c3': [918.43,  1298.27],
                'c4': [649.13,  918.43],
                'c5': [459.21,  649.13],
                'c6': [323.15,  459.21],
                'c7': [229.61,  323.15],
                'c8': [161.57,  229.61],
                'c9': [113.39,  161.57],
                'c10': [79.37,   113.39],
                'letter': [612, 792],
                'government-letter': [576, 756],
                'legal': [612, 1008],
                'junior-legal': [576, 360],
                'ledger': [1224, 792],
                'tabloid': [792, 1224]
            },
            textColor = options.textColor || '0 g',
            drawColor = options.drawColor || '0 G',
            page = 0,
            pages = [],
            objectNumber = 2, // 'n' Current object number
            outToPages = !!options.outToPages, // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
            offsets = [], // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
            fonts = {}, // collection of font objects, where key is fontKey - a dynamically created label for a given font.
            fontmap = {}, // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
            activeFontSize = options.fontSize || 16,
            activeFontKey, // will be string representing the KEY of the font as combination of fontName + fontStyle
            lineWidth = options.lineWidth || 0.200025, // 2mm
            lineHeightProportion = options.lineHeight || 1.15,
            pageHeight,
            pageWidth,
            k, // Scale factor
            documentProperties = {'title': '', 'subject': '', 'author': '', 'keywords': '', 'creator': ''},
            lineCapID = 0,
            lineJoinID = 0,
            API = {},
            events = new PubSub(API),
            tmp,
            plugin,
            /////////////////////
            // Private functions
            /////////////////////
            // simplified (speedier) replacement for sprintf's %.2f conversion
            f2 = function (number) {
                return number.toFixed(2);
            },
            // simplified (speedier) replacement for sprintf's %.3f conversion
            f3 = function (number) {
                return number.toFixed(3);
            },
            // simplified (speedier) replacement for sprintf's %02d
            padd2 = function (number) {
                var n = (number).toFixed(0);
                if (number < 10) {
                    return '0' + n;
                } else {
                    return n;
                }
            },
            // simplified (speedier) replacement for sprintf's %02d
            padd10 = function (number) {
                var n = (number).toFixed(0);
                if (n.length < 10) {
                    return new Array( 11 - n.length ).join('0') + n;
                } else {
                    return n;
                }
            },
            out = function (string) {
                if (outToPages) { /* set by beginPage */
                    pages[page].push(string);
                } else {
                    content.push(string);
                    content_length += string.length + 1; // +1 is for '\n' that will be used to join contents of content
                }
            },
            newObject = function () {
                // Begin a new object
                objectNumber++;
                offsets[objectNumber] = content_length;
                out(objectNumber + ' 0 obj');
                return objectNumber;
            },
            putStream = function (str) {
                out('stream');
                out(str);
                out('endstream');
            },
            wPt,
            hPt,
            kids,
            i,
            putPages = function () {
                wPt = pageWidth * k;
                hPt = pageHeight * k;

                // outToPages = false as set in endDocument(). out() writes to content.

                var n, p, arr, uint, i, deflater, adler32;
                for (n = 1; n <= page; n++) {
                    newObject();
                    out('<</Type /Page');
                    out('/Parent 1 0 R');
                    out('/Resources 2 0 R');
                    out('/Contents ' + (objectNumber + 1) + ' 0 R>>');
                    out('endobj');

                    // Page content
                    p = pages[n].join('\n');
                    newObject();
                    if (compress) {
                        arr = [];
                        for (i = 0; i < p.length; ++i) {
                            arr[i] = p.charCodeAt(i);
                        }
                        adler32 = adler32cs.from(p);
                        deflater = new Deflater(6);
                        deflater.append(new Uint8Array(arr));
                        p = deflater.flush();
                        arr = [new Uint8Array([120, 156]), new Uint8Array(p),
                               new Uint8Array([adler32 & 0xFF, (adler32 >> 8) & 0xFF, (adler32 >> 16) & 0xFF, (adler32 >> 24) & 0xFF])];
                        p = '';
                        for (i in arr) {
                            if (arr.hasOwnProperty(i)) {
                                p += String.fromCharCode.apply(null, arr[i]);
                            }
                        }
                        out('<</Length ' + p.length  + ' /Filter [/FlateDecode]>>');
                    } else {
                        out('<</Length ' + p.length  + '>>');
                    }
                    putStream(p);
                    out('endobj');
                }
                offsets[1] = content_length;
                out('1 0 obj');
                out('<</Type /Pages');
                kids = '/Kids [';
                for (i = 0; i < page; i++) {
                    kids += (3 + 2 * i) + ' 0 R ';
                }
                out(kids + ']');
                out('/Count ' + page);
                out('/MediaBox [0 0 ' + f2(wPt) + ' ' + f2(hPt) + ']');
                out('>>');
                out('endobj');
            },
            putFont = function (font) {
                font.objectNumber = newObject();
                out('<</BaseFont/' + font.PostScriptName + '/Type/Font');
                if (typeof font.encoding === 'string') {
                    out('/Encoding/' + font.encoding);
                }
                out('/Subtype/Type1>>');
                out('endobj');
            },
            putFonts = function () {
                var fontKey;
                for (fontKey in fonts) {
                    if (fonts.hasOwnProperty(fontKey)) {
                        putFont(fonts[fontKey]);
                    }
                }
            },
            putXobjectDict = function () {
                // Loop through images, or other data objects
                events.publish('putXobjectDict');
            },
            putResourceDictionary = function () {
                out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
                out('/Font <<');
                // Do this for each font, the '1' bit is the index of the font
                var fontKey;
                for (fontKey in fonts) {
                    if (fonts.hasOwnProperty(fontKey)) {
                        out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R');
                    }
                }
                out('>>');
                out('/XObject <<');
                putXobjectDict();
                out('>>');
            },
            putResources = function () {
                putFonts();
                events.publish('putResources');
                // Resource dictionary
                offsets[2] = content_length;
                out('2 0 obj');
                out('<<');
                putResourceDictionary();
                out('>>');
                out('endobj');
                events.publish('postPutResources');
            },
            addToFontDictionary = function (fontKey, fontName, fontStyle) {
                // this is mapping structure for quick font key lookup.
                // returns the KEY of the font (ex: "F1") for a given pair of font name and type (ex: "Arial". "Italic")
                var undef;
                if (fontmap[fontName] === undef) {
                    fontmap[fontName] = {}; // fontStyle is a var interpreted and converted to appropriate string. don't wrap in quotes.
                }
                fontmap[fontName][fontStyle] = fontKey;
            },
            /**
            FontObject describes a particular font as member of an instnace of jsPDF

            It's a collection of properties like 'id' (to be used in PDF stream),
            'fontName' (font's family name), 'fontStyle' (font's style variant label)

            @class
            @public
            @property id {String} PDF-document-instance-specific label assinged to the font.
            @property PostScriptName {String} PDF specification full name for the font
            @property encoding {Object} Encoding_name-to-Font_metrics_object mapping.
            @name FontObject
            */
            FontObject = {},
            addFont = function (PostScriptName, fontName, fontStyle, encoding) {
                var fontKey = 'F' + (getObjectLength(fonts) + 1).toString(10),
                    // This is FontObject
                    font = fonts[fontKey] = {
                        'id': fontKey,
                        // , 'objectNumber':   will be set by putFont()
                        'PostScriptName': PostScriptName,
                        'fontName': fontName,
                        'fontStyle': fontStyle,
                        'encoding': encoding,
                        'metadata': {}
                    };

                addToFontDictionary(fontKey, fontName, fontStyle);

                events.publish('addFont', font);

                return fontKey;
            },
            addFonts = function () {

                var HELVETICA = "helvetica",
                    TIMES = "times",
                    COURIER = "courier",
                    NORMAL = "normal",
                    BOLD = "bold",
                    ITALIC = "italic",
                    BOLD_ITALIC = "bolditalic",
                    encoding = 'StandardEncoding',
                    standardFonts = [
                        ['Helvetica', HELVETICA, NORMAL],
                        ['Helvetica-Bold', HELVETICA, BOLD],
                        ['Helvetica-Oblique', HELVETICA, ITALIC],
                        ['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC],
                        ['Courier', COURIER, NORMAL],
                        ['Courier-Bold', COURIER, BOLD],
                        ['Courier-Oblique', COURIER, ITALIC],
                        ['Courier-BoldOblique', COURIER, BOLD_ITALIC],
                        ['Times-Roman', TIMES, NORMAL],
                        ['Times-Bold', TIMES, BOLD],
                        ['Times-Italic', TIMES, ITALIC],
                        ['Times-BoldItalic', TIMES, BOLD_ITALIC]
                    ],
                    i,
                    l,
                    fontKey,
                    parts;
                for (i = 0, l = standardFonts.length; i < l; i++) {
                    fontKey = addFont(
                        standardFonts[i][0],
                        standardFonts[i][1],
                        standardFonts[i][2],
                        encoding
                    );

                    // adding aliases for standard fonts, this time matching the capitalization
                    parts = standardFonts[i][0].split('-');
                    addToFontDictionary(fontKey, parts[0], parts[1] || '');
                }

                events.publish('addFonts', {'fonts': fonts, 'dictionary': fontmap});
            },
            /**

            @public
            @function
            @param text {String}
            @param flags {Object} Encoding flags.
            @returns {String} Encoded string
            */
            to8bitStream = function (text, flags) {
                /* PDF 1.3 spec:
                "For text strings encoded in Unicode, the first two bytes must be 254 followed by
                255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
                with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
                to be a meaningful beginning of a word or phrase.) The remainder of the
                string consists of Unicode character codes, according to the UTF-16 encoding
                specified in the Unicode standard, version 2.0. Commonly used Unicode values
                are represented as 2 bytes per character, with the high-order byte appearing first
                in the string."

                In other words, if there are chars in a string with char code above 255, we
                recode the string to UCS2 BE - string doubles in length and BOM is prepended.

                HOWEVER!
                Actual *content* (body) text (as opposed to strings used in document properties etc)
                does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)

                Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
                a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
                fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
                code page. There, however, all characters in the stream are treated as GIDs,
                including BOM, which is the reason we need to skip BOM in content text (i.e. that
                that is tied to a font).

                To signal this "special" PDFEscape / to8bitStream handling mode,
                API.text() function sets (unless you overwrite it with manual values
                given to API.text(.., flags) )
                    flags.autoencode = true
                    flags.noBOM = true

                */

                /*
                `flags` properties relied upon:
                .sourceEncoding = string with encoding label.
                    "Unicode" by default. = encoding of the incoming text.
                    pass some non-existing encoding name
                    (ex: 'Do not touch my strings! I know what I am doing.')
                    to make encoding code skip the encoding step.
                .outputEncoding = Either valid PDF encoding name
                    (must be supported by jsPDF font metrics, otherwise no encoding)
                    or a JS object, where key = sourceCharCode, value = outputCharCode
                    missing keys will be treated as: sourceCharCode === outputCharCode
                .noBOM
                    See comment higher above for explanation for why this is important
                .autoencode
                    See comment higher above for explanation for why this is important
                */

                var i, l, undef, sourceEncoding, encodingBlock, outputEncoding, newtext, isUnicode, ch, bch;

                if (flags === undef) {
                    flags = {};
                }

                sourceEncoding = flags.sourceEncoding ? sourceEncoding : 'Unicode';

                outputEncoding = flags.outputEncoding;

                // This 'encoding' section relies on font metrics format
                // attached to font objects by, among others,
                // "Willow Systems' standard_font_metrics plugin"
                // see jspdf.plugin.standard_font_metrics.js for format
                // of the font.metadata.encoding Object.
                // It should be something like
                //   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
                //   .widths = {0:width, code:width, ..., 'fof':divisor}
                //   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
                if ((flags.autoencode || outputEncoding) &&
                        fonts[activeFontKey].metadata &&
                        fonts[activeFontKey].metadata[sourceEncoding] &&
                        fonts[activeFontKey].metadata[sourceEncoding].encoding
                        ) {
                    encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

                    // each font has default encoding. Some have it clearly defined.
                    if (!outputEncoding && fonts[activeFontKey].encoding) {
                        outputEncoding = fonts[activeFontKey].encoding;
                    }

                    // Hmmm, the above did not work? Let's try again, in different place.
                    if (!outputEncoding && encodingBlock.codePages) {
                        outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
                    }

                    if (typeof outputEncoding === 'string') {
                        outputEncoding = encodingBlock[outputEncoding];
                    }
                    // we want output encoding to be a JS Object, where
                    // key = sourceEncoding's character code and
                    // value = outputEncoding's character code.
                    if (outputEncoding) {
                        isUnicode = false;
                        newtext = [];
                        for (i = 0, l = text.length; i < l; i++) {
                            ch = outputEncoding[text.charCodeAt(i)];
                            if (ch) {
                                newtext.push(
                                    String.fromCharCode(ch)
                                );
                            } else {
                                newtext.push(
                                    text[i]
                                );
                            }

                            // since we are looping over chars anyway, might as well
                            // check for residual unicodeness
                            if (newtext[i].charCodeAt(0) >> 8) { /* more than 255 */
                                isUnicode = true;
                            }
                        }
                        text = newtext.join('');
                    }
                }

                i = text.length;
                // isUnicode may be set to false above. Hence the triple-equal to undefined
                while (isUnicode === undef && i !== 0) {
                    if (text.charCodeAt(i - 1) >> 8) { /* more than 255 */
                        isUnicode = true;
                    }
                    i--;
                }
                if (!isUnicode) {
                    return text;
                } else {
                    newtext = flags.noBOM ? [] : [254, 255];
                    for (i = 0, l = text.length; i < l; i++) {
                        ch = text.charCodeAt(i);
                        bch = ch >> 8; // divide by 256
                        if (bch >> 8) { /* something left after dividing by 256 second time */
                            throw new Error("Character at position " + i.toString(10) + " of string '" + text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
                        }
                        newtext.push(bch);
                        newtext.push(ch - (bch << 8));
                    }
                    return String.fromCharCode.apply(undef, newtext);
                }
            },
            // Replace '/', '(', and ')' with pdf-safe versions
            pdfEscape = function (text, flags) {
                // doing to8bitStream does NOT make this PDF display unicode text. For that
                // we also need to reference a unicode font and embed it - royal pain in the rear.

                // There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
                // which JavaScript Strings are happy to provide. So, while we still cannot display
                // 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
                // 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
                // is still parseable.
                // This will allow immediate support for unicode in document properties strings.
                return to8bitStream(text, flags).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
            },
            putInfo = function () {
                out('/Producer (jsPDF ' + jsPDF.version + ')');
                if (documentProperties.title) {
                    out('/Title (' + pdfEscape(documentProperties.title) + ')');
                }
                if (documentProperties.subject) {
                    out('/Subject (' + pdfEscape(documentProperties.subject) + ')');
                }
                if (documentProperties.author) {
                    out('/Author (' + pdfEscape(documentProperties.author) + ')');
                }
                if (documentProperties.keywords) {
                    out('/Keywords (' + pdfEscape(documentProperties.keywords) + ')');
                }
                if (documentProperties.creator) {
                    out('/Creator (' + pdfEscape(documentProperties.creator) + ')');
                }
                var created = new Date();
                out('/CreationDate (D:' +
                    [
                        created.getFullYear(),
                        padd2(created.getMonth() + 1),
                        padd2(created.getDate()),
                        padd2(created.getHours()),
                        padd2(created.getMinutes()),
                        padd2(created.getSeconds())
                    ].join('') +
                    ')'
                    );
            },
            putCatalog = function () {
                out('/Type /Catalog');
                out('/Pages 1 0 R');
                // @TODO: Add zoom and layout modes
                out('/OpenAction [3 0 R /FitH null]');
                out('/PageLayout /OneColumn');
                events.publish('putCatalog');
            },
            putTrailer = function () {
                out('/Size ' + (objectNumber + 1));
                out('/Root ' + objectNumber + ' 0 R');
                out('/Info ' + (objectNumber - 1) + ' 0 R');
            },
            beginPage = function () {
                page++;
                // Do dimension stuff
                outToPages = true;
                pages[page] = [];
            },
            _addPage = function () {
                beginPage();
                // Set line width
                out(f2(lineWidth * k) + ' w');
                // Set draw color
                out(drawColor);
                // resurrecting non-default line caps, joins
                if (lineCapID !== 0) {
                    out(lineCapID.toString(10) + ' J');
                }
                if (lineJoinID !== 0) {
                    out(lineJoinID.toString(10) + ' j');
                }
                events.publish('addPage', {'pageNumber': page});
            },
            /**
            Returns a document-specific font key - a label assigned to a
            font name + font type combination at the time the font was added
            to the font inventory.

            Font key is used as label for the desired font for a block of text
            to be added to the PDF document stream.
            @private
            @function
            @param fontName {String} can be undefined on "falthy" to indicate "use current"
            @param fontStyle {String} can be undefined on "falthy" to indicate "use current"
            @returns {String} Font key.
            */
            getFont = function (fontName, fontStyle) {
                var key, undef;

                if (fontName === undef) {
                    fontName = fonts[activeFontKey].fontName;
                }
                if (fontStyle === undef) {
                    fontStyle = fonts[activeFontKey].fontStyle;
                }

                try {
                    key = fontmap[fontName][fontStyle]; // returns a string like 'F3' - the KEY corresponding tot he font + type combination.
                } catch (e) {
                    key = undef;
                }
                if (!key) {
                    throw new Error("Unable to look up font label for font '" + fontName + "', '" + fontStyle + "'. Refer to getFontList() for available fonts.");
                }

                return key;
            },
            buildDocument = function () {

                outToPages = false; // switches out() to content
                objectNumber = 2;
                content = [];
                offsets = [];

                // putHeader()
                out('%PDF-' + pdfVersion);

                putPages();

                putResources();

                // Info
                newObject();
                out('<<');
                putInfo();
                out('>>');
                out('endobj');

                // Catalog
                newObject();
                out('<<');
                putCatalog();
                out('>>');
                out('endobj');

                // Cross-ref
                var o = content_length, i;
                out('xref');
                out('0 ' + (objectNumber + 1));
                out('0000000000 65535 f ');
                for (i = 1; i <= objectNumber; i++) {
                    out(padd10(offsets[i]) + ' 00000 n ');
                }
                // Trailer
                out('trailer');
                out('<<');
                putTrailer();
                out('>>');
                out('startxref');
                out(o);
                out('%%EOF');

                outToPages = true;

                return content.join('\n');
            },
            getStyle = function (style) {
                // see Path-Painting Operators of PDF spec
                var op = 'S'; // stroke
                if (style === 'F') {
                    op = 'f'; // fill
                } else if (style === 'FD' || style === 'DF') {
                    op = 'B'; // both
                }
                return op;
            },
            getBlob = function () {
                var data, length, array, i, blob;
                data = buildDocument();

                // Need to add the file to BlobBuilder as a Uint8Array
                length = data.length;
                array = new Uint8Array(new ArrayBuffer(length));

                for (i = 0; i < length; i++) {
                    array[i] = data.charCodeAt(i);
                }

                blob = new Blob([array], {type: "application/pdf"});
                return blob;
            },
            /**
            Generates the PDF document.
            Possible values:
                datauristring (alias dataurlstring) - Data-Url-formatted data returned as string.
                datauri (alias datauri) - Data-Url-formatted data pushed into current global's location (effectively reloading the global with contents of the PDF).

            If `type` argument is undefined, output is raw body of resulting PDF returned as a string.

            @param {String} type A string identifying one of the possible output types.
            @param {Object} options An object providing some additional signalling to PDF generator.
            @function
            @returns {jsPDF}
            @methodOf jsPDF#
            @name output
            */
            output = function (type, options) {
                var undef;
                switch (type) {
                case undef:
                    return buildDocument();
                case 'save':
                    if (navigator.getUserMedia) {
                        if (global.URL === undefined) {
                            return API.output('dataurlnewwindow');
                        } else if (global.URL.createObjectURL === undefined) {
                            return API.output('dataurlnewwindow');
                        }
                    }
                    saveAs(getBlob(), options);
                    break;
                case 'blob':
                    return getBlob();
                case 'datauristring':
                case 'dataurlstring':
                    return 'data:application/pdf;base64,' + btoa(buildDocument());
                case 'datauri':
                case 'dataurl':
                    document.location.href = 'data:application/pdf;base64,' + btoa(buildDocument());
                    break;
                case 'dataurlnewwindow':
                    global.open('data:application/pdf;base64,' + btoa(buildDocument()));
                    break;
                default:
                    throw new Error('Output type "' + type + '" is not supported.');
                }
                // @TODO: Add different output options
            };

        if (unit === 'pt') {
            k = 1;
        } else if (unit === 'mm') {
            k = 72 / 25.4;
        } else if (unit === 'cm') {
            k = 72 / 2.54;
        } else if (unit === 'in') {
            k = 72;
        } else {
            throw ('Invalid unit: ' + unit);
        }

        // Dimensions are stored as user units and converted to points on output
        if (pageFormats.hasOwnProperty(format_as_string)) {
            pageHeight = pageFormats[format_as_string][1] / k;
            pageWidth = pageFormats[format_as_string][0] / k;
        } else {
            try {
                pageHeight = format[1];
                pageWidth = format[0];
            } catch (err) {
                throw ('Invalid format: ' + format);
            }
        }

        if (orientation === 'p' || orientation === 'portrait') {
            orientation = 'p';
            if (pageWidth > pageHeight) {
                tmp = pageWidth;
                pageWidth = pageHeight;
                pageHeight = tmp;
            }
        } else if (orientation === 'l' || orientation === 'landscape') {
            orientation = 'l';
            if (pageHeight > pageWidth) {
                tmp = pageWidth;
                pageWidth = pageHeight;
                pageHeight = tmp;
            }
        } else {
            throw ('Invalid orientation: ' + orientation);
        }



        //---------------------------------------
        // Public API

        /*
        Object exposing internal API to plugins
        @public
        */
        API.internal = {
            'pdfEscape': pdfEscape,
            'getStyle': getStyle,
            /**
            Returns {FontObject} describing a particular font.
            @public
            @function
            @param fontName {String} (Optional) Font's family name
            @param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
            @returns {FontObject}
            */
            'getFont': function () { return fonts[getFont.apply(API, arguments)]; },
            'getFontSize': function () { return activeFontSize;    },
            'getLineHeight': function () { return activeFontSize * lineHeightProportion;    },
            'btoa': btoa,
            'write': function (string1, string2, string3, etc) {
                out(
                    arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, ' ')
                );
            },
            'getCoordinateString': function (value) {
                return f2(value * k);
            },
            'getVerticalCoordinateString': function (value) {
                return f2((pageHeight - value) * k);
            },
            'collections': {},
            'newObject': newObject,
            'putStream': putStream,
            'events': events,
            // ratio that you use in multiplication of a given "size" number to arrive to 'point'
            // units of measurement.
            // scaleFactor is set at initialization of the document and calculated against the stated
            // default measurement units for the document.
            // If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
            // through multiplication.
            'scaleFactor': k,
            'pageSize': {'width': pageWidth, 'height': pageHeight},
            'output': function (type, options) {
                return output(type, options);
            },
            'getNumberOfPages': function () {return pages.length - 1; },
            'pages': pages
        };

        /**
        Adds (and transfers the focus to) new page to the PDF document.
        @function
        @returns {jsPDF}

        @methodOf jsPDF#
        @name addPage
         */
        API.addPage = function () {
            _addPage();
            return this;
        };

        /**
        Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
        @function
        @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Object} flags Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
        @returns {jsPDF}
        @methodOf jsPDF#
        @name text
         */
        API.text = function (text, x, y, flags, angle) {
            /**
             * Inserts something like this into PDF
                BT
                /F1 16 Tf  % Font name + size
                16 TL % How many units down for next line in multiline text
                0 g % color
                28.35 813.54 Td % position
                (line one) Tj
                T* (line two) Tj
                T* (line three) Tj
                ET
            */

            // Pre-August-2012 the order of arguments was function(x, y, text, flags)
            // in effort to make all calls have similar signature like
            //   function(data, coordinates... , miscellaneous)
            // this method had its args flipped.
            // code below allows backward compatibility with old arg order.
            if (typeof text === 'number') {
                var tmp = y;
                y = x;
                x = text;
                text = tmp;
            }

            // If there are any newlines in text, we assume
            // the user wanted to print multiple lines, so break the
            // text up into an array.  If the text is already an array,
            // we assume the user knows what they are doing.
            if (typeof text === 'string' && text.match(/[\n\r]/)) {
                text = text.split(/\r\n|\r|\n/g);
            }
            if(typeof flags === 'number') {
                angle = flags;
                flags = null;
            }
            var xtra = '', mode = 'Td';
            if(angle) {
                angle *= (Math.PI / 180);
                var c = Math.cos(angle), s = Math.sin(angle);
                xtra = [f2(c),f2(s),f2(s*-1),f2(c),''].join(" ");
                mode = 'Tm';
            }
            flags = flags || {};
            if(!('noBOM' in flags)) flags.noBOM = true;
            if(!('autoencode' in flags)) flags.autoencode = true;

            if (typeof text === 'string') {
                text = pdfEscape(text, flags);
            } else if (text instanceof Array) {  /* Array */
                // we don't want to destroy  original text array, so cloning it
                var sa = text.concat(), da = [], len = sa.length;
                // we do array.join('text that must not be PDFescaped")
                // thus, pdfEscape each component separately
                while(len--) {
                    da.push(pdfEscape( sa.shift(), flags));
                }
                text = da.join(") Tj\nT* (");
            } else {
                throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
            }
            // Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates

            // BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
            // if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations)
            // Thus, there is NO useful, *reliable* concept of "default" font for a page.
            // The fact that "default" (reuse font used before) font worked before in basic cases is an accident
            // - readers dealing smartly with brokenness of jsPDF's markup.
            out(
                'BT\n/' +
                    activeFontKey + ' ' + activeFontSize + ' Tf\n' + // font face, style, size
                    (activeFontSize * lineHeightProportion) + ' TL\n' + // line spacing
                    textColor +
                    '\n' + xtra + f2(x * k) + ' ' + f2((pageHeight - y) * k) + ' ' + mode + '\n(' +
                    text +
                    ') Tj\nET'
            );
            return this;
        };

        API.line = function (x1, y1, x2, y2) {
            out(
                f2(x1 * k) + ' ' + f2((pageHeight - y1) * k) + ' m ' +
                    f2(x2 * k) + ' ' + f2((pageHeight - y2) * k) + ' l S'
            );
            return this;
        };

        /**
        Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
        All data points in `lines` are relative to last line origin.
        `x`, `y` become x1,y1 for first line / curve in the set.
        For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
        For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.

        @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line
        @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
        @param {String} style One of 'S' (the default), 'F', 'FD' or 'DF'.  'S' draws just the curve. 'F' fills the region defined by the curves. 'DF' or 'FD' draws the curves and fills the region. 
        @param {Boolean} closed If true, the path is closed with a straight line from the end of the last curve to the starting point. 
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name lines
         */
        API.lines = function (lines, x, y, scale, style, closed) {
            var undef, _first, _second, _third, scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4;

            // Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
            // in effort to make all calls have similar signature like
            //   function(content, coordinateX, coordinateY , miscellaneous)
            // this method had its args flipped.
            // code below allows backward compatibility with old arg order.
            if (typeof lines === 'number') {
                _first = y;
                _second = lines;
                _third = x;

                lines = _first;
                x = _second;
                y = _third;
            }

            style = getStyle(style);
            scale = scale === undef ? [1, 1] : scale;

            // starting point
            out(f3(x * k) + ' ' + f3((pageHeight - y) * k) + ' m ');

            scalex = scale[0];
            scaley = scale[1];
            l = lines.length;
            //, x2, y2 // bezier only. In page default measurement "units", *after* scaling
            //, x3, y3 // bezier only. In page default measurement "units", *after* scaling
            // ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
            x4 = x; // last / ending point = starting point for first item.
            y4 = y; // last / ending point = starting point for first item.

            for (i = 0; i < l; i++) {
                leg = lines[i];
                if (leg.length === 2) {
                    // simple line
                    x4 = leg[0] * scalex + x4; // here last x4 was prior ending point
                    y4 = leg[1] * scaley + y4; // here last y4 was prior ending point
                    out(f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' l');
                } else {
                    // bezier curve
                    x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
                    y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
                    x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
                    y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
                    x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
                    y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
                    out(
                        f3(x2 * k) + ' ' +
                            f3((pageHeight - y2) * k) + ' ' +
                            f3(x3 * k) + ' ' +
                            f3((pageHeight - y3) * k) + ' ' +
                            f3(x4 * k) + ' ' +
                            f3((pageHeight - y4) * k) + ' c'
                    );
                }
            }

            if (closed == true) {
                out(' h');
            }

            // stroking / filling / both the path
            out(style);
            return this;
        };

        /**
        Adds a rectangle to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} w Width (in units declared at inception of PDF document)
        @param {Number} h Height (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name rect
         */
        API.rect = function (x, y, w, h, style) {
            var op = getStyle(style);
            out([
                f2(x * k),
                f2((pageHeight - y) * k),
                f2(w * k),
                f2(-h * k),
                're',
                op
            ].join(' '));
            return this;
        };

        /**
        Adds a triangle to PDF

        @param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name triangle
         */
        API.triangle = function (x1, y1, x2, y2, x3, y3, style) {
            this.lines(
                [
                    [ x2 - x1, y2 - y1 ], // vector to point 2
                    [ x3 - x2, y3 - y2 ], // vector to point 3
                    [ x1 - x3, y1 - y3 ] // closing vector back to point 1
                ],
                x1,
                y1, // start of path
                [1, 1],
                style,
                true
            );
            return this;
        };

        /**
        Adds a rectangle with rounded corners to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} w Width (in units declared at inception of PDF document)
        @param {Number} h Height (in units declared at inception of PDF document)
        @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
        @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name roundedRect
        */
        API.roundedRect = function (x, y, w, h, rx, ry, style) {
            var MyArc = 4 / 3 * (Math.SQRT2 - 1);
            this.lines(
                [
                    [ (w - 2 * rx), 0 ],
                    [ (rx * MyArc), 0, rx, ry - (ry * MyArc), rx, ry ],
                    [ 0, (h - 2 * ry) ],
                    [ 0, (ry * MyArc), -(rx * MyArc), ry, -rx, ry],
                    [ (-w + 2 * rx), 0],
                    [ -(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry],
                    [ 0, (-h + 2 * ry)],
                    [ 0, -(ry * MyArc), (rx * MyArc), -ry, rx, -ry]
                ],
                x + rx,
                y, // start of path
                [1, 1],
                style
            );
            return this;
        };

        /**
        Adds an ellipse to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
        @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name ellipse
         */
        API.ellipse = function (x, y, rx, ry, style) {
            var op = getStyle(style),
                lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
                ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

            out([
                f2((x + rx) * k),
                f2((pageHeight - y) * k),
                'm',
                f2((x + rx) * k),
                f2((pageHeight - (y - ly)) * k),
                f2((x + lx) * k),
                f2((pageHeight - (y - ry)) * k),
                f2(x * k),
                f2((pageHeight - (y - ry)) * k),
                'c'
            ].join(' '));
            out([
                f2((x - lx) * k),
                f2((pageHeight - (y - ry)) * k),
                f2((x - rx) * k),
                f2((pageHeight - (y - ly)) * k),
                f2((x - rx) * k),
                f2((pageHeight - y) * k),
                'c'
            ].join(' '));
            out([
                f2((x - rx) * k),
                f2((pageHeight - (y + ly)) * k),
                f2((x - lx) * k),
                f2((pageHeight - (y + ry)) * k),
                f2(x * k),
                f2((pageHeight - (y + ry)) * k),
                'c'
            ].join(' '));
            out([
                f2((x + lx) * k),
                f2((pageHeight - (y + ry)) * k),
                f2((x + rx) * k),
                f2((pageHeight - (y + ly)) * k),
                f2((x + rx) * k),
                f2((pageHeight - y) * k),
                'c',
                op
            ].join(' '));
            return this;
        };

        /**
        Adds an circle to PDF

        @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
        @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
        @param {Number} r Radius (in units declared at inception of PDF document)
        @param {String} style (Defaults to active fill/stroke style) A string signalling if stroke, fill or both are to be applied.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name circle
         */
        API.circle = function (x, y, r, style) {
            return this.ellipse(x, y, r, r, style);
        };

        /**
        Adds a properties to the PDF document

        @param {Object} A property_name-to-property_value object structure.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setProperties
         */
        API.setProperties = function (properties) {
            // copying only those properties we can render.
            var property;
            for (property in documentProperties) {
                if (documentProperties.hasOwnProperty(property) && properties[property]) {
                    documentProperties[property] = properties[property];
                }
            }
            return this;
        };

        /**
        Sets font size for upcoming text elements.

        @param {Number} size Font size in points.
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setFontSize
         */
        API.setFontSize = function (size) {
            activeFontSize = size;
            return this;
        };

        /**
        Sets text font face, variant for upcoming text elements.
        See output of jsPDF.getFontList() for possible font names, styles.

        @param {String} fontName Font name or family. Example: "times"
        @param {String} fontStyle Font style or variant. Example: "italic"
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setFont
         */
        API.setFont = function (fontName, fontStyle) {
            activeFontKey = getFont(fontName, fontStyle);
            // if font is not found, the above line blows up and we never go further
            return this;
        };

        /**
        Switches font style or variant for upcoming text elements,
        while keeping the font face or family same.
        See output of jsPDF.getFontList() for possible font names, styles.

        @param {String} style Font style or variant. Example: "italic"
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setFontStyle
         */
        API.setFontStyle = API.setFontType = function (style) {
            var undef;
            activeFontKey = getFont(undef, style);
            // if font is not found, the above line blows up and we never go further
            return this;
        };

        /**
        Returns an object - a tree of fontName to fontStyle relationships available to
        active PDF document.

        @public
        @function
        @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
        @methodOf jsPDF#
        @name getFontList
        */
        API.getFontList = function () {
            // TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
            var list = {},
                fontName,
                fontStyle,
                tmp;

            for (fontName in fontmap) {
                if (fontmap.hasOwnProperty(fontName)) {
                    list[fontName] = tmp = [];
                    for (fontStyle in fontmap[fontName]) {
                        if (fontmap[fontName].hasOwnProperty(fontStyle)) {
                            tmp.push(fontStyle);
                        }
                    }
                }
            }

            return list;
        };

        /**
        Sets line width for upcoming lines.

        @param {Number} width Line width (in units declared at inception of PDF document)
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setLineWidth
         */
        API.setLineWidth = function (width) {
            out((width * k).toFixed(2) + ' w');
            return this;
        };

        /**
        Sets the stroke color for upcoming elements.

        Depending on the number of arguments given, Gray, RGB, or CMYK
        color space is implied.

        When only ch1 is given, "Gray" color space is implied and it
        must be a value in the range from 0.00 (solid black) to to 1.00 (white)
        if values are communicated as String types, or in range from 0 (black)
        to 255 (white) if communicated as Number type.
        The RGB-like 0-255 range is provided for backward compatibility.

        When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
        value must be in the range from 0.00 (minimum intensity) to to 1.00
        (max intensity) if values are communicated as String types, or
        from 0 (min intensity) to to 255 (max intensity) if values are communicated
        as Number types.
        The RGB-like 0-255 range is provided for backward compatibility.

        When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
        value must be a in the range from 0.00 (0% concentration) to to
        1.00 (100% concentration)

        Because JavaScript treats fixed point numbers badly (rounds to
        floating point nearest to binary representation) it is highly advised to
        communicate the fractional numbers as String types, not JavaScript Number type.

        @param {Number|String} ch1 Color channel value
        @param {Number|String} ch2 Color channel value
        @param {Number|String} ch3 Color channel value
        @param {Number|String} ch4 Color channel value

        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setDrawColor
         */
        API.setDrawColor = function (ch1, ch2, ch3, ch4) {
            var color;
            if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
                // Gray color space.
                if (typeof ch1 === 'string') {
                    color = ch1 + ' G';
                } else {
                    color = f2(ch1 / 255) + ' G';
                }
            } else if (ch4 === undefined) {
                // RGB
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, 'RG'].join(' ');
                } else {
                    color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'RG'].join(' ');
                }
            } else {
                // CMYK
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, ch4, 'K'].join(' ');
                } else {
                    color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'K'].join(' ');
                }
            }

            out(color);
            return this;
        };

        /**
        Sets the fill color for upcoming elements.

        Depending on the number of arguments given, Gray, RGB, or CMYK
        color space is implied.

        When only ch1 is given, "Gray" color space is implied and it
        must be a value in the range from 0.00 (solid black) to to 1.00 (white)
        if values are communicated as String types, or in range from 0 (black)
        to 255 (white) if communicated as Number type.
        The RGB-like 0-255 range is provided for backward compatibility.

        When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
        value must be in the range from 0.00 (minimum intensity) to to 1.00
        (max intensity) if values are communicated as String types, or
        from 0 (min intensity) to to 255 (max intensity) if values are communicated
        as Number types.
        The RGB-like 0-255 range is provided for backward compatibility.

        When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
        value must be a in the range from 0.00 (0% concentration) to to
        1.00 (100% concentration)

        Because JavaScript treats fixed point numbers badly (rounds to
        floating point nearest to binary representation) it is highly advised to
        communicate the fractional numbers as String types, not JavaScript Number type.

        @param {Number|String} ch1 Color channel value
        @param {Number|String} ch2 Color channel value
        @param {Number|String} ch3 Color channel value
        @param {Number|String} ch4 Color channel value

        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setFillColor
         */
        API.setFillColor = function (ch1, ch2, ch3, ch4) {
            var color;

            if (ch2 === undefined || (ch4 === undefined && ch1 === ch2 === ch3)) {
                // Gray color space.
                if (typeof ch1 === 'string') {
                    color = ch1 + ' g';
                } else {
                    color = f2(ch1 / 255) + ' g';
                }
            } else if (ch4 === undefined) {
                // RGB
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, 'rg'].join(' ');
                } else {
                    color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'rg'].join(' ');
                }
            } else {
                // CMYK
                if (typeof ch1 === 'string') {
                    color = [ch1, ch2, ch3, ch4, 'k'].join(' ');
                } else {
                    color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'k'].join(' ');
                }
            }

            out(color);
            return this;
        };

        /**
        Sets the text color for upcoming elements.
        If only one, first argument is given,
        treats the value as gray-scale color value.

        @param {Number} r Red channel color value in range 0-255 or {String} r color value in hexadecimal, example: '#FFFFFF'
        @param {Number} g Green channel color value in range 0-255
        @param {Number} b Blue channel color value in range 0-255
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setTextColor
        */
        API.setTextColor = function (r, g, b) {
            var patt = /#[0-9A-Fa-f]{6}/;
            if ((typeof r == 'string') && patt.test(r)) {
                var hex = r.replace('#','');
                var bigint = parseInt(hex, 16);
                r = (bigint >> 16) & 255;
                g = (bigint >> 8) & 255;
                b = bigint & 255;
            }

            if ((r === 0 && g === 0 && b === 0) || (typeof g === 'undefined')) {
                textColor = f3(r / 255) + ' g';
            } else {
                textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
            }
            return this;
        };

        /**
        Is an Object providing a mapping from human-readable to
        integer flag values designating the varieties of line cap
        and join styles.

        @returns {Object}
        @fieldOf jsPDF#
        @name CapJoinStyles
        */
        API.CapJoinStyles = {
            0: 0,
            'butt': 0,
            'but': 0,
            'miter': 0,
            1: 1,
            'round': 1,
            'rounded': 1,
            'circle': 1,
            2: 2,
            'projecting': 2,
            'project': 2,
            'square': 2,
            'bevel': 2
        };

        /**
        Sets the line cap styles
        See {jsPDF.CapJoinStyles} for variants

        @param {String|Number} style A string or number identifying the type of line cap
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setLineCap
        */
        API.setLineCap = function (style) {
            var id = this.CapJoinStyles[style];
            if (id === undefined) {
                throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
            }
            lineCapID = id;
            out(id.toString(10) + ' J');

            return this;
        };

        /**
        Sets the line join styles
        See {jsPDF.CapJoinStyles} for variants

        @param {String|Number} style A string or number identifying the type of line join
        @function
        @returns {jsPDF}
        @methodOf jsPDF#
        @name setLineJoin
        */
        API.setLineJoin = function (style) {
            var id = this.CapJoinStyles[style];
            if (id === undefined) {
                throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
            }
            lineJoinID = id;
            out(id.toString(10) + ' j');

            return this;
        };

        // Output is both an internal (for plugins) and external function
        API.output = output;

        /**
         * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
         * @param  {String} filename The filename including extension.
         *
         * @function
         * @returns {jsPDF}
         * @methodOf jsPDF#
         * @name save
         */
        API.save = function (filename) {
            API.output('save', filename);
        };

        // applying plugins (more methods) ON TOP of built-in API.
        // this is intentional as we allow plugins to override
        // built-ins
        for (plugin in jsPDF.API) {
            if (jsPDF.API.hasOwnProperty(plugin)) {
                if (plugin === 'events' && jsPDF.API.events.length) {
                    (function (events, newEvents) {

                        // jsPDF.API.events is a JS Array of Arrays
                        // where each Array is a pair of event name, handler
                        // Events were added by plugins to the jsPDF instantiator.
                        // These are always added to the new instance and some ran
                        // during instantiation.

                        var eventname, handler_and_args, i;

                        for (i = newEvents.length - 1; i !== -1; i--) {
                            // subscribe takes 3 args: 'topic', function, runonce_flag
                            // if undefined, runonce is false.
                            // users can attach callback directly,
                            // or they can attach an array with [callback, runonce_flag]
                            // that's what the "apply" magic is for below.
                            eventname = newEvents[i][0];
                            handler_and_args = newEvents[i][1];
                            events.subscribe.apply(
                                events,
                                [eventname].concat(
                                    typeof handler_and_args === 'function' ?
                                            [ handler_and_args ] :
                                            handler_and_args
                                )
                            );
                        }
                    }(events, jsPDF.API.events));
                } else {
                    API[plugin] = jsPDF.API[plugin];
                }
            }
        }

        /////////////////////////////////////////
        // continuing initilisation of jsPDF Document object
        /////////////////////////////////////////


        // Add the first page automatically
        addFonts();
        activeFontKey = 'F1';
        _addPage();

        events.publish('initialized');

        return API;
    }

/**
jsPDF.API is a STATIC property of jsPDF class.
jsPDF.API is an object you can add methods and properties to.
The methods / properties you add will show up in new jsPDF objects.

One property is prepopulated. It is the 'events' Object. Plugin authors can add topics, callbacks to this object. These will be reassigned to all new instances of jsPDF.
Examples:
    jsPDF.API.events['initialized'] = function(){ 'this' is API object }
    jsPDF.API.events['addFont'] = function(added_font_object){ 'this' is API object }

@static
@public
@memberOf jsPDF
@name API

@example
    jsPDF.API.mymethod = function(){
        // 'this' will be ref to internal API object. see jsPDF source
        // , so you can refer to built-in methods like so:
        //     this.line(....)
        //     this.text(....)
    }
    var pdfdoc = new jsPDF()
    pdfdoc.mymethod() // <- !!!!!!
*/
    jsPDF.API = {'events': []};
    jsPDF.version = "1.0.0-trunk";

    if (typeof define === 'function') {
        define(function(){return jsPDF});
    } else {
        global.jsPDF = jsPDF;
    }
    return jsPDF;
}(self));

/** @preserve 
jsPDF split_text_to_size plugin
Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
MIT license.
*/
/**
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

;(function(API) {
'use strict'

/**
Returns an array of length matching length of the 'word' string, with each
cell ocupied by the width of the char in that position.

@function
@param word {String}
@param widths {Object}
@param kerning {Object}
@returns {Array}
*/
var getCharWidthsArray = API.getCharWidthsArray = function(text, options){

	if (!options) {
		options = {}
	}

	var widths = options.widths ? options.widths : this.internal.getFont().metadata.Unicode.widths
	, widthsFractionOf = widths.fof ? widths.fof : 1
	, kerning = options.kerning ? options.kerning : this.internal.getFont().metadata.Unicode.kerning
	, kerningFractionOf = kerning.fof ? kerning.fof : 1
	
	// console.log("widths, kergnings", widths, kerning)

	var i, l
	, char_code
	, char_width
	, prior_char_code = 0 // for kerning
	, default_char_width = widths[0] || widthsFractionOf
	, output = []

	for (i = 0, l = text.length; i < l; i++) {
		char_code = text.charCodeAt(i)
		output.push(
			( widths[char_code] || default_char_width ) / widthsFractionOf + 
			( kerning[char_code] && kerning[char_code][prior_char_code] || 0 ) / kerningFractionOf
		)
		prior_char_code = char_code
	}

	return output
}
var getArraySum = function(array){
	var i = array.length
	, output = 0
	while(i){
		;i--;
		output += array[i]
	}
	return output
}
/**
Returns a widths of string in a given font, if the font size is set as 1 point.

In other words, this is "proportional" value. For 1 unit of font size, the length
of the string will be that much.

Multiply by font size to get actual width in *points*
Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.

@public
@function
@param
@returns {Type}
*/
var getStringUnitWidth = API.getStringUnitWidth = function(text, options) {
	return getArraySum(getCharWidthsArray.call(this, text, options))
}

/** 
returns array of lines
*/
var splitLongWord = function(word, widths_array, firstLineMaxLen, maxLen){
	var answer = []

	// 1st, chop off the piece that can fit on the hanging line.
	var i = 0
	, l = word.length
	, workingLen = 0
	while (i !== l && workingLen + widths_array[i] < firstLineMaxLen){
		workingLen += widths_array[i]
		;i++;
	}
	// this is first line.
	answer.push(word.slice(0, i))

	// 2nd. Split the rest into maxLen pieces.
	var startOfLine = i
	workingLen = 0
	while (i !== l){
		if (workingLen + widths_array[i] > maxLen) {
			answer.push(word.slice(startOfLine, i))
			workingLen = 0
			startOfLine = i
		}
		workingLen += widths_array[i]
		;i++;
	}
	if (startOfLine !== i) {
		answer.push(word.slice(startOfLine, i))
	}

	return answer
}

// Note, all sizing inputs for this function must be in "font measurement units"
// By default, for PDF, it's "point".
var splitParagraphIntoLines = function(text, maxlen, options){
	// at this time works only on Western scripts, ones with space char
	// separating the words. Feel free to expand.

	if (!options) {
		options = {}
	}

	var spaceCharWidth = getCharWidthsArray(' ', options)[0]

	var words = text.split(' ')

	var line = []
	, lines = [line]
	, line_length = options.textIndent || 0
	, separator_length = 0
	, current_word_length = 0
	, word
	, widths_array

	var i, l, tmp
	for (i = 0, l = words.length; i < l; i++) {
		word = words[i]
		widths_array = getCharWidthsArray(word, options)
		current_word_length = getArraySum(widths_array)

		if (line_length + separator_length + current_word_length > maxlen) {
			if (current_word_length > maxlen) {
				// this happens when you have space-less long URLs for example.
				// we just chop these to size. We do NOT insert hiphens
				tmp = splitLongWord(word, widths_array, maxlen - (line_length + separator_length), maxlen)
				// first line we add to existing line object
				line.push(tmp.shift()) // it's ok to have extra space indicator there
				// last line we make into new line object
				line = [tmp.pop()]
				// lines in the middle we apped to lines object as whole lines
				while(tmp.length){
					lines.push([tmp.shift()]) // single fragment occupies whole line
				}
				current_word_length = getArraySum( widths_array.slice(word.length - line[0].length) )
			} else {
				// just put it on a new line
				line = [word]
			}

			// now we attach new line to lines
			lines.push(line)

			line_length = current_word_length
			separator_length = spaceCharWidth

		} else {
			line.push(word)

			line_length += separator_length + current_word_length
			separator_length = spaceCharWidth
		}
	}

	var output = []
	for (i = 0, l = lines.length; i < l; i++) {
		output.push( lines[i].join(' ') )
	}
	return output

}

/**
Splits a given string into an array of strings. Uses 'size' value
(in measurement units declared as default for the jsPDF instance)
and the font's "widths" and "Kerning" tables, where availabe, to
determine display length of a given string for a given font.

We use character's 100% of unit size (height) as width when Width
table or other default width is not available.

@public
@function
@param text {String} Unencoded, regular JavaScript (Unicode, UTF-16 / UCS-2) string.
@param size {Number} Nominal number, measured in units default to this instance of jsPDF.
@param options {Object} Optional flags needed for chopper to do the right thing.
@returns {Array} with strings chopped to size.
*/
API.splitTextToSize = function(text, maxlen, options) {
	'use strict'

	if (!options) {
		options = {}
	}

	var fsize = options.fontSize || this.internal.getFontSize()
	, newOptions = (function(options){
		var widths = {0:1}
		, kerning = {}

		if (!options.widths || !options.kerning) {
			var f = this.internal.getFont(options.fontName, options.fontStyle)
			, encoding = 'Unicode'
			// NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
			// Actual JavaScript-native String's 16bit char codes used.
			// no multi-byte logic here

			if (f.metadata[encoding]) {
				return {
					widths: f.metadata[encoding].widths || widths
					, kerning: f.metadata[encoding].kerning || kerning
				}
			}
		} else {
			return 	{
				widths: options.widths
				, kerning: options.kerning
			}			
		}

		// then use default values
		return 	{
			widths: widths
			, kerning: kerning
		}
	}).call(this, options)

	// first we split on end-of-line chars
	var paragraphs 
	if (text.match(/[\n\r]/)) {
		paragraphs = text.split(/\r\n|\r|\n/g)
	} else {
		paragraphs = [text]
	}

	// now we convert size (max length of line) into "font size units"
	// at present time, the "font size unit" is always 'point'
	// 'proportional' means, "in proportion to font size"
	var fontUnit_maxLen = 1.0 * this.internal.scaleFactor * maxlen / fsize
	// at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
	// this may change in the future?
	// until then, proportional_maxlen is likely to be in 'points'

	// If first line is to be indented (shorter or longer) than maxLen 
	// we indicate that by using CSS-style "text-indent" option.
	// here it's in font units too (which is likely 'points')
	// it can be negative (which makes the first line longer than maxLen)
	newOptions.textIndent = options.textIndent ? 
		options.textIndent * 1.0 * this.internal.scaleFactor / fsize : 
		0

	var i, l
	, output = []
	for (i = 0, l = paragraphs.length; i < l; i++) {
		output = output.concat(
			splitParagraphIntoLines(
				paragraphs[i]
				, fontUnit_maxLen
				, newOptions
			)
		)
	}

	return output 
}

})(jsPDF.API);

/** @preserve 
 * jsPDF addImage plugin
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 *               2014 Diego Casorran, https://github.com/diegocr
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

;(function(jsPDFAPI) {
	'use strict'
	
	var namespace = 'addImage_',
		supported_image_types = ['jpeg', 'jpg', 'png'];
	
	
	// Image functionality ported from pdf.js
	var putImage = function(img) {
		
		var objectNumber = this.internal.newObject()
		, out = this.internal.write
		, putStream = this.internal.putStream
	
		img['n'] = objectNumber
	
		out('<</Type /XObject')
		out('/Subtype /Image')
		out('/Width ' + img['w'])
		out('/Height ' + img['h'])
		if (img['cs'] === this.color_spaces.INDEXED) {
			out('/ColorSpace [/Indexed /DeviceRGB '
					// if an indexed png defines more than one colour with transparency, we've created a smask  
					+ (img['pal'].length / 3 - 1) + ' ' + ('smask' in img ? objectNumber + 2 : objectNumber + 1)
					+ ' 0 R]');
		} else {
			out('/ColorSpace /' + img['cs']);
			if (img['cs'] === this.color_spaces.DEVICE_CMYK) {
				out('/Decode [1 0 1 0 1 0 1 0]');
			}
		}
		out('/BitsPerComponent ' + img['bpc']);
		if ('f' in img) {
			out('/Filter /' + img['f']);
		}
		if ('dp' in img) {
			out('/DecodeParms <<' + img['dp'] + '>>');
		}
		if ('trns' in img && img['trns'].constructor == Array) {
			var trns = '',
				i = 0,
				len = img['trns'].length;
			for (; i < len; i++)
				trns += (img['trns'][i] + ' ' + img['trns'][i] + ' ');
			out('/Mask [' + trns + ']');
		}
		if ('smask' in img) {
			out('/SMask ' + (objectNumber + 1) + ' 0 R');
		}
		out('/Length ' + img['data'].length + '>>');
	
		putStream(img['data']);
	
		out('endobj');
		
		// Soft mask
		if ('smask' in img) {
			var dp = '/Predictor 15 /Colors 1 /BitsPerComponent ' + img['bpc'] + ' /Columns ' + img['w'];
			var smask = {'w': img['w'], 'h': img['h'], 'cs': 'DeviceGray', 'bpc': img['bpc'], 'dp': dp, 'data': img['smask']};
			if ('f' in img) 
				smask.f = img['f'];
			putImage.call(this, smask);
		}
	    
	    //Palette
		if (img['cs'] === this.color_spaces.INDEXED) {
			
			this.internal.newObject();
			//out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
			//putStream(zlib.compress(img['pal']));
			out('<< /Length ' + img['pal'].length + '>>');
			putStream(this.arrayBufferToBinaryString(new Uint8Array(img['pal'])));
			out('endobj');
		}
	}
	, putResourcesCallback = function() {
		var images = this.internal.collections[namespace + 'images']
		for ( var i in images ) {
			putImage.call(this, images[i])
		}
	}
	, putXObjectsDictCallback = function(){
		var images = this.internal.collections[namespace + 'images']
		, out = this.internal.write
		, image
		for (var i in images) {
			image = images[i]
			out(
				'/I' + image['i']
				, image['n']
				, '0'
				, 'R'
			)
		}
	}
	, checkCompressValue = function(value) {
		if(value && typeof value === 'string')
			value = value.toUpperCase();
		return value in jsPDFAPI.image_compression ? value : jsPDFAPI.image_compression.NONE;
	}
	, getImages = function() {
		var images = this.internal.collections[namespace + 'images'];
		//first run, so initialise stuff
		if(!images) {
			this.internal.collections[namespace + 'images'] = images = {};
			this.internal.events.subscribe('putResources', putResourcesCallback);
			this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback);
		}
		
		return images;
	}
	, getImageIndex = function(images) {
		var imageIndex = 0;
		
		if (images){
			// this is NOT the first time this method is ran on this instance of jsPDF object.
			imageIndex = Object.keys ? 
			Object.keys(images).length :
			(function(o){
				var i = 0
				for (var e in o){if(o.hasOwnProperty(e)){ i++ }}
				return i
			})(images)
		}
		
		return imageIndex;
	}
	, notDefined = function(value) {
		return typeof value === 'undefined' || value === null;
	}
	, generateAliasFromData = function(data) {
		// TODO: Alias dynamic generation from imageData's checksum/hash
		return undefined;
	}
	, doesNotSupportImageType = function(type) {
		return supported_image_types.indexOf(type) === -1;
	}
	, processMethodNotEnabled = function(type) {
		return typeof jsPDFAPI['process' + type.toUpperCase()] !== 'function';
	}
	, isDOMElement = function(object) {
		return typeof object === 'object' && object.nodeType === 1;
	}
	, createDataURIFromElement = function(imageData, format) {
		
		var canvas = document.createElement('canvas');
	    canvas.width = imageData.clientWidth || imageData.width;
	    canvas.height = imageData.clientHeight || imageData.height;
	
	    var ctx = canvas.getContext('2d');
	    if (!ctx) {
	        throw ('addImage requires canvas to be supported by browser.');
	    }
	    ctx.drawImage(imageData, 0, 0, canvas.width, canvas.height);
	    
	    return canvas.toDataURL(format == 'png' ? 'image/png' : 'image/jpeg');
	}
	,checkImagesForAlias = function(imageData, images) {
		var cached_info;
		if(images) {
			for(var e in images) {
				if(imageData === images[e].alias) {
					cached_info = images[e];
					break;
				}
			}
		}
		return cached_info;
	}
	,determineWidthAndHeight = function(info, w, h, scaleFactor) {
		if (!w && !h) {
			w = -96;
			h = -96;
		}
		if (w < 0) {
			w = (-1) * info['w'] * 72 / w / scaleFactor;
		}
		if (h < 0) {
			h = (-1) * info['h'] * 72 / h / scaleFactor;
		}
		if (w === 0) {
			w = h * info['w'] / info['h'];
		}
		if (h === 0) {
			h = w * info['h'] / info['w'];
		}
		
		return [w, h];
	}
	, writeImageToPDF = function(x, y, w, h, info, index, images) {
		var dims = determineWidthAndHeight(info, w, h, this.internal.scaleFactor),
			coord = this.internal.getCoordinateString,
			vcoord = this.internal.getVerticalCoordinateString;
		
		w = dims[0];
		h = dims[1];
		
		images[index] = info;
		
		this.internal.write(
			'q'
			, coord(w)
			, '0 0'
			, coord(h) // TODO: check if this should be shifted by vcoord
			, coord(x)
			, vcoord(y + h)
			, 'cm /I'+info['i']
			, 'Do Q'
		)
	};
	
	
	/**
	 * COLOR SPACES
	 */
	jsPDFAPI.color_spaces = {
		DEVICE_RGB:'DeviceRGB',
		DEVICE_GRAY:'DeviceGray',
		DEVICE_CMYK:'DeviceCMYK',
		CAL_GREY:'CalGray',
		CAL_RGB:'CalRGB',
		LAB:'Lab',
		ICC_BASED:'ICCBased',
		INDEXED:'Indexed',
		PATTERN:'Pattern',
		SEPERATION:'Seperation',
		DEVICE_N:'DeviceN'
	};
	
	/**
	 * DECODE METHODS
	 */
	jsPDFAPI.decode = {
		DCT_DECODE:'DCTDecode',
		FLATE_DECODE:'FlateDecode',
		LZW_DECODE:'LZWDecode',
		JPX_DECODE:'JPXDecode',
		JBIG2_DECODE:'JBIG2Decode',
		ASCII85_DECODE:'ASCII85Decode',
		ASCII_HEX_DECODE:'ASCIIHexDecode',
		RUN_LENGTH_DECODE:'RunLengthDecode',
		CCITT_FAX_DECODE:'CCITTFaxDecode'
	};
	
	/**
	 * IMAGE COMPRESSION TYPES
	 */
	jsPDFAPI.image_compression = {
		NONE: 'NONE',
		FAST: 'FAST',
		MEDIUM: 'MEDIUM',
		SLOW: 'SLOW'
	};
	
	
	jsPDFAPI.isString = function(object) {
		return typeof object === 'string';
	};
	
	/**
	 * Strips out and returns info from a valid base64 data URI
	 * @param {String[dataURI]} a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
	 * @returns an Array containing the following
	 * [0] the complete data URI
	 * [1] <MIME-type>
	 * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
	 * [4] <data>
	 */
	jsPDFAPI.extractInfoFromBase64DataURI = function(dataURI) {
		return /^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(dataURI);
	};
	
	/**
	 * Check to see if ArrayBuffer is supported
	 */
	jsPDFAPI.supportsArrayBuffer = function() {
		return typeof ArrayBuffer === 'function';
	};
	
	/**
	 * Tests supplied object to determine if ArrayBuffer
	 * @param {Object[object]} 
	 */
	jsPDFAPI.isArrayBuffer = function(object) {
		if(!this.supportsArrayBuffer())
	        return false;
		return object instanceof ArrayBuffer;
	};
	
	/**
	 * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
	 * @param {Object[object]} 
	 */
	jsPDFAPI.isArrayBufferView = function(object) {
		if(!this.supportsArrayBuffer())
	        return false;
		return (object instanceof Int8Array ||
				object instanceof Uint8Array ||
				object instanceof Uint8ClampedArray ||
				object instanceof Int16Array ||
				object instanceof Uint16Array ||
				object instanceof Int32Array ||
				object instanceof Uint32Array ||
				object instanceof Float32Array ||
				object instanceof Float64Array );
	};
	
	/**
	 * Exactly what it says on the tin
	 */
	jsPDFAPI.binaryStringToUint8Array = function(binary_string) {
		/*
		 * not sure how efficient this will be will bigger files. Is there a native method?
		 */
		var len = binary_string.length;
	    var bytes = new Uint8Array( len );
	    for (var i = 0; i < len; i++) {
	        bytes[i] = binary_string.charCodeAt(i);
	    }
	    return bytes;
	};
	
	/**
	 * @see this discussion
	 * http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
	 * 
	 * As stated, i imagine the method below is highly inefficent for large files.
	 * 
	 * Also of note from Mozilla,
	 * 
	 * "However, this is slow and error-prone, due to the need for multiple conversions (especially if the binary data is not actually byte-format data, but, for example, 32-bit integers or floats)."
	 * 
	 * https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView
	 * 
	 * Although i'm strugglig to see how StringView solves this issue? Doesn't appear to be a direct method for conversion?
	 * 
	 * Async method using Blob and FileReader could be best, but i'm not sure how to fit it into the flow?
	 */
	jsPDFAPI.arrayBufferToBinaryString = function(buffer) {
		if(this.isArrayBuffer(buffer))
			buffer = new Uint8Array(buffer);
		
	    var binary_string = '';
	    var len = buffer.byteLength;
	    for (var i = 0; i < len; i++) {
	        binary_string += String.fromCharCode(buffer[i]);
	    }
	    return binary_string;
	    /*
	     * Another solution is the method below - convert array buffer straight to base64 and then use atob
	     */
		//return atob(this.arrayBufferToBase64(buffer));
	};
	
	/**
	 * Converts an ArrayBuffer directly to base64
	 * 
	 * Taken from here
	 * 
	 * http://jsperf.com/encoding-xhr-image-data/31
	 * 
	 * Need to test if this is a better solution for larger files
	 * 
	 */
	jsPDFAPI.arrayBufferToBase64 = function(arrayBuffer) {
		var base64    = ''
		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

		var bytes         = new Uint8Array(arrayBuffer)
		var byteLength    = bytes.byteLength
		var byteRemainder = byteLength % 3
		var mainLength    = byteLength - byteRemainder

		var a, b, c, d
		var chunk

		// Main loop deals with bytes in chunks of 3
		for (var i = 0; i < mainLength; i = i + 3) {
			// Combine the three bytes into a single integer
			chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

			// Use bitmasks to extract 6-bit segments from the triplet
			a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
			b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
			c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
			d = chunk & 63               // 63       = 2^6 - 1

			// Convert the raw binary segments to the appropriate ASCII encoding
			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
		}

		// Deal with the remaining bytes and padding
		if (byteRemainder == 1) {
			chunk = bytes[mainLength]

			a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

			// Set the 4 least significant bits to zero
			b = (chunk & 3)   << 4 // 3   = 2^2 - 1

			base64 += encodings[a] + encodings[b] + '=='
		} else if (byteRemainder == 2) {
			chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

			a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
			b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

			// Set the 2 least significant bits to zero
			c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

			base64 += encodings[a] + encodings[b] + encodings[c] + '='
		}

		return base64
	};
	
	
	jsPDFAPI.createImageInfo = function(data, wd, ht, cs, bpc, f, imageIndex, alias, dp, trns, pal, smask) {
		var info = {
				alias:alias,
				w : wd,
				h : ht,
				cs : cs,
				bpc : bpc,
				i : imageIndex,
				data : data
				// n: objectNumber will be added by putImage code
			};
		
		if(f) info.f = f;
		if(dp) info.dp = dp;
		if(trns) info.trns = trns;
		if(pal) info.pal = pal;
		if(smask) info.smask = smask;
		
		return info;
	};
	
	jsPDFAPI.addImage = function(imageData, format, x, y, w, h, alias, compression) {
		'use strict'
		
		if(typeof format === 'number') {
			var tmp = h;
			h = w;
			w = y;
			y = x;
			x = format;
			format = tmp || 'jpeg';
		}
		
		var images = getImages.call(this),//initalises internals and events on first run
			cached_info,
			dataAsBinaryString;
		
		compression = checkCompressValue(compression);
		format = format.toLowerCase();
		
		if(notDefined(alias))
			alias = generateAliasFromData(imageData);
		
		if(isDOMElement(imageData))
			imageData = createDataURIFromElement(imageData, format);
				
		if(this.isString(imageData)) {
			
			var base64Info = this.extractInfoFromBase64DataURI(imageData);
			
			if(base64Info) {
				
				format = base64Info[2];
				imageData = atob(base64Info[3]);//convert to binary string
				
				/*
				 * need to test if it's more efficent to convert all binary strings
				 * to TypedArray - or should we just leave and process as string?
				 */
				if(this.supportsArrayBuffer()) {
					dataAsBinaryString = imageData;
					imageData = this.binaryStringToUint8Array(imageData);
				}
				
			}else{
				// This is neither raw jpeg-data nor a data uri; alias?
				if(imageData.charCodeAt(0) !== 0xff)
					cached_info = checkImagesForAlias(imageData, images);
			}
		}
		
		if(doesNotSupportImageType(format))
			throw new Error('addImage currently only supports formats ' + supported_image_types + ', not \''+format+'\'');
		
		if(processMethodNotEnabled(format))
			throw new Error('please ensure that the plugin for \''+format+'\' support is added');

        var imageIndex = getImageIndex(images),
			info = cached_info;

		if(!info)			
			info = this['process' + format.toUpperCase()](imageData, imageIndex, alias, compression, dataAsBinaryString);
		
		if(!info)
			throw new Error('An unkwown error occurred whilst processing the image');

        writeImageToPDF.call(this, x, y, w, h, info, imageIndex, images);
	
		return this 
	};
	
	
	/**
	 * JPEG SUPPORT
	 **/
	
	//takes a string imgData containing the raw bytes of
	//a jpeg image and returns [width, height]
	//Algorithm from: http://www.64lines.com/jpeg-width-height
	var getJpegSize = function(imgData) {
		'use strict'
		var width, height;
		// Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00
		if (!imgData.charCodeAt(0) === 0xff ||
			!imgData.charCodeAt(1) === 0xd8 ||
			!imgData.charCodeAt(2) === 0xff ||
			!imgData.charCodeAt(3) === 0xe0 ||
			!imgData.charCodeAt(6) === 'J'.charCodeAt(0) ||
			!imgData.charCodeAt(7) === 'F'.charCodeAt(0) ||
			!imgData.charCodeAt(8) === 'I'.charCodeAt(0) ||
			!imgData.charCodeAt(9) === 'F'.charCodeAt(0) ||
			!imgData.charCodeAt(10) === 0x00) {
				throw new Error('getJpegSize requires a binary string jpeg file')
		}
		var blockLength = imgData.charCodeAt(4)*256 + imgData.charCodeAt(5);
		var i = 4, len = imgData.length;
		while ( i < len ) {
			i += blockLength;
			if (imgData.charCodeAt(i) !== 0xff) {
				throw new Error('getJpegSize could not find the size of the image');
			}
			if (imgData.charCodeAt(i+1) === 0xc0 || //(SOF) Huffman  - Baseline DCT
			    imgData.charCodeAt(i+1) === 0xc1 || //(SOF) Huffman  - Extended sequential DCT 
			    imgData.charCodeAt(i+1) === 0xc2 || // Progressive DCT (SOF2)
			    imgData.charCodeAt(i+1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
			    imgData.charCodeAt(i+1) === 0xc4 || // Differential sequential DCT (SOF5)
			    imgData.charCodeAt(i+1) === 0xc5 || // Differential progressive DCT (SOF6)
			    imgData.charCodeAt(i+1) === 0xc6 || // Differential spatial (SOF7)
			    imgData.charCodeAt(i+1) === 0xc7) {
				height = imgData.charCodeAt(i+5)*256 + imgData.charCodeAt(i+6);
				width = imgData.charCodeAt(i+7)*256 + imgData.charCodeAt(i+8);
				return [width, height];
			} else {
				i += 2;
				blockLength = imgData.charCodeAt(i)*256 + imgData.charCodeAt(i+1)
			}
		}
	}
	, getJpegSizeFromBytes = function(data) {
		
		var hdr = (data[0] << 8) | data[1];
		
		if(hdr !== 0xFFD8)
			throw new Error('Supplied data is not a JPEG');
		
		var len = data.length,
			block = (data[4] << 8) + data[5],
			pos = 4,
			bytes, width, height;
		
		while(pos < len) {
			pos += block;
			bytes = readBytes(data, pos);
			block = (bytes[2] << 8) + bytes[3];
			if((bytes[1] === 0xC0 || bytes[1] === 0xC2) && bytes[0] === 0xFF && block > 7) {
				bytes = readBytes(data, pos + 5);
				width = (bytes[2] << 8) + bytes[3];
				height = (bytes[0] << 8) + bytes[1];
				return {width:width, height:height};
			}
			
			pos+=2;
		}
		
		throw new Error('getJpegSizeFromBytes could not find the size of the image');
	}
	, readBytes = function(data, offset) {
		return data.subarray(offset, offset+ 4);
	};
	
	
	jsPDFAPI.processJPEG = function(data, index, alias, compression, dataAsBinaryString) {
		'use strict'
		var colorSpace = this.color_spaces.DEVICE_RGB,
			filter = this.decode.DCT_DECODE,
			bpc = 8,
			dims;
		
		if(this.isString(data)) {
			dims = getJpegSize(data);
			return this.createImageInfo(data, dims[0], dims[1], colorSpace, bpc, filter, index, alias);
		}
		
		if(this.isArrayBuffer(data))
			data = new Uint8Array(data);
		
		if(this.isArrayBufferView(data)) {
			
			dims = getJpegSizeFromBytes(data);
			
			// if we already have a stored binary string rep use that
			data = dataAsBinaryString || this.arrayBufferToBinaryString(data);
			
			return this.createImageInfo(data, dims.width, dims.height, colorSpace, bpc, filter, index, alias);
		}
		
		return null;
	};
	
	jsPDFAPI.processJPG = function(data, index, alias, compression, dataAsBinaryString) {
		return this.processJPEG(data, index, alias, compression, dataAsBinaryString);
	}

})(jsPDF.API);

/**@preserve
 *  ==================================================================== 
 * jsPDF [NAME] plugin
 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * ====================================================================
 */

(function(jsPDFAPI) {
'use strict'
	
	/*
	 * @see http://www.w3.org/TR/PNG-Chunks.html
	 * 
	 Color    Allowed      Interpretation
	 Type     Bit Depths
	   
	   0       1,2,4,8,16  Each pixel is a grayscale sample.
	   
	   2       8,16        Each pixel is an R,G,B triple.
	   
	   3       1,2,4,8     Each pixel is a palette index;
	                       a PLTE chunk must appear.
	   
	   4       8,16        Each pixel is a grayscale sample,
	                       followed by an alpha sample.
	   
	   6       8,16        Each pixel is an R,G,B triple,
	                       followed by an alpha sample.
	*/
	
	/*
	 * PNG filter method types
	 * 
	 * @see http://www.w3.org/TR/PNG-Filters.html
	 * @see http://www.libpng.org/pub/png/book/chapter09.html
	 * 
	 * This is what the value 'Predictor' in decode params relates to
	 * 
	 * 15 is "optimal prediction", which means the prediction algorithm can change from line to line.
	 * In that case, you actually have to read the first byte off each line for the prediction algorthim (which should be 0-4, corresponding to PDF 10-14) and select the appropriate unprediction algorithm based on that byte.
	 *
	   0       None
	   1       Sub
	   2       Up
	   3       Average
	   4       Paeth
	 */
	
	var doesNotHavePngJS = function() {
		return typeof PNG !== 'function' || typeof FlateStream !== 'function';
	}
	, canCompress = function(value) {
		return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
	}
	, hasCompressionJS = function() {
		var inst = typeof Deflater === 'function';
		if(!inst)
			throw new Error("requires deflate.js for compression")
		return inst;
	}
	, compressBytes = function(bytes, lineLength, colorsPerPixel, compression) {
		
		var level = 5,
			filter_method = filterUp;
		
		switch(compression) {
		
			case jsPDFAPI.image_compression.FAST:
				
				level = 3;
				filter_method = filterSub;
				break;
				
			case jsPDFAPI.image_compression.MEDIUM:
				
				level = 6;
				filter_method = filterAverage;
				break;
				
			case jsPDFAPI.image_compression.SLOW:
				
				level = 9;
				filter_method = filterPaeth;//uses to sum to choose best filter for each line
				break;
		}
		
		bytes = applyPngFilterMethod(bytes, lineLength, colorsPerPixel, filter_method);
		
		var header = new Uint8Array(createZlibHeader(level));
		var checksum = adler32(bytes);
		
		var deflate = new Deflater(level);
		var a = deflate.append(bytes);
		var cBytes = deflate.flush();
		
		var len = header.length + a.length + cBytes.length;
		
		var cmpd = new Uint8Array(len + 4);
		cmpd.set(header);
		cmpd.set(a, header.length);
		cmpd.set(cBytes, header.length + a.length);
		
		cmpd[len++] = (checksum >>> 24) & 0xff;
		cmpd[len++] = (checksum >>> 16) & 0xff;
		cmpd[len++] = (checksum >>> 8) & 0xff;
		cmpd[len++] = checksum & 0xff;
		
		return jsPDFAPI.arrayBufferToBinaryString(cmpd);
	}
	, createZlibHeader = function(bytes, level){
		/*
		 * @see http://www.ietf.org/rfc/rfc1950.txt for zlib header 
		 */
		var cm = 8;
        var cinfo = Math.LOG2E * Math.log(0x8000) - 8;
        var cmf = (cinfo << 4) | cm;
        
        var hdr = cmf << 8;
        var flevel = Math.min(3, ((level - 1) & 0xff) >> 1);
        
        hdr |= (flevel << 6);
        hdr |= 0;//FDICT
        hdr += 31 - (hdr % 31);
        
        return [cmf, (hdr & 0xff) & 0xff];
	}
	, adler32 = function(array, param) {
		var adler = 1;
	    var s1 = adler & 0xffff,
	        s2 = (adler >>> 16) & 0xffff;
	    var len = array.length;
	    var tlen;
	    var i = 0;

	    while (len > 0) {
	      tlen = len > param ? param : len;
	      len -= tlen;
	      do {
	        s1 += array[i++];
	        s2 += s1;
	      } while (--tlen);

	      s1 %= 65521;
	      s2 %= 65521;
	    }

	    return ((s2 << 16) | s1) >>> 0;
	}
	, applyPngFilterMethod = function(bytes, lineLength, colorsPerPixel, filter_method) {
		var lines = bytes.length / lineLength,
			result = new Uint8Array(bytes.length + lines),
			filter_methods = getFilterMethods(),
			i = 0, line, prevLine, offset;
		
		for(; i < lines; i++) {
			offset = i * lineLength;
			line = bytes.subarray(offset, offset + lineLength);
			
			if(filter_method) {
				result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);
				
			}else{
			
				var j = 0,
					len = filter_methods.length,
					results = [];
				
				for(; j < len; j++)
					results[j] = filter_methods[j](line, colorsPerPixel, prevLine);
				
				var ind = getIndexOfSmallestSum(results.concat());
				
				result.set(results[ind], offset + i);
			}
			
			prevLine = line;
		}
		
		return result;
	}
	, filterNone = function(line, colorsPerPixel, prevLine) {
		/*var result = new Uint8Array(line.length + 1);
		result[0] = 0;
		result.set(line, 1);*/
		
		var result = Array.apply([], line);
		result.unshift(0);

		return result;
	}
	, filterSub = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left;
		
		result[0] = 1;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			result[i + 1] = (line[i] - left + 0x0100) & 0xff;
		}
		
		return result;
	}
	, filterUp = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			up;
		
		result[0] = 2;
		
		for(; i < len; i++) {
			up = prevLine && prevLine[i] || 0;
			result[i + 1] = (line[i] - up + 0x0100) & 0xff;
		}
		
		return result;
	}
	, filterAverage = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left,
			up;
	
		result[0] = 3;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			up = prevLine && prevLine[i] || 0;
			result[i + 1] = (line[i] + 0x0100 - ((left + up) >>> 1)) & 0xff;
		}
		
		return result;
	}
	, filterPaeth = function(line, colorsPerPixel, prevLine) {
		var result = [],
			i = 0,
			len = line.length,
			left,
			up,
			upLeft,
			paeth;
		
		result[0] = 4;
		
		for(; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			up = prevLine && prevLine[i] || 0;
			upLeft = prevLine && prevLine[i - colorsPerPixel] || 0;
			paeth = paethPredictor(left, up, upLeft);
			result[i + 1] = (line[i] - paeth + 0x0100) & 0xff;
		}
		
		return result;
	}
	,paethPredictor = function(left, up, upLeft) {

		var p = left + up - upLeft,
	        pLeft = Math.abs(p - left),
	        pUp = Math.abs(p - up),
	        pUpLeft = Math.abs(p - upLeft);
		
		return (pLeft <= pUp && pLeft <= pUpLeft) ? left : (pUp <= pUpLeft) ? up : upLeft;
	}
	, getFilterMethods = function() {
		return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
	}
	,getIndexOfSmallestSum = function(arrays) {
		var i = 0,
			len = arrays.length,
			sum, min, ind;
		
		while(i < len) {
			sum = absSum(arrays[i].slice(1));
			
			if(sum < min || !min) {
				min = sum;
				ind = i;
			}
			
			i++;
		}
		
		return ind;
	}
	, absSum = function(array) {
		var i = 0,
			len = array.length,
			sum = 0;
	
		while(i < len)
			sum += Math.abs(array[i++]);
			
		return sum;
	}
	, logImg = function(img) {
		console.log("width: " + img.width);
		console.log("height: " + img.height);
		console.log("bits: " + img.bits);
		console.log("colorType: " + img.colorType);
		console.log("transparency:");
		console.log(img.transparency);
		console.log("text:");
		console.log(img.text);
		console.log("compressionMethod: " + img.compressionMethod);
		console.log("filterMethod: " + img.filterMethod);
		console.log("interlaceMethod: " + img.interlaceMethod);
		console.log("imgData:");
		console.log(img.imgData);
		console.log("palette:");
		console.log(img.palette);
		console.log("colors: " + img.colors);
		console.log("colorSpace: " + img.colorSpace);
		console.log("pixelBitlength: " + img.pixelBitlength);
		console.log("hasAlphaChannel: " + img.hasAlphaChannel);
	};
	
	
	
	
	jsPDFAPI.processPNG = function(imageData, imageIndex, alias, compression, dataAsBinaryString) {
		'use strict'
		
		var colorSpace = this.color_spaces.DEVICE_RGB,
			decode = this.decode.FLATE_DECODE,
			bpc = 8,
			img, dp, trns,
			colors, pal, smask;
		
		if(this.isString(imageData)) {
			
		}
		
		if(this.isArrayBuffer(imageData))
			imageData = new Uint8Array(imageData);
		
		if(this.isArrayBufferView(imageData)) {
			
			if(doesNotHavePngJS())
				throw new Error("PNG support requires png.js and zlib.js");
				
			img = new PNG(imageData);
			imageData = img.imgData;
			bpc = img.bits;
			colorSpace = img.colorSpace;
			colors = img.colors;
			
			//logImg(img);
			
			/*
			 * colorType 6 - Each pixel is an R,G,B triple, followed by an alpha sample.
			 * 
			 * colorType 4 - Each pixel is a grayscale sample, followed by an alpha sample.
			 * 
			 * Extract alpha to create two separate images, using the alpha as a sMask
			 */
			if([4,6].indexOf(img.colorType) !== -1) {
				
				/*
				 * processes 8 bit RGBA and grayscale + alpha images
				 */
				if(img.bits === 8) {
				
					var pixelsArrayType = window['Uint' + img.pixelBitlength + 'Array'],
						pixels = new pixelsArrayType(img.decodePixels().buffer),
						len = pixels.length,
						imgData = new Uint8Array(len * img.colors),
						alphaData = new Uint8Array(len),
						pDiff = img.pixelBitlength - img.bits,
						i = 0, n = 0, pixel, pbl;
				
					for(; i < len; i++) {
						pixel = pixels[i];
						pbl = 0;
						
						while(pbl < pDiff) {
							
							imgData[n++] = ( pixel >>> pbl ) & 0xff;
							pbl = pbl + img.bits;
						}
						
						alphaData[i] = ( pixel >>> pbl ) & 0xff;
					}
				}
				
				/*
				 * processes 16 bit RGBA and grayscale + alpha images
				 */
				if(img.bits === 16) {
					
					var pixels = new Uint32Array(img.decodePixels().buffer),
						len = pixels.length,
						imgData = new Uint8Array((len * (32 / img.pixelBitlength) ) * img.colors),
						alphaData = new Uint8Array(len * (32 / img.pixelBitlength) ),
						hasColors = img.colors > 1,
						i = 0, n = 0, a = 0, pixel;
					
					while(i < len) {
						pixel = pixels[i++];
						
						imgData[n++] = (pixel >>> 0) & 0xFF;
						
						if(hasColors) {
							imgData[n++] = (pixel >>> 16) & 0xFF;
							
							pixel = pixels[i++];
							imgData[n++] = (pixel >>> 0) & 0xFF;
						}
						
						alphaData[a++] = (pixel >>> 16) & 0xFF;
					}
					
					bpc = 8;
				}
				
				if(canCompress(compression)) {
										
					imageData = compressBytes(imgData, img.width * img.colors, img.colors, compression);
					smask = compressBytes(alphaData, img.width, 1, compression);
					
				}else{
					
					imageData = imgData;
					smask = alphaData;
					decode = null;
				}
			}
			
			/*
			 * Indexed png. Each pixel is a palette index.
			 */
			if(img.colorType === 3) {
				
				colorSpace = this.color_spaces.INDEXED;
				pal = img.palette;
				
				if(img.transparency.indexed) {
					
					var trans = img.transparency.indexed;
					
					var total = 0,
						i = 0,
						len = trans.length;

					for(; i<len; ++i)
					    total += trans[i];
					
					total = total / 255;
					
					/*
					 * a single color is specified as 100% transparent (0),
					 * so we set trns to use a /Mask with that index
					 */
					if(total === len - 1 && trans.indexOf(0) !== -1) {
						trns = [trans.indexOf(0)];
					
					/*
					 * there's more than one colour within the palette that specifies
					 * a transparency value less than 255, so we unroll the pixels to create an image sMask
					 */
					}else if(total !== len){
						
						var pixels = img.decodePixels(),
							alphaData = new Uint8Array(pixels.length),
							i = 0,
							len = pixels.length;
						
						for(; i < len; i++)
							alphaData[i] = trans[pixels[i]];
						
						smask = compressBytes(alphaData, img.width, 1);
					}
				}
			}
			
			if(decode === this.decode.FLATE_DECODE)
				dp = '/Predictor 15 /Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
			else
				//remove 'Predictor' as it applies to the type of png filter applied to its IDAT - we only apply with compression
				dp = '/Colors '+ colors +' /BitsPerComponent '+ bpc +' /Columns '+ img.width;
			
			if(this.isArrayBuffer(imageData) || this.isArrayBufferView(imageData))
				imageData = this.arrayBufferToBinaryString(imageData);
			
			if(smask && this.isArrayBuffer(smask) || this.isArrayBufferView(smask))
				smask = this.arrayBufferToBinaryString(smask);
			
			return this.createImageInfo(imageData, img.width, img.height, colorSpace,
										bpc, decode, imageIndex, alias, dp, trns, pal, smask);
		}
		
		return info;
	}

})(jsPDF.API)

/*
 * Extracted from pdf.js
 * https://github.com/andreasgal/pdf.js
 *
 * Copyright (c) 2011 Mozilla Foundation
 *
 * Contributors: Andreas Gal <gal@mozilla.com>
 *               Chris G Jones <cjones@mozilla.com>
 *               Shaon Barman <shaon.barman@gmail.com>
 *               Vivien Nicolas <21@vingtetun.org>
 *               Justin D'Arcangelo <justindarc@gmail.com>
 *               Yury Delendik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

var DecodeStream = (function() {
  function constructor() {
    this.pos = 0;
    this.bufferLength = 0;
    this.eof = false;
    this.buffer = null;
  }

  constructor.prototype = {
    ensureBuffer: function decodestream_ensureBuffer(requested) {
      var buffer = this.buffer;
      var current = buffer ? buffer.byteLength : 0;
      if (requested < current)
        return buffer;
      var size = 512;
      while (size < requested)
        size <<= 1;
      var buffer2 = new Uint8Array(size);
      for (var i = 0; i < current; ++i)
        buffer2[i] = buffer[i];
      return this.buffer = buffer2;
    },
    getByte: function decodestream_getByte() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return this.buffer[this.pos++];
    },
    getBytes: function decodestream_getBytes(length) {
      var pos = this.pos;

      if (length) {
        this.ensureBuffer(pos + length);
        var end = pos + length;

        while (!this.eof && this.bufferLength < end)
          this.readBlock();

        var bufEnd = this.bufferLength;
        if (end > bufEnd)
          end = bufEnd;
      } else {
        while (!this.eof)
          this.readBlock();

        var end = this.bufferLength;
      }

      this.pos = end;
      return this.buffer.subarray(pos, end);
    },
    lookChar: function decodestream_lookChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos]);
    },
    getChar: function decodestream_getChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos++]);
    },
    makeSubStream: function decodestream_makeSubstream(start, length, dict) {
      var end = start + length;
      while (this.bufferLength <= end && !this.eof)
        this.readBlock();
      return new Stream(this.buffer, start, length, dict);
    },
    skip: function decodestream_skip(n) {
      if (!n)
        n = 1;
      this.pos += n;
    },
    reset: function decodestream_reset() {
      this.pos = 0;
    }
  };

  return constructor;
})();

var FlateStream = (function() {
  var codeLenCodeMap = new Uint32Array([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
  ]);

  var lengthDecode = new Uint32Array([
    0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
    0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
    0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
    0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
  ]);

  var distDecode = new Uint32Array([
    0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
    0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
    0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
    0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
  ]);

  var fixedLitCodeTab = [new Uint32Array([
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
    0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
    0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
    0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
    0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
    0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
    0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
    0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
    0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
    0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
    0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
    0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
    0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
    0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
    0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
    0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
    0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
    0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
    0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
    0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
    0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
    0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
    0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
    0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
    0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
    0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
    0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
    0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
    0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
    0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
    0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
    0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
    0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
    0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
    0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
    0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
    0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
    0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
    0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
    0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
    0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
    0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
    0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
    0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
    0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
    0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
    0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
    0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
    0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
  ]), 9];

  var fixedDistCodeTab = [new Uint32Array([
    0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
    0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
    0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
    0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
  ]), 5];
  
  function error(e) {
      throw new Error(e)
  }

  function constructor(bytes) {
    //var bytes = stream.getBytes();
    var bytesPos = 0;

    var cmf = bytes[bytesPos++];
    var flg = bytes[bytesPos++];
    if (cmf == -1 || flg == -1)
      error('Invalid header in flate stream');
    if ((cmf & 0x0f) != 0x08)
      error('Unknown compression method in flate stream');
    if ((((cmf << 8) + flg) % 31) != 0)
      error('Bad FCHECK in flate stream');
    if (flg & 0x20)
      error('FDICT bit set in flate stream');

    this.bytes = bytes;
    this.bytesPos = bytesPos;

    this.codeSize = 0;
    this.codeBuf = 0;

    DecodeStream.call(this);
  }

  constructor.prototype = Object.create(DecodeStream.prototype);

  constructor.prototype.getBits = function(bits) {
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    var b;
    while (codeSize < bits) {
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= b << codeSize;
      codeSize += 8;
    }
    b = codeBuf & ((1 << bits) - 1);
    this.codeBuf = codeBuf >> bits;
    this.codeSize = codeSize -= bits;
    this.bytesPos = bytesPos;
    return b;
  };

  constructor.prototype.getCode = function(table) {
    var codes = table[0];
    var maxLen = table[1];
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    while (codeSize < maxLen) {
      var b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= (b << codeSize);
      codeSize += 8;
    }
    var code = codes[codeBuf & ((1 << maxLen) - 1)];
    var codeLen = code >> 16;
    var codeVal = code & 0xffff;
    if (codeSize == 0 || codeSize < codeLen || codeLen == 0)
      error('Bad encoding in flate stream');
    this.codeBuf = (codeBuf >> codeLen);
    this.codeSize = (codeSize - codeLen);
    this.bytesPos = bytesPos;
    return codeVal;
  };

  constructor.prototype.generateHuffmanTable = function(lengths) {
    var n = lengths.length;

    // find max code length
    var maxLen = 0;
    for (var i = 0; i < n; ++i) {
      if (lengths[i] > maxLen)
        maxLen = lengths[i];
    }

    // build the table
    var size = 1 << maxLen;
    var codes = new Uint32Array(size);
    for (var len = 1, code = 0, skip = 2;
         len <= maxLen;
         ++len, code <<= 1, skip <<= 1) {
      for (var val = 0; val < n; ++val) {
        if (lengths[val] == len) {
          // bit-reverse the code
          var code2 = 0;
          var t = code;
          for (var i = 0; i < len; ++i) {
            code2 = (code2 << 1) | (t & 1);
            t >>= 1;
          }

          // fill the table entries
          for (var i = code2; i < size; i += skip)
            codes[i] = (len << 16) | val;

          ++code;
        }
      }
    }

    return [codes, maxLen];
  };

  constructor.prototype.readBlock = function() {
    function repeat(stream, array, len, offset, what) {
      var repeat = stream.getBits(len) + offset;
      while (repeat-- > 0)
        array[i++] = what;
    }

    // read block header
    var hdr = this.getBits(3);
    if (hdr & 1)
      this.eof = true;
    hdr >>= 1;

    if (hdr == 0) { // uncompressed block
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;
      var b;

      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var blockLen = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      blockLen |= (b << 8);
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var check = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      check |= (b << 8);
      if (check != (~blockLen & 0xffff))
        error('Bad uncompressed block length in flate stream');

      this.codeBuf = 0;
      this.codeSize = 0;

      var bufferLength = this.bufferLength;
      var buffer = this.ensureBuffer(bufferLength + blockLen);
      var end = bufferLength + blockLen;
      this.bufferLength = end;
      for (var n = bufferLength; n < end; ++n) {
        if (typeof (b = bytes[bytesPos++]) == 'undefined') {
          this.eof = true;
          break;
        }
        buffer[n] = b;
      }
      this.bytesPos = bytesPos;
      return;
    }

    var litCodeTable;
    var distCodeTable;
    if (hdr == 1) { // compressed block, fixed codes
      litCodeTable = fixedLitCodeTab;
      distCodeTable = fixedDistCodeTab;
    } else if (hdr == 2) { // compressed block, dynamic codes
      var numLitCodes = this.getBits(5) + 257;
      var numDistCodes = this.getBits(5) + 1;
      var numCodeLenCodes = this.getBits(4) + 4;

      // build the code lengths code table
      var codeLenCodeLengths = Array(codeLenCodeMap.length);
      var i = 0;
      while (i < numCodeLenCodes)
        codeLenCodeLengths[codeLenCodeMap[i++]] = this.getBits(3);
      var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

      // build the literal and distance code tables
      var len = 0;
      var i = 0;
      var codes = numLitCodes + numDistCodes;
      var codeLengths = new Array(codes);
      while (i < codes) {
        var code = this.getCode(codeLenCodeTab);
        if (code == 16) {
          repeat(this, codeLengths, 2, 3, len);
        } else if (code == 17) {
          repeat(this, codeLengths, 3, 3, len = 0);
        } else if (code == 18) {
          repeat(this, codeLengths, 7, 11, len = 0);
        } else {
          codeLengths[i++] = len = code;
        }
      }

      litCodeTable =
        this.generateHuffmanTable(codeLengths.slice(0, numLitCodes));
      distCodeTable =
        this.generateHuffmanTable(codeLengths.slice(numLitCodes, codes));
    } else {
      error('Unknown block type in flate stream');
    }

    var buffer = this.buffer;
    var limit = buffer ? buffer.length : 0;
    var pos = this.bufferLength;
    while (true) {
      var code1 = this.getCode(litCodeTable);
      if (code1 < 256) {
        if (pos + 1 >= limit) {
          buffer = this.ensureBuffer(pos + 1);
          limit = buffer.length;
        }
        buffer[pos++] = code1;
        continue;
      }
      if (code1 == 256) {
        this.bufferLength = pos;
        return;
      }
      code1 -= 257;
      code1 = lengthDecode[code1];
      var code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var len = (code1 & 0xffff) + code2;
      code1 = this.getCode(distCodeTable);
      code1 = distDecode[code1];
      code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var dist = (code1 & 0xffff) + code2;
      if (pos + len >= limit) {
        buffer = this.ensureBuffer(pos + len);
        limit = buffer.length;
      }
      for (var k = 0; k < len; ++k, ++pos)
        buffer[pos] = buffer[pos - dist];
    }
  };

  return constructor;
})();
// Generated by CoffeeScript 1.4.0

/*
# MIT LICENSE
# Copyright (c) 2011 Devon Govett
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy of this 
# software and associated documentation files (the "Software"), to deal in the Software 
# without restriction, including without limitation the rights to use, copy, modify, merge, 
# publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
# to whom the Software is furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all copies or 
# substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
# BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function() {
  var PNG;

  PNG = (function() {
    var APNG_BLEND_OP_OVER, APNG_BLEND_OP_SOURCE, APNG_DISPOSE_OP_BACKGROUND, APNG_DISPOSE_OP_NONE, APNG_DISPOSE_OP_PREVIOUS, makeImage, scratchCanvas, scratchCtx;

    PNG.load = function(url, canvas, callback) {
      var xhr,
        _this = this;
      if (typeof canvas === 'function') {
        callback = canvas;
      }
      xhr = new XMLHttpRequest;
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function() {
        var data, png;
        data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
        png = new PNG(data);
        if (typeof (canvas != null ? canvas.getContext : void 0) === 'function') {
          png.render(canvas);
        }
        return typeof callback === "function" ? callback(png) : void 0;
      };
      return xhr.send(null);
    };

    APNG_DISPOSE_OP_NONE = 0;

    APNG_DISPOSE_OP_BACKGROUND = 1;

    APNG_DISPOSE_OP_PREVIOUS = 2;

    APNG_BLEND_OP_SOURCE = 0;

    APNG_BLEND_OP_OVER = 1;

    function PNG(data) {
      var chunkSize, colors, palLen, delayDen, delayNum, frame, i, index, key, section, short, text, _i, _j, _ref;
      this.data = data;
      this.pos = 8;
      this.palette = [];
      this.imgData = [];
      this.transparency = {};
      this.animation = null;
      this.text = {};
      frame = null;
      while (true) {
        chunkSize = this.readUInt32();
        section = ((function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i < 4; i = ++_i) {
            _results.push(String.fromCharCode(this.data[this.pos++]));
          }
          return _results;
        }).call(this)).join('');
        switch (section) {
          case 'IHDR':
            this.width = this.readUInt32();
            this.height = this.readUInt32();
            this.bits = this.data[this.pos++];
            this.colorType = this.data[this.pos++];
            this.compressionMethod = this.data[this.pos++];
            this.filterMethod = this.data[this.pos++];
            this.interlaceMethod = this.data[this.pos++];
            break;
          case 'acTL':
            this.animation = {
              numFrames: this.readUInt32(),
              numPlays: this.readUInt32() || Infinity,
              frames: []
            };
            break;
          case 'PLTE':
            this.palette = this.read(chunkSize);
            break;
          case 'fcTL':
            if (frame) {
              this.animation.frames.push(frame);
            }
            this.pos += 4;
            frame = {
              width: this.readUInt32(),
              height: this.readUInt32(),
              xOffset: this.readUInt32(),
              yOffset: this.readUInt32()
            };
            delayNum = this.readUInt16();
            delayDen = this.readUInt16() || 100;
            frame.delay = 1000 * delayNum / delayDen;
            frame.disposeOp = this.data[this.pos++];
            frame.blendOp = this.data[this.pos++];
            frame.data = [];
            break;
          case 'IDAT':
          case 'fdAT':
            if (section === 'fdAT') {
              this.pos += 4;
              chunkSize -= 4;
            }
            data = (frame != null ? frame.data : void 0) || this.imgData;
            for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i) {
              data.push(this.data[this.pos++]);
            }
            break;
          case 'tRNS':
            this.transparency = {};
            switch (this.colorType) {
              case 3:
            	palLen = this.palette.length/3;
                this.transparency.indexed = this.read(chunkSize);
                if(this.transparency.indexed.length > palLen)
                	throw new Error('More transparent colors than palette size');
                /*
                 * According to the PNG spec trns should be increased to the same size as palette if shorter
                 */
                //short = 255 - this.transparency.indexed.length;
                short = palLen - this.transparency.indexed.length;
                if (short > 0) {
                  for (i = _j = 0; 0 <= short ? _j < short : _j > short; i = 0 <= short ? ++_j : --_j) {
                    this.transparency.indexed.push(255);
                  }
                }
                break;
              case 0:
                this.transparency.grayscale = this.read(chunkSize)[0];
                break;
              case 2:
                this.transparency.rgb = this.read(chunkSize);
            }
            break;
          case 'tEXt':
            text = this.read(chunkSize);
            index = text.indexOf(0);
            key = String.fromCharCode.apply(String, text.slice(0, index));
            this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
            break;
          case 'IEND':
            if (frame) {
              this.animation.frames.push(frame);
            }
            this.colors = (function() {
              switch (this.colorType) {
                case 0:
                case 3:
                case 4:
                  return 1;
                case 2:
                case 6:
                  return 3;
              }
            }).call(this);
            this.hasAlphaChannel = (_ref = this.colorType) === 4 || _ref === 6;
            colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
            this.pixelBitlength = this.bits * colors;
            this.colorSpace = (function() {
              switch (this.colors) {
                case 1:
                  return 'DeviceGray';
                case 3:
                  return 'DeviceRGB';
              }
            }).call(this);
            this.imgData = new Uint8Array(this.imgData);
            return;
          default:
            this.pos += chunkSize;
        }
        this.pos += 4;
        if (this.pos > this.data.length) {
          throw new Error("Incomplete or corrupt PNG file");
        }
      }
      return;
    }

    PNG.prototype.read = function(bytes) {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
        _results.push(this.data[this.pos++]);
      }
      return _results;
    };

    PNG.prototype.readUInt32 = function() {
      var b1, b2, b3, b4;
      b1 = this.data[this.pos++] << 24;
      b2 = this.data[this.pos++] << 16;
      b3 = this.data[this.pos++] << 8;
      b4 = this.data[this.pos++];
      return b1 | b2 | b3 | b4;
    };

    PNG.prototype.readUInt16 = function() {
      var b1, b2;
      b1 = this.data[this.pos++] << 8;
      b2 = this.data[this.pos++];
      return b1 | b2;
    };

    PNG.prototype.decodePixels = function(data) {
      var byte, c, col, i, left, length, p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row, scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
      if (data == null) {
        data = this.imgData;
      }
      if (data.length === 0) {
        return new Uint8Array(0);
      }
      data = new FlateStream(data);
      data = data.getBytes();
      pixelBytes = this.pixelBitlength / 8;
      scanlineLength = pixelBytes * this.width;
      pixels = new Uint8Array(scanlineLength * this.height);
      length = data.length;
      row = 0;
      pos = 0;
      c = 0;
      while (pos < length) {
        switch (data[pos++]) {
          case 0:
            for (i = _i = 0; _i < scanlineLength; i = _i += 1) {
              pixels[c++] = data[pos++];
            }
            break;
          case 1:
            for (i = _j = 0; _j < scanlineLength; i = _j += 1) {
              byte = data[pos++];
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              pixels[c++] = (byte + left) % 256;
            }
            break;
          case 2:
            for (i = _k = 0; _k < scanlineLength; i = _k += 1) {
              byte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
              pixels[c++] = (upper + byte) % 256;
            }
            break;
          case 3:
            for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
              byte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
              pixels[c++] = (byte + Math.floor((left + upper) / 2)) % 256;
            }
            break;
          case 4:
            for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
              byte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              if (row === 0) {
                upper = upperLeft = 0;
              } else {
                upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
              }
              p = left + upper - upperLeft;
              pa = Math.abs(p - left);
              pb = Math.abs(p - upper);
              pc = Math.abs(p - upperLeft);
              if (pa <= pb && pa <= pc) {
                paeth = left;
              } else if (pb <= pc) {
                paeth = upper;
              } else {
                paeth = upperLeft;
              }
              pixels[c++] = (byte + paeth) % 256;
            }
            break;
          default:
            throw new Error("Invalid filter algorithm: " + data[pos - 1]);
        }
        row++;
      }
      return pixels;
    };

    PNG.prototype.decodePalette = function() {
      var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;
      palette = this.palette;
      transparency = this.transparency.indexed || [];
      ret = new Uint8Array((transparency.length || 0) + palette.length);
      pos = 0;
      length = palette.length;
      c = 0;
      for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) {
        ret[pos++] = palette[i];
        ret[pos++] = palette[i + 1];
        ret[pos++] = palette[i + 2];
        ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
      }
      return ret;
    };

    PNG.prototype.copyToImageData = function(imageData, pixels) {
      var alpha, colors, data, i, input, j, k, length, palette, v, _ref;
      colors = this.colors;
      palette = null;
      alpha = this.hasAlphaChannel;
      if (this.palette.length) {
        palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
        colors = 4;
        alpha = true;
      }
      data = imageData.data || imageData;
      length = data.length;
      input = palette || pixels;
      i = j = 0;
      if (colors === 1) {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          v = input[k++];
          data[i++] = v;
          data[i++] = v;
          data[i++] = v;
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      } else {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      }
    };

    PNG.prototype.decode = function() {
      var ret;
      ret = new Uint8Array(this.width * this.height * 4);
      this.copyToImageData(ret, this.decodePixels());
      return ret;
    };

    scratchCanvas = document.createElement('canvas');

    scratchCtx = scratchCanvas.getContext('2d');

    makeImage = function(imageData) {
      var img;
      scratchCtx.width = imageData.width;
      scratchCtx.height = imageData.height;
      scratchCtx.clearRect(0, 0, imageData.width, imageData.height);
      scratchCtx.putImageData(imageData, 0, 0);
      img = new Image;
      img.src = scratchCanvas.toDataURL();
      return img;
    };

    PNG.prototype.decodeFrames = function(ctx) {
      var frame, i, imageData, pixels, _i, _len, _ref, _results;
      if (!this.animation) {
        return;
      }
      _ref = this.animation.frames;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        frame = _ref[i];
        imageData = ctx.createImageData(frame.width, frame.height);
        pixels = this.decodePixels(new Uint8Array(frame.data));
        this.copyToImageData(imageData, pixels);
        frame.imageData = imageData;
        _results.push(frame.image = makeImage(imageData));
      }
      return _results;
    };

    PNG.prototype.renderFrame = function(ctx, number) {
      var frame, frames, prev;
      frames = this.animation.frames;
      frame = frames[number];
      prev = frames[number - 1];
      if (number === 0) {
        ctx.clearRect(0, 0, this.width, this.height);
      }
      if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_BACKGROUND) {
        ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height);
      } else if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_PREVIOUS) {
        ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset);
      }
      if (frame.blendOp === APNG_BLEND_OP_SOURCE) {
        ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height);
      }
      return ctx.drawImage(frame.image, frame.xOffset, frame.yOffset);
    };

    PNG.prototype.animate = function(ctx) {
      var doFrame, frameNumber, frames, numFrames, numPlays, _ref,
        _this = this;
      frameNumber = 0;
      _ref = this.animation, numFrames = _ref.numFrames, frames = _ref.frames, numPlays = _ref.numPlays;
      return (doFrame = function() {
        var f, frame;
        f = frameNumber++ % numFrames;
        frame = frames[f];
        _this.renderFrame(ctx, f);
        if (numFrames > 1 && frameNumber / numFrames < numPlays) {
          return _this.animation._timeout = setTimeout(doFrame, frame.delay);
        }
      })();
    };

    PNG.prototype.stopAnimation = function() {
      var _ref;
      return clearTimeout((_ref = this.animation) != null ? _ref._timeout : void 0);
    };

    PNG.prototype.render = function(canvas) {
      var ctx, data;
      if (canvas._png) {
        canvas._png.stopAnimation();
      }
      canvas._png = this;
      canvas.width = this.width;
      canvas.height = this.height;
      ctx = canvas.getContext("2d");
      if (this.animation) {
        this.decodeFrames(ctx);
        return this.animate(ctx);
      } else {
        data = ctx.createImageData(this.width, this.height);
        this.copyToImageData(data, this.decodePixels());
        return ctx.putImageData(data, 0, 0);
      }
    };

    return PNG;

  })();

  window.PNG = PNG;

}).call(this);

;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
this contains the max string length for all qr code Versions in Binary Safe / Byte Mode
each entry is in the order of error correct level
	[L,M,Q,H]

the qrcode lib sets strange values for QRErrorCorrectLevel having to do with masking against patterns
the maximum string length for error correct level H is 1273 characters long.
*/

exports.QRCapacityTable = [
[17,14,11,7]
,[32,26,20,14]
,[53,42,32,24]
,[78,62,46,34]
,[106,84,60,44]
,[134,106,74,58]
,[154,122,86,64]
,[192,152,108,84]
,[230,180,130,98]
,[271,213,151,119]
,[321,251,177,137]//11
,[367,287,203,155]
,[425,331,241,177]
,[458,362,258,194]
,[520,412,292,220]
,[586,450,322,250]
,[644,504,364,280]
,[718,560,394,310]
,[792,624,442,338]
,[858,666,482,382]
,[929,711,509,403]
,[1003,779,565,439]
,[1091,857,611,461]
,[1171,911,661,511]//24
,[1273,997,715,535]
,[1367,1059,751,593]
,[1465,1125,805,625]
,[1528,1190,868,658]//28
,[1628,1264,908,698]
,[1732,1370,982,742]
,[1840,1452,1030,790]
,[1952,1538,1112,842]//32
,[2068,1628,1168,898]
,[2188,1722,1228,958]
,[2303,1809,1283,983]
,[2431,1911,1351,1051]//36
,[2563,1989,1423,1093]
,[2699,2099,1499,1139]
,[2809,2213,1579,1219]
,[2953,2331,1663,1273]//40
];

},{}],2:[function(require,module,exports){
/*
* copyright 2010-2012 Ryan Day
* http://github.com/soldair/node-qrcode
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*
* canvas example and fallback support example provided by Joshua Koo
*	http://jabtunes.com/labs/qrcode.html
*	"Instant QRCode Mashup by Joshua Koo!"
*	as far as i can tell the page and the code on the page are public domain 
*	
* original table example and library provided by Kazuhiko Arase
*	http://d-project.googlecode.com/svn/trunk/misc/qrcode/js/
*
*/

var bops = require('bops')
var QRCodeLib = require('./qrcode.js');
var QRVersionCapacityTable = require('./qrcapacitytable.js').QRCapacityTable;
var QRCode = QRCodeLib.QRCode;

exports.QRCodeDraw = QRCodeDraw;
exports.QRVersionCapacityTable = QRVersionCapacityTable;
exports.QRErrorCorrectLevel = QRCodeLib.QRErrorCorrectLevel;
exports.QRCode = QRCodeLib.QRCode;

function QRCodeDraw(){}

QRCodeDraw.prototype = {
  scale:4,//4 px module size
  defaultMargin:20,
  marginScaleFactor:5,
  Array:(typeof Uint32Array == 'undefined'?Uint32Array:Array),
  // you may configure the error behavior for input string too long
  errorBehavior:{
    length:'trim'
  },
  color:{
    dark:'black',
    light:'white'
  },
  defaultErrorCorrectLevel:QRCodeLib.QRErrorCorrectLevel.H,
  QRErrorCorrectLevel:QRCodeLib.QRErrorCorrectLevel,
  draw:function(canvas,text,options,cb){

    var level,
    error,
    errorCorrectLevel;
    
    var args = Array.prototype.slice.call(arguments);
    cb = args.pop(); 
    canvas = args.shift();
    text = args.shift();
    options = args.shift()||{};

    
    if(typeof cb != 'function') {
      //enforce callback api just in case the processing can be made async in the future
      // or support proc open to libqrencode
      throw new Error('callback required');
    }
    
    if(typeof options !== "object"){
      options.errorCorrectLevel = options;
    }
    

    this.QRVersion(
      text
      ,options.errorCorrectLevel||this.QRErrorCorrectLevel.H
      ,options.version
    ,function(e,t,l,ec){

      text = t,level = l,error = e,errorCorrectLevel = ec;
    });

    this.scale = options.scale||this.scale;
    this.margin = typeof(options.margin) === 'undefined' ? this.defaultMargin : options.margin;
    
    if(!level) {
      //if we are unable to find an appropriate qr level error out
      cb(error,canvas);
      return;
    }

    //create qrcode!
    try{
      
      var qr = new QRCodeLib.QRCode(level, errorCorrectLevel)
      , scale = this.scale||4
      , ctx = canvas.getContext('2d')
      , width = 0;

      qr.addData(text);
      qr.make();

      var margin = this.marginWidth();
      var currenty = margin;
      width = this.dataWidth(qr)+ margin*2;
      
      this.resetCanvas(canvas,ctx,width);

      for (var r = 0,rl=qr.getModuleCount(); r < rl; r++) {
        var currentx = margin;
        for (var c = 0,cl=qr.getModuleCount(); c < cl; c++) {
          if (qr.isDark(r, c) ) {
            ctx.fillStyle = this.color.dark;
            ctx.fillRect (currentx, currenty, scale, scale);
          } else if(this.color.light){
            //if falsy configured color
            ctx.fillStyle = this.color.light;
            ctx.fillRect (currentx, currenty, scale, scale);
          }
          currentx += scale;
        }
        currenty += scale;
      }
    } catch (e) {
      error = e;
    }
    
    cb(error,canvas,width);    
  },
  drawBitArray:function(text/*,errorCorrectLevel,options,cb*/) {

    var args = Array.prototype.slice.call(arguments),
      cb = args.pop(),
      text = args.shift(),
      errorCorrectLevel = args.shift(),
      options = args.shift() || {};

    //argument processing
    if(typeof cb != 'function') {
      //enforce callback api just in case the processing can be made async in the future
      // or support proc open to libqrencode
      throw new Error('callback required as last argument');
    }
    
    cb = arguments[arguments.length-1]; 
    
    if(arguments.length > 2){
      errorCorrectLevel = arguments[2];
    }


    //this interface kinda sucks - there is very small likelyhood of this ever being async
    this.QRVersion(text,errorCorrectLevel,(options||{}).version,function(e,t,l,ec){
      text = t,level = l,error = e,errorCorrectLevel = ec;
    });


    if(!level) {
      //if we are unable to find an appropriate qr level error out
      cb(error,[],0);
      return;
    }

    //create qrcode!
    try{

      var qr = new QRCodeLib.QRCode(level, errorCorrectLevel)
      , scale = this.scale||4
      , width = 0,bits,bitc=0,currenty=0;
      
      qr.addData(text);
      qr.make();
      
      width = this.dataWidth(qr,1);
      bits = new this.Array(width*width);

      
      for (var r = 0,rl=qr.getModuleCount(); r < rl; r++) {
        for (var c = 0,cl=qr.getModuleCount(); c < cl; c++) {
          if (qr.isDark(r, c) ) {
            bits[bitc] = 1;
          } else {
            bits[bitc] = 0;
          }
          bitc++;
        }
      }
    } catch (e) {
      error = e;
      console.log(e.stack);
    }
    
    cb(error,bits,width);
  },
  QRVersion:function(text,errorCorrectLevel,version,cb){
    var c = bops.from(text).length,// BINARY LENGTH!
        error,
        errorCorrectLevel = this.QRErrorCorrectLevel[errorCorrectLevel]||this.defaultErrorCorrectLevel,
        errorCorrectIndex = [1,0,3,2],//fix odd mapping to order in table
        keys = ['L','M','Q','H'],
        capacity = 0,
        versionSpecified = false;
        
    if(typeof version !== "undefined" && version !== null) {
      versionSpecified = true;
    }
    //TODO ADD THROW FOR INVALID errorCorrectLevel...?
    
    if(versionSpecified){
      //console.log('SPECIFIED VERSION! ',version);
      //i have specified a version. this will give me a fixed size qr code. version must be valid. 1-40
      capacity = QRVersionCapacityTable[version][errorCorrectIndex[errorCorrectLevel]];
      
    } else {
      //figure out what version can hold the amount of text
      for(var i=0,j=QRVersionCapacityTable.length;i<j;i++) {
        capacity = QRVersionCapacityTable[i][errorCorrectIndex[errorCorrectLevel]];
        if(c < QRVersionCapacityTable[i][errorCorrectIndex[errorCorrectLevel]]){
          version = i+1;
          break;
        }
      }
      //if not version set to max
      if(!version) {
        version = QRVersionCapacityTable.length-1;
      }
    }
    
    if(capacity < c){
      if(this.errorBehavior.length == 'trim'){
        text = text.substr(0,capacity);
        level = QRVersionCapacityTable.length; 
      } else {
        error = new Error('input string too long for error correction '
          +keys[errorCorrectIndex[errorCorrectLevel]]
          +' max length '
          + capacity
          +' for qrcode version '+version
        );
      }
    }
  
    if(cb) {
      cb(error,text,version,errorCorrectLevel);
    }
    return version;
  },
  marginWidth:function(){
    var margin = this.margin;
    this.scale = this.scale||4;
    //elegant white space next to code is required by spec
    if ((this.scale * this.marginScaleFactor > margin) && margin > 0){
      margin = this.scale * this.marginScaleFactor;
    }
    return margin;
  },
  dataWidth:function(qr,scale){
    return qr.getModuleCount()*(scale||this.scale||4);
  },
  resetCanvas:function(canvas,ctx,width){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(!canvas.style) canvas.style = {};
    canvas.style.height = canvas.height = width;//square!
    canvas.style.width = canvas.width = width;
    
    if(this.color.light){
      ctx.fillStyle = this.color.light; 
      ctx.fillRect(0,0,canvas.width,canvas.height);
    } else {
      //support transparent backgrounds?
      //not exactly to spec but i really would like someone to be able to add a background with heavily reduced luminosity for simple branding
      //i could just ditch this because you could also just set #******00 as the color =P
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
  }
};


},{"./qrcapacitytable.js":1,"./qrcode.js":3,"bops":4}],3:[function(require,module,exports){
var bops = require('bops');

/**
 * QRCode for JavaScript
 *
 * modified by Ryan Day for nodejs support
 * Copyright (c) 2011 Ryan Day
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * EXPORTS:
 *	{
 *	QRCode:QRCode
 *	QRErrorCorrectLevel:QRErrorCorrectLevel
 *	}
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of 
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
*/

//---------------------------------------------------------------------
// QRCode
//---------------------------------------------------------------------

exports.QRCode = QRCode;

var QRDataArray = (typeof Uint32Array == 'undefined'?Uint32Array:Array);

function QRCode(typeNumber, errorCorrectLevel) {
	this.typeNumber = typeNumber;
	this.errorCorrectLevel = errorCorrectLevel;
	this.modules = null;
	this.moduleCount = 0;
	this.dataCache = null;
	this.dataList = new QRDataArray();
}

QRCode.prototype = {
	
	addData : function(data) {
		var newData = new QR8bitByte(data);

		this.dataList.push(newData);
		this.dataCache = null;
	},
	
	isDark : function(row, col) {
		if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
			throw new Error(row + "," + col);
		}
		return this.modules[row][col];
	},

	getModuleCount : function() {
		return this.moduleCount;
	},
	
	make : function() {
		this.makeImpl(false, this.getBestMaskPattern() );
	},
	
	makeImpl : function(test, maskPattern) {
		
		this.moduleCount = this.typeNumber * 4 + 17;
		this.modules = new QRDataArray(this.moduleCount);
		
		for (var row = 0; row < this.moduleCount; row++) {
			
			this.modules[row] = new QRDataArray(this.moduleCount);
			
			for (var col = 0; col < this.moduleCount; col++) {
				this.modules[row][col] = null;//(col + row) % 3;
			}
		}
	
		this.setupPositionProbePattern(0, 0);
		this.setupPositionProbePattern(this.moduleCount - 7, 0);
		this.setupPositionProbePattern(0, this.moduleCount - 7);
		this.setupPositionAdjustPattern();
		this.setupTimingPattern();
		this.setupTypeInfo(test, maskPattern);
		
		if (this.typeNumber >= 7) {
			this.setupTypeNumber(test);
		}
	
		if (this.dataCache == null) {
			this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
		}
	
		this.mapData(this.dataCache, maskPattern);
	},

	setupPositionProbePattern : function(row, col)  {
		
		for (var r = -1; r <= 7; r++) {
			
			if (row + r <= -1 || this.moduleCount <= row + r) continue;
			
			for (var c = -1; c <= 7; c++) {
				
				if (col + c <= -1 || this.moduleCount <= col + c) continue;
				
				if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
						|| (0 <= c && c <= 6 && (r == 0 || r == 6) )
						|| (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
					this.modules[row + r][col + c] = true;
				} else {
					this.modules[row + r][col + c] = false;
				}
			}		
		}		
	},
	
	getBestMaskPattern : function() {
	
		var minLostPoint = 0;
		var pattern = 0;
	
		for (var i = 0; i < 8; i++) {
			
			this.makeImpl(true, i);
	
			var lostPoint = QRUtil.getLostPoint(this);
	
			if (i == 0 || minLostPoint >  lostPoint) {
				minLostPoint = lostPoint;
				pattern = i;
			}
		}
	
		return pattern;
	},

	setupTimingPattern : function() {
		
		for (var r = 8; r < this.moduleCount - 8; r++) {
			if (this.modules[r][6] != null) {
				continue;
			}
			this.modules[r][6] = (r % 2 == 0);
		}
	
		for (var c = 8; c < this.moduleCount - 8; c++) {
			if (this.modules[6][c] != null) {
				continue;
			}
			this.modules[6][c] = (c % 2 == 0);
		}
	},
	
	setupPositionAdjustPattern : function() {
	
		var pos = QRUtil.getPatternPosition(this.typeNumber);
		pos = pos || '';
		for (var i = 0; i < pos.length; i++) {
		
			for (var j = 0; j < pos.length; j++) {
			
				var row = pos[i];
				var col = pos[j];
				
				if (this.modules[row][col] != null) {
					continue;
				}
				
				for (var r = -2; r <= 2; r++) {
				
					for (var c = -2; c <= 2; c++) {
					
						if (r == -2 || r == 2 || c == -2 || c == 2 
								|| (r == 0 && c == 0) ) {
							this.modules[row + r][col + c] = true;
						} else {
							this.modules[row + r][col + c] = false;
						}
					}
				}
			}
		}
	},
	
	setupTypeNumber : function(test) {
	
		var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
	
		for (var i = 0; i < 18; i++) {
			var mod = (!test && ( (bits >> i) & 1) == 1);
			this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
		}
	
		for (var i = 0; i < 18; i++) {
			var mod = (!test && ( (bits >> i) & 1) == 1);
			this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
		}
	},
	
	setupTypeInfo : function(test, maskPattern) {
	
		var data = (this.errorCorrectLevel << 3) | maskPattern;
		var bits = QRUtil.getBCHTypeInfo(data);
	
		// vertical		
		for (var i = 0; i < 15; i++) {
	
			var mod = (!test && ( (bits >> i) & 1) == 1);
	
			if (i < 6) {
				this.modules[i][8] = mod;
			} else if (i < 8) {
				this.modules[i + 1][8] = mod;
			} else {
				this.modules[this.moduleCount - 15 + i][8] = mod;
			}
		}
	
		// horizontal
		for (var i = 0; i < 15; i++) {
	
			var mod = (!test && ( (bits >> i) & 1) == 1);
			
			if (i < 8) {
				this.modules[8][this.moduleCount - i - 1] = mod;
			} else if (i < 9) {
				this.modules[8][15 - i - 1 + 1] = mod;
			} else {
				this.modules[8][15 - i - 1] = mod;
			}
		}
	
		// fixed module
		this.modules[this.moduleCount - 8][8] = (!test);
	
	},
	
	mapData : function(data, maskPattern) {
		
		var inc = -1;
		var row = this.moduleCount - 1;
		var bitIndex = 7;
		var byteIndex = 0;
		
		for (var col = this.moduleCount - 1; col > 0; col -= 2) {
	
			if (col == 6) col--;
	
			while (true) {
	
				for (var c = 0; c < 2; c++) {
					
					if (this.modules[row][col - c] == null) {
						
						var dark = false;
	
						if (byteIndex < data.length) {
							dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
						}
	
						var mask = QRUtil.getMask(maskPattern, row, col - c);
	
						if (mask) {
							dark = !dark;
						}
						
						this.modules[row][col - c] = dark;
						bitIndex--;
	
						if (bitIndex == -1) {
							byteIndex++;
							bitIndex = 7;
						}
					}
				}
								
				row += inc;
	
				if (row < 0 || this.moduleCount <= row) {
					row -= inc;
					inc = -inc;
					break;
				}
			}
		}
		
	}

};

QRCode.PAD0 = 0xEC;
QRCode.PAD1 = 0x11;

QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
	
	var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
	
	var buffer = new QRBitBuffer();
	
	for (var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		buffer.put(data.mode, 4);
		buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
		data.write(buffer);
	}

	// calc num max data.
	var totalDataCount = 0;
	for (var i = 0; i < rsBlocks.length; i++) {
		totalDataCount += rsBlocks[i].dataCount;
	}

	if (buffer.getLengthInBits() > totalDataCount * 8) {
		throw new Error("code length overflow. ("
			+ buffer.getLengthInBits()
			+ ">"
			+  totalDataCount * 8
			+ ")");
	}

	// end code
	if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
		buffer.put(0, 4);
	}

	// padding
	while (buffer.getLengthInBits() % 8 != 0) {
		buffer.putBit(false);
	}

	// padding
	while (true) {
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD0, 8);
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD1, 8);
	}

	return QRCode.createBytes(buffer, rsBlocks);
};

QRCode.createBytes = function(buffer, rsBlocks) {

	var offset = 0;
	
	var maxDcCount = 0;
	var maxEcCount = 0;
	
	var dcdata = new QRDataArray(rsBlocks.length);
	var ecdata = new QRDataArray(rsBlocks.length);
	
	for (var r = 0; r < rsBlocks.length; r++) {

		var dcCount = rsBlocks[r].dataCount;
		var ecCount = rsBlocks[r].totalCount - dcCount;

		maxDcCount = Math.max(maxDcCount, dcCount);
		maxEcCount = Math.max(maxEcCount, ecCount);
		
		dcdata[r] = new QRDataArray(dcCount);
		
		for (var i = 0; i < dcdata[r].length; i++) {
			dcdata[r][i] = 0xff & buffer.buffer[i + offset];
		}
		offset += dcCount;
		
		var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
		var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);

		var modPoly = rawPoly.mod(rsPoly);
		ecdata[r] = new QRDataArray(rsPoly.getLength() - 1);
		for (var i = 0; i < ecdata[r].length; i++) {
            var modIndex = i + modPoly.getLength() - ecdata[r].length;
			ecdata[r][i] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
		}

	}
	
	var totalCodeCount = 0;
	for (var i = 0; i < rsBlocks.length; i++) {
		totalCodeCount += rsBlocks[i].totalCount;
	}

	var data = new QRDataArray(totalCodeCount);
	var index = 0;

	for (var i = 0; i < maxDcCount; i++) {
		for (var r = 0; r < rsBlocks.length; r++) {
			if (i < dcdata[r].length) {
				data[index++] = dcdata[r][i];
			}
		}
	}

	for (var i = 0; i < maxEcCount; i++) {
		for (var r = 0; r < rsBlocks.length; r++) {
			if (i < ecdata[r].length) {
				data[index++] = ecdata[r][i];
			}
		}
	}

	return data;

};

//---------------------------------------------------------------------
// QR8bitByte
//---------------------------------------------------------------------
function QR8bitByte(data) {
  this.mode = QRMode.MODE_8BIT_BYTE;
  this.data = data;
  var byteArray = [];
  
  this.parsedData = bops.from(data);
}

QR8bitByte.prototype = {
  getLength: function (buffer) {
    return this.parsedData.length;
  },
  write: function (buffer) {
    for (var i = 0, l = this.parsedData.length; i < l; i++) {
      buffer.put(this.parsedData[i], 8);
    }
  }
};


//---------------------------------------------------------------------
// QRMode
//---------------------------------------------------------------------

var QRMode = {
	MODE_NUMBER :		1 << 0,
	MODE_ALPHA_NUM : 	1 << 1,
	MODE_8BIT_BYTE : 	1 << 2,
	MODE_KANJI :		1 << 3
};

//---------------------------------------------------------------------
// QRErrorCorrectLevel
//---------------------------------------------------------------------
//exported

var QRErrorCorrectLevel = exports.QRErrorCorrectLevel = {
	L : 1,
	M : 0,
	Q : 3,
	H : 2
};

//---------------------------------------------------------------------
// QRMaskPattern
//---------------------------------------------------------------------

var QRMaskPattern =  {
	PATTERN000 : 0,
	PATTERN001 : 1,
	PATTERN010 : 2,
	PATTERN011 : 3,
	PATTERN100 : 4,
	PATTERN101 : 5,
	PATTERN110 : 6,
	PATTERN111 : 7
};

//---------------------------------------------------------------------
// QRUtil
//---------------------------------------------------------------------
 
var QRUtil = {

    PATTERN_POSITION_TABLE : [
	    [],
	    [6, 18],
	    [6, 22],
	    [6, 26],
	    [6, 30],
	    [6, 34],
	    [6, 22, 38],
	    [6, 24, 42],
	    [6, 26, 46],
	    [6, 28, 50],
	    [6, 30, 54],		
	    [6, 32, 58],
	    [6, 34, 62],
	    [6, 26, 46, 66],
	    [6, 26, 48, 70],
	    [6, 26, 50, 74],
	    [6, 30, 54, 78],
	    [6, 30, 56, 82],
	    [6, 30, 58, 86],
	    [6, 34, 62, 90],
	    [6, 28, 50, 72, 94],
	    [6, 26, 50, 74, 98],
	    [6, 30, 54, 78, 102],
	    [6, 28, 54, 80, 106],
	    [6, 32, 58, 84, 110],
	    [6, 30, 58, 86, 114],
	    [6, 34, 62, 90, 118],
	    [6, 26, 50, 74, 98, 122],
	    [6, 30, 54, 78, 102, 126],
	    [6, 26, 52, 78, 104, 130],
	    [6, 30, 56, 82, 108, 134],
	    [6, 34, 60, 86, 112, 138],
	    [6, 30, 58, 86, 114, 142],
	    [6, 34, 62, 90, 118, 146],
	    [6, 30, 54, 78, 102, 126, 150],
	    [6, 24, 50, 76, 102, 128, 154],
	    [6, 28, 54, 80, 106, 132, 158],
	    [6, 32, 58, 84, 110, 136, 162],
	    [6, 26, 54, 82, 110, 138, 166],
	    [6, 30, 58, 86, 114, 142, 170]
    ],

    G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)	| (1 << 4) | (1 << 1),

    getBCHTypeInfo : function(data) {
	    var d = data << 10;
	    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
		    d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) ) ); 	
	    }
	    return ( (data << 10) | d) ^ QRUtil.G15_MASK;
    },

    getBCHTypeNumber : function(data) {
	    var d = data << 12;
	    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
		    d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) ) ); 	
	    }
	    return (data << 12) | d;
    },

    getBCHDigit : function(data) {

	    var digit = 0;

	    while (data != 0) {
		    digit++;
		    data >>>= 1;
	    }

	    return digit;
    },

    getPatternPosition : function(typeNumber) {
	    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },

    getMask : function(maskPattern, i, j) {
	    
	    switch (maskPattern) {
		    
	    case QRMaskPattern.PATTERN000 : return (i + j) % 2 == 0;
	    case QRMaskPattern.PATTERN001 : return i % 2 == 0;
	    case QRMaskPattern.PATTERN010 : return j % 3 == 0;
	    case QRMaskPattern.PATTERN011 : return (i + j) % 3 == 0;
	    case QRMaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0;
	    case QRMaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 == 0;
	    case QRMaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 == 0;
	    case QRMaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 == 0;

	    default :
		    throw new Error("bad maskPattern:" + maskPattern);
	    }
    },

    getErrorCorrectPolynomial : function(errorCorrectLength) {

	    var a = new QRPolynomial([1], 0);

	    for (var i = 0; i < errorCorrectLength; i++) {
		    a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0) );
	    }

	    return a;
    },

    getLengthInBits : function(mode, type) {

	    if (1 <= type && type < 10) {

		    // 1 - 9

		    switch(mode) {
		    case QRMode.MODE_NUMBER 	: return 10;
		    case QRMode.MODE_ALPHA_NUM 	: return 9;
		    case QRMode.MODE_8BIT_BYTE	: return 8;
		    case QRMode.MODE_KANJI  	: return 8;
		    default :
			    throw new Error("mode:" + mode);
		    }

	    } else if (type < 27) {

		    // 10 - 26

		    switch(mode) {
		    case QRMode.MODE_NUMBER 	: return 12;
		    case QRMode.MODE_ALPHA_NUM 	: return 11;
		    case QRMode.MODE_8BIT_BYTE	: return 16;
		    case QRMode.MODE_KANJI  	: return 10;
		    default :
			    throw new Error("mode:" + mode);
		    }

	    } else if (type < 41) {

		    // 27 - 40

		    switch(mode) {
		    case QRMode.MODE_NUMBER 	: return 14;
		    case QRMode.MODE_ALPHA_NUM	: return 13;
		    case QRMode.MODE_8BIT_BYTE	: return 16;
		    case QRMode.MODE_KANJI  	: return 12;
		    default :
			    throw new Error("mode:" + mode);
		    }

	    } else {
		    throw new Error("type:" + type);
	    }
    },

    getLostPoint : function(qrCode) {
	    
	    var moduleCount = qrCode.getModuleCount();
	    
	    var lostPoint = 0;
	    
	    // LEVEL1
	    
	    for (var row = 0; row < moduleCount; row++) {

		    for (var col = 0; col < moduleCount; col++) {

			    var sameCount = 0;
			    var dark = qrCode.isDark(row, col);

				for (var r = -1; r <= 1; r++) {

				    if (row + r < 0 || moduleCount <= row + r) {
					    continue;
				    }

				    for (var c = -1; c <= 1; c++) {

					    if (col + c < 0 || moduleCount <= col + c) {
						    continue;
					    }

					    if (r == 0 && c == 0) {
						    continue;
					    }

					    if (dark == qrCode.isDark(row + r, col + c) ) {
						    sameCount++;
					    }
				    }
			    }

			    if (sameCount > 5) {
				    lostPoint += (3 + sameCount - 5);
			    }
		    }
	    }

	    // LEVEL2

	    for (var row = 0; row < moduleCount - 1; row++) {
		    for (var col = 0; col < moduleCount - 1; col++) {
			    var count = 0;
			    if (qrCode.isDark(row,     col    ) ) count++;
			    if (qrCode.isDark(row + 1, col    ) ) count++;
			    if (qrCode.isDark(row,     col + 1) ) count++;
			    if (qrCode.isDark(row + 1, col + 1) ) count++;
			    if (count == 0 || count == 4) {
				    lostPoint += 3;
			    }
		    }
	    }

	    // LEVEL3

	    for (var row = 0; row < moduleCount; row++) {
		    for (var col = 0; col < moduleCount - 6; col++) {
			    if (qrCode.isDark(row, col)
					    && !qrCode.isDark(row, col + 1)
					    &&  qrCode.isDark(row, col + 2)
					    &&  qrCode.isDark(row, col + 3)
					    &&  qrCode.isDark(row, col + 4)
					    && !qrCode.isDark(row, col + 5)
					    &&  qrCode.isDark(row, col + 6) ) {
				    lostPoint += 40;
			    }
		    }
	    }

	    for (var col = 0; col < moduleCount; col++) {
		    for (var row = 0; row < moduleCount - 6; row++) {
			    if (qrCode.isDark(row, col)
					    && !qrCode.isDark(row + 1, col)
					    &&  qrCode.isDark(row + 2, col)
					    &&  qrCode.isDark(row + 3, col)
					    &&  qrCode.isDark(row + 4, col)
					    && !qrCode.isDark(row + 5, col)
					    &&  qrCode.isDark(row + 6, col) ) {
				    lostPoint += 40;
			    }
		    }
	    }

	    // LEVEL4
	    
	    var darkCount = 0;

	    for (var col = 0; col < moduleCount; col++) {
		    for (var row = 0; row < moduleCount; row++) {
			    if (qrCode.isDark(row, col) ) {
				    darkCount++;
			    }
		    }
	    }
	    
	    var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
	    lostPoint += ratio * 10;

	    return lostPoint;		
    }

};


//---------------------------------------------------------------------
// QRMath
//---------------------------------------------------------------------

var QRMath = {

	glog : function(n) {
	
		if (n < 1) {
			throw new Error("glog(" + n + ")");
		}
		
		return QRMath.LOG_TABLE[n];
	},
	
	gexp : function(n) {
	
		while (n < 0) {
			n += 255;
		}
	
		while (n >= 256) {
			n -= 255;
		}
	
		return QRMath.EXP_TABLE[n];
	},
	
	EXP_TABLE : new Array(256),
	
	LOG_TABLE : new Array(256)

};
	
for (var i = 0; i < 8; i++) {
	QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
	QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4]
		^ QRMath.EXP_TABLE[i - 5]
		^ QRMath.EXP_TABLE[i - 6]
		^ QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
	QRMath.LOG_TABLE[QRMath.EXP_TABLE[i] ] = i;
}

//---------------------------------------------------------------------
// QRPolynomial
//---------------------------------------------------------------------

function QRPolynomial(num, shift) {

	if (num.length == undefined) {
		throw new Error(num.length + "/" + shift);
	}

	var offset = 0;

	while (offset < num.length && num[offset] == 0) {
		offset++;
	}

	this.num = new Array(num.length - offset + shift);
	for (var i = 0; i < num.length - offset; i++) {
		this.num[i] = num[i + offset];
	}
}

QRPolynomial.prototype = {

	get : function(index) {
		return this.num[index];
	},
	
	getLength : function() {
		return this.num.length;
	},
	
	multiply : function(e) {
	
		var num = new Array(this.getLength() + e.getLength() - 1);
	
		for (var i = 0; i < this.getLength(); i++) {
			for (var j = 0; j < e.getLength(); j++) {
				num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i) ) + QRMath.glog(e.get(j) ) );
			}
		}
	
		return new QRPolynomial(num, 0);
	},
	
	mod : function(e) {
	
		if (this.getLength() - e.getLength() < 0) {
			return this;
		}
	
		var ratio = QRMath.glog(this.get(0) ) - QRMath.glog(e.get(0) );
	
		var num = new Array(this.getLength() );
		
		for (var i = 0; i < this.getLength(); i++) {
			num[i] = this.get(i);
		}
		
		for (var i = 0; i < e.getLength(); i++) {
			num[i] ^= QRMath.gexp(QRMath.glog(e.get(i) ) + ratio);
		}
	
		// recursive call
		return new QRPolynomial(num, 0).mod(e);
	}
};

//---------------------------------------------------------------------
// QRRSBlock
//---------------------------------------------------------------------

function QRRSBlock(totalCount, dataCount) {
	this.totalCount = totalCount;
	this.dataCount  = dataCount;
}

QRRSBlock.RS_BLOCK_TABLE = [
// L
// M
// Q
// H

// 1
[1, 26, 19],
[1, 26, 16],
[1, 26, 13],
[1, 26, 9],
// 2
[1, 44, 34],
[1, 44, 28],
[1, 44, 22],
[1, 44, 16],
// 3
[1, 70, 55],
[1, 70, 44],
[2, 35, 17],
[2, 35, 13],
// 4		
[1, 100, 80],
[2, 50, 32],
[2, 50, 24],
[4, 25, 9],
// 5
[1, 134, 108],
[2, 67, 43],
[2, 33, 15, 2, 34, 16],
[2, 33, 11, 2, 34, 12],
// 6
[2, 86, 68],
[4, 43, 27],
[4, 43, 19],
[4, 43, 15],
// 7		
[2, 98, 78],
[4, 49, 31],
[2, 32, 14, 4, 33, 15],
[4, 39, 13, 1, 40, 14],
// 8
[2, 121, 97],
[2, 60, 38, 2, 61, 39],
[4, 40, 18, 2, 41, 19],
[4, 40, 14, 2, 41, 15],
// 9
[2, 146, 116],
[3, 58, 36, 2, 59, 37],
[4, 36, 16, 4, 37, 17],
[4, 36, 12, 4, 37, 13],
// 10		
[2, 86, 68, 2, 87, 69],
[4, 69, 43, 1, 70, 44],
[6, 43, 19, 2, 44, 20],
[6, 43, 15, 2, 44, 16]
//NOTE added by Ryan Day.to make greater than version 10 qrcodes
// this table starts on page 40 of the spec PDF. google ISO/IEC 18004
// 11
,[4,101,81]
,[1,80,50,4,81,51]
,[4,50,22,4,51,23]
,[3,36,12,8,37,13]
//12
,[2,116,92,2,117,93]
,[6,58,36,2,59,37]
,[4,46,20,6,47,21]
,[7,42,14,4,43,15]
//13
,[4,133,107]
,[8,59,37,1,60,38]
,[8,44,20,4,45,21]
,[12,33,11,4,34,12]
//14
,[3,145,115,1,146,116]
,[4,64,40,5,65,41]
,[11,36,16,5,37,17]
,[11,36,12,5,37,13]
//15
,[5,109,87,1,110,88]
,[5,65,41,5,66,42]
,[5,54,24,7,55,25]
,[11,36,12,7,37,13]
//16
,[5,122,98,1,123,99]
,[7,73,45,3,74,46]
,[15,43,19,2,44,20]
,[3,45,15,13,46,16]
//17
,[1,135,107,5,136,108]
,[10,74,46,1,75,47]
,[1,50,22,15,51,23]
,[2,42,14,17,43,15]
//18
,[5,150,120,1,151,121]
,[9,69,43,4,70,44]
,[17,50,22,1,51,23]
,[2,42,14,19,43,15]
//19
,[3,141,113,4,142,114]
,[3,70,44,11,71,45]
,[17,47,21,4,48,22]
,[9,39,13,16,40,14]
//20
,[3,135,107,5,136,108]
,[3,67,41,13,68,42]
,[15,54,24,5,55,25]
,[15,43,15,10,44,16]
//21
,[4,144,116,4,145,117]
,[17,68,42]
,[17,50,22,6,51,23]
,[19,46,16,6,47,17]
//22
,[2,139,111,7,140,112]
,[17,74,46]
,[7,54,24,16,55,25]
,[34,37,13]
//23
,[4,151,121,5,152,122]
,[4,75,47,14,76,48]
,[11,54,24,14,55,25]
,[16,45,15,14,46,16]
//24
,[6,147,117,4,148,118]
,[6,73,45,14,74,46]
,[11,54,24,16,55,25]
,[30,46,16,2,47,17]
//25
,[8,132,106,4,133,107]
,[8,75,47,13,76,48]
,[7,54,24,22,55,25]
,[22,45,15,13,46,16]
//26
,[10,142,114,2,143,115]
,[19,74,46,4,75,47]
,[28,50,22,6,51,23]
,[33,46,16,4,47,17]
//27
,[8,152,122,4,153,123]
,[22,73,45,3,74,46]
,[8,53,23,26,54,24]
,[12,45,15,28,46,16]
//28
,[3,147,117,10,148,118]
,[3,73,45,23,74,46]
,[4,54,24,31,55,25]
,[11,45,15,31,46,16]
//29
,[7,146,116,7,147,117]
,[21,73,45,7,74,46]
,[1,53,23,37,54,24]
,[19,45,15,26,46,16]
//30
,[5,145,115,10,146,116]
,[19,75,47,10,76,48]
,[15,54,24,25,55,25]
,[23,45,15,25,46,16]
//31
,[13,145,115,3,146,116]
,[2,74,46,29,75,47]
,[42,54,24,1,55,25]
,[23,45,15,28,46,16]
//32
,[17,145,115]
,[10,74,46,23,75,47]
,[10,54,24,35,55,25]
,[19,45,15,35,46,16]
//33
,[17,145,115,1,146,116]
,[14,74,46,21,75,47]
,[29,54,24,19,55,25]
,[11,45,15,46,46,16]
//34
,[13,145,115,6,146,116]
,[14,74,46,23,75,47]
,[44,54,24,7,55,25]
,[59,46,16,1,47,17]
//35
,[12,151,121,7,152,122]
,[12,75,47,26,76,48]
,[39,54,24,14,55,25]
,[22,45,15,41,46,16]
//36
,[6,151,121,14,152,122]
,[6,75,47,34,76,48]
,[46,54,24,10,55,25]
,[2,45,15,64,46,16]
//37
,[17,152,122,4,153,123]
,[29,74,46,14,75,47]
,[49,54,24,10,55,25]
,[24,45,15,46,46,16]
//38
,[4,152,122,18,153,123]
,[13,74,46,32,75,47]
,[48,54,24,14,55,25]
,[42,45,15,32,46,16]
//39
,[20,147,117,4,148,118]
,[40,75,47,7,76,48]
,[43,54,24,22,55,25]
,[10,45,15,67,46,16]
//40
,[19,148,118,6,149,119]
,[18,75,47,31,76,48]
,[34,54,24,34,55,25]
,[20,45,15,61,46,16]	
];

QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
	
	var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
	
	if (rsBlock == undefined) {
		throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
	}

	var length = rsBlock.length / 3;
	
	var list = new Array();
	
	for (var i = 0; i < length; i++) {

		var count = rsBlock[i * 3 + 0];
		var totalCount = rsBlock[i * 3 + 1];
		var dataCount  = rsBlock[i * 3 + 2];

		for (var j = 0; j < count; j++) {
			list.push(new QRRSBlock(totalCount, dataCount) );	
		}
	}
	
	return list;
}

QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {

	switch(errorCorrectLevel) {
	case QRErrorCorrectLevel.L :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
	case QRErrorCorrectLevel.M :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
	case QRErrorCorrectLevel.Q :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
	case QRErrorCorrectLevel.H :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
	default :
		return undefined;
	}
}

//---------------------------------------------------------------------
// QRBitBuffer
//---------------------------------------------------------------------

function QRBitBuffer() {
	this.buffer = new Array();
	this.length = 0;
}

QRBitBuffer.prototype = {

	get : function(index) {
		var bufIndex = Math.floor(index / 8);
		return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
	},
	
	put : function(num, length) {
		for (var i = 0; i < length; i++) {
			this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
		}
	},
	
	getLengthInBits : function() {
		return this.length;
	},
	
	putBit : function(bit) {
	
		var bufIndex = Math.floor(this.length / 8);
		if (this.buffer.length <= bufIndex) {
			this.buffer.push(0);
		}
	
		if (bit) {
			this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
		}
	
		this.length++;
	}
};

},{"bops":4}],4:[function(require,module,exports){
var proto = {}
module.exports = proto

proto.from = require('./from.js')
proto.to = require('./to.js')
proto.is = require('./is.js')
proto.subarray = require('./subarray.js')
proto.join = require('./join.js')
proto.copy = require('./copy.js')
proto.create = require('./create.js')

mix(require('./read.js'), proto)
mix(require('./write.js'), proto)

function mix(from, into) {
  for(var key in from) {
    into[key] = from[key]
  }
}

},{"./copy.js":7,"./create.js":8,"./from.js":9,"./is.js":10,"./join.js":11,"./read.js":13,"./subarray.js":14,"./to.js":15,"./write.js":16}],5:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],6:[function(require,module,exports){
module.exports = to_utf8

var out = []
  , col = []
  , fcc = String.fromCharCode
  , mask = [0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01]
  , unmask = [
      0x00
    , 0x01
    , 0x02 | 0x01
    , 0x04 | 0x02 | 0x01
    , 0x08 | 0x04 | 0x02 | 0x01
    , 0x10 | 0x08 | 0x04 | 0x02 | 0x01
    , 0x20 | 0x10 | 0x08 | 0x04 | 0x02 | 0x01
    , 0x40 | 0x20 | 0x10 | 0x08 | 0x04 | 0x02 | 0x01
  ]

function to_utf8(bytes, start, end) {
  start = start === undefined ? 0 : start
  end = end === undefined ? bytes.length : end

  var idx = 0
    , hi = 0x80
    , collecting = 0
    , pos
    , by

  col.length =
  out.length = 0

  while(idx < bytes.length) {
    by = bytes[idx]
    if(!collecting && by & hi) {
      pos = find_pad_position(by)
      collecting += pos
      if(pos < 8) {
        col[col.length] = by & unmask[6 - pos]
      }
    } else if(collecting) {
      col[col.length] = by & unmask[6]
      --collecting
      if(!collecting && col.length) {
        out[out.length] = fcc(reduced(col, pos))
        col.length = 0
      }
    } else { 
      out[out.length] = fcc(by)
    }
    ++idx
  }
  if(col.length && !collecting) {
    out[out.length] = fcc(reduced(col, pos))
    col.length = 0
  }
  return out.join('')
}

function find_pad_position(byt) {
  for(var i = 0; i < 7; ++i) {
    if(!(byt & mask[i])) {
      break
    }
  }
  return i
}

function reduced(list) {
  var out = 0
  for(var i = 0, len = list.length; i < len; ++i) {
    out |= list[i] << ((len - i - 1) * 6)
  }
  return out
}

},{}],7:[function(require,module,exports){
module.exports = copy

var slice = [].slice

function copy(source, target, target_start, source_start, source_end) {
  target_start = arguments.length < 3 ? 0 : target_start
  source_start = arguments.length < 4 ? 0 : source_start
  source_end = arguments.length < 5 ? source.length : source_end

  if(source_end === source_start) {
    return
  }

  if(target.length === 0 || source.length === 0) {
    return
  }

  if(source_end > source.length) {
    source_end = source.length
  }

  if(target.length - target_start < source_end - source_start) {
    source_end = target.length - target_start + start
  }

  if(source.buffer !== target.buffer) {
    return fast_copy(source, target, target_start, source_start, source_end)
  }
  return slow_copy(source, target, target_start, source_start, source_end)
}

function fast_copy(source, target, target_start, source_start, source_end) {
  var len = (source_end - source_start) + target_start

  for(var i = target_start, j = source_start;
      i < len;
      ++i,
      ++j) {
    target[i] = source[j]
  }
}

function slow_copy(from, to, j, i, jend) {
  // the buffers could overlap.
  var iend = jend + i
    , tmp = new Uint8Array(slice.call(from, i, iend))
    , x = 0

  for(; i < iend; ++i, ++x) {
    to[j++] = tmp[x]
  }
}

},{}],8:[function(require,module,exports){
module.exports = function(size) {
  return new Uint8Array(size)
}

},{}],9:[function(require,module,exports){
module.exports = from

var base64 = require('base64-js')

var decoders = {
    hex: from_hex
  , utf8: from_utf
  , base64: from_base64
}

function from(source, encoding) {
  if(Array.isArray(source)) {
    return new Uint8Array(source)
  }

  return decoders[encoding || 'utf8'](source)
}

function from_hex(str) {
  var size = str.length / 2
    , buf = new Uint8Array(size)
    , character = ''

  for(var i = 0, len = str.length; i < len; ++i) {
    character += str.charAt(i)

    if(i > 0 && (i % 2) === 1) {
      buf[i>>>1] = parseInt(character, 16)
      character = '' 
    }
  }

  return buf 
}

function from_utf(str) {
  var bytes = []
    , tmp
    , ch

  for(var i = 0, len = str.length; i < len; ++i) {
    ch = str.charCodeAt(i)
    if(ch & 0x80) {
      tmp = encodeURIComponent(str.charAt(i)).substr(1).split('%')
      for(var j = 0, jlen = tmp.length; j < jlen; ++j) {
        bytes[bytes.length] = parseInt(tmp[j], 16)
      }
    } else {
      bytes[bytes.length] = ch 
    }
  }

  return new Uint8Array(bytes)
}

function from_base64(str) {
  return new Uint8Array(base64.toByteArray(str)) 
}

},{"base64-js":5}],10:[function(require,module,exports){

module.exports = function(buffer) {
  return buffer instanceof Uint8Array;
}

},{}],11:[function(require,module,exports){
module.exports = join

function join(targets, hint) {
  if(!targets.length) {
    return new Uint8Array(0)
  }

  var len = hint !== undefined ? hint : get_length(targets)
    , out = new Uint8Array(len)
    , cur = targets[0]
    , curlen = cur.length
    , curidx = 0
    , curoff = 0
    , i = 0

  while(i < len) {
    if(curoff === curlen) {
      curoff = 0
      ++curidx
      cur = targets[curidx]
      curlen = cur && cur.length
      continue
    }
    out[i++] = cur[curoff++] 
  }

  return out
}

function get_length(targets) {
  var size = 0
  for(var i = 0, len = targets.length; i < len; ++i) {
    size += targets[i].byteLength
  }
  return size
}

},{}],12:[function(require,module,exports){
var proto
  , map

module.exports = proto = {}

map = typeof WeakMap === 'undefined' ? null : new WeakMap

proto.get = !map ? no_weakmap_get : get

function no_weakmap_get(target) {
  return new DataView(target.buffer, 0)
}

function get(target) {
  var out = map.get(target.buffer)
  if(!out) {
    map.set(target.buffer, out = new DataView(target.buffer, 0))
  }
  return out
}

},{}],13:[function(require,module,exports){
module.exports = {
    readUInt8:      read_uint8
  , readInt8:       read_int8
  , readUInt16LE:   read_uint16_le
  , readUInt32LE:   read_uint32_le
  , readInt16LE:    read_int16_le
  , readInt32LE:    read_int32_le
  , readFloatLE:    read_float_le
  , readDoubleLE:   read_double_le
  , readUInt16BE:   read_uint16_be
  , readUInt32BE:   read_uint32_be
  , readInt16BE:    read_int16_be
  , readInt32BE:    read_int32_be
  , readFloatBE:    read_float_be
  , readDoubleBE:   read_double_be
}

var map = require('./mapped.js')

function read_uint8(target, at) {
  return target[at]
}

function read_int8(target, at) {
  var v = target[at];
  return v < 0x80 ? v : v - 0x100
}

function read_uint16_le(target, at) {
  var dv = map.get(target);
  return dv.getUint16(at + target.byteOffset, true)
}

function read_uint32_le(target, at) {
  var dv = map.get(target);
  return dv.getUint32(at + target.byteOffset, true)
}

function read_int16_le(target, at) {
  var dv = map.get(target);
  return dv.getInt16(at + target.byteOffset, true)
}

function read_int32_le(target, at) {
  var dv = map.get(target);
  return dv.getInt32(at + target.byteOffset, true)
}

function read_float_le(target, at) {
  var dv = map.get(target);
  return dv.getFloat32(at + target.byteOffset, true)
}

function read_double_le(target, at) {
  var dv = map.get(target);
  return dv.getFloat64(at + target.byteOffset, true)
}

function read_uint16_be(target, at) {
  var dv = map.get(target);
  return dv.getUint16(at + target.byteOffset, false)
}

function read_uint32_be(target, at) {
  var dv = map.get(target);
  return dv.getUint32(at + target.byteOffset, false)
}

function read_int16_be(target, at) {
  var dv = map.get(target);
  return dv.getInt16(at + target.byteOffset, false)
}

function read_int32_be(target, at) {
  var dv = map.get(target);
  return dv.getInt32(at + target.byteOffset, false)
}

function read_float_be(target, at) {
  var dv = map.get(target);
  return dv.getFloat32(at + target.byteOffset, false)
}

function read_double_be(target, at) {
  var dv = map.get(target);
  return dv.getFloat64(at + target.byteOffset, false)
}

},{"./mapped.js":12}],14:[function(require,module,exports){
module.exports = subarray

function subarray(buf, from, to) {
  return buf.subarray(from || 0, to || buf.length)
}

},{}],15:[function(require,module,exports){
module.exports = to

var base64 = require('base64-js')
  , toutf8 = require('to-utf8')

var encoders = {
    hex: to_hex
  , utf8: to_utf
  , base64: to_base64
}

function to(buf, encoding) {
  return encoders[encoding || 'utf8'](buf)
}

function to_hex(buf) {
  var str = ''
    , byt

  for(var i = 0, len = buf.length; i < len; ++i) {
    byt = buf[i]
    str += ((byt & 0xF0) >>> 4).toString(16)
    str += (byt & 0x0F).toString(16)
  }

  return str
}

function to_utf(buf) {
  return toutf8(buf)
}

function to_base64(buf) {
  return base64.fromByteArray(buf)
}


},{"base64-js":5,"to-utf8":6}],16:[function(require,module,exports){
module.exports = {
    writeUInt8:      write_uint8
  , writeInt8:       write_int8
  , writeUInt16LE:   write_uint16_le
  , writeUInt32LE:   write_uint32_le
  , writeInt16LE:    write_int16_le
  , writeInt32LE:    write_int32_le
  , writeFloatLE:    write_float_le
  , writeDoubleLE:   write_double_le
  , writeUInt16BE:   write_uint16_be
  , writeUInt32BE:   write_uint32_be
  , writeInt16BE:    write_int16_be
  , writeInt32BE:    write_int32_be
  , writeFloatBE:    write_float_be
  , writeDoubleBE:   write_double_be
}

var map = require('./mapped.js')

function write_uint8(target, value, at) {
  return target[at] = value
}

function write_int8(target, value, at) {
  return target[at] = value < 0 ? value + 0x100 : value
}

function write_uint16_le(target, value, at) {
  var dv = map.get(target);
  return dv.setUint16(at + target.byteOffset, value, true)
}

function write_uint32_le(target, value, at) {
  var dv = map.get(target);
  return dv.setUint32(at + target.byteOffset, value, true)
}

function write_int16_le(target, value, at) {
  var dv = map.get(target);
  return dv.setInt16(at + target.byteOffset, value, true)
}

function write_int32_le(target, value, at) {
  var dv = map.get(target);
  return dv.setInt32(at + target.byteOffset, value, true)
}

function write_float_le(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat32(at + target.byteOffset, value, true)
}

function write_double_le(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat64(at + target.byteOffset, value, true)
}

function write_uint16_be(target, value, at) {
  var dv = map.get(target);
  return dv.setUint16(at + target.byteOffset, value, false)
}

function write_uint32_be(target, value, at) {
  var dv = map.get(target);
  return dv.setUint32(at + target.byteOffset, value, false)
}

function write_int16_be(target, value, at) {
  var dv = map.get(target);
  return dv.setInt16(at + target.byteOffset, value, false)
}

function write_int32_be(target, value, at) {
  var dv = map.get(target);
  return dv.setInt32(at + target.byteOffset, value, false)
}

function write_float_be(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat32(at + target.byteOffset, value, false)
}

function write_double_be(target, value, at) {
  var dv = map.get(target);
  return dv.setFloat64(at + target.byteOffset, value, false)
}

},{"./mapped.js":12}],17:[function(require,module,exports){

var QRCodeLib = require('./lib/qrcode-draw.js');

if(typeof window !== "undefined") {
  window.qrcodelib = window.QRCodeLib = QRCodeLib;
  // monkey patch old api
  QRCodeLib.qrcodedraw = QRCodeLib.QRCodeDraw;
}

},{"./lib/qrcode-draw.js":2}]},{},[17])
;
// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Known Issues:
//
// * Patterns are not implemented.
// * Radial gradient are not implemented. The VML version of these look very
//   different from the canvas one.
// * Clipping paths are not implemented.
// * Coordsize. The width and height attribute have higher priority than the
//   width and height style values which isn't correct.
// * Painting mode isn't implemented.
// * Canvas width/height should is using content-box by default. IE in
//   Quirks mode will draw the canvas using border-box. Either change your
//   doctype to HTML5
//   (http://www.whatwg.org/specs/web-apps/current-work/#the-doctype)
//   or use Box Sizing Behavior from WebFX
//   (http://webfx.eae.net/dhtml/boxsizing/boxsizing.html)
// * Non uniform scaling does not correctly scale strokes.
// * Optimize. There is always room for speed improvements.

// Only add this code if we do not already have a canvas implementation
if (!document.createElement('canvas').getContext) {

(function() {

  // alias some functions to make (compiled) code shorter
  var m = Math;
  var mr = m.round;
  var ms = m.sin;
  var mc = m.cos;
  var abs = m.abs;
  var sqrt = m.sqrt;

  // this is used for sub pixel precision
  var Z = 10;
  var Z2 = Z / 2;

  /**
   * This funtion is assigned to the <canvas> elements as element.getContext().
   * @this {HTMLElement}
   * @return {CanvasRenderingContext2D_}
   */
  function getContext() {
    return this.context_ ||
        (this.context_ = new CanvasRenderingContext2D_(this));
  }

  var slice = Array.prototype.slice;

  /**
   * Binds a function to an object. The returned function will always use the
   * passed in {@code obj} as {@code this}.
   *
   * Example:
   *
   *   g = bind(f, obj, a, b)
   *   g(c, d) // will do f.call(obj, a, b, c, d)
   *
   * @param {Function} f The function to bind the object to
   * @param {Object} obj The object that should act as this when the function
   *     is called
   * @param {*} var_args Rest arguments that will be used as the initial
   *     arguments when the function is called
   * @return {Function} A new function that has bound this
   */
  function bind(f, obj, var_args) {
    var a = slice.call(arguments, 2);
    return function() {
      return f.apply(obj, a.concat(slice.call(arguments)));
    };
  }

  var G_vmlCanvasManager_ = {
    init: function(opt_doc) {
      if (/MSIE/.test(navigator.userAgent) && !window.opera) {
        var doc = opt_doc || document;
        // Create a dummy element so that IE will allow canvas elements to be
        // recognized.
        doc.createElement('canvas');
        doc.attachEvent('onreadystatechange', bind(this.init_, this, doc));
      }
    },

    init_: function(doc) {
      // create xmlns
      if (!doc.namespaces['g_vml_']) {
        doc.namespaces.add('g_vml_', 'urn:schemas-microsoft-com:vml',
                           '#default#VML');

      }
      if (!doc.namespaces['g_o_']) {
        doc.namespaces.add('g_o_', 'urn:schemas-microsoft-com:office:office',
                           '#default#VML');
      }

      // Setup default CSS.  Only add one style sheet per document
      if (!doc.styleSheets['ex_canvas_']) {
        var ss = doc.createStyleSheet();
        ss.owningElement.id = 'ex_canvas_';
        ss.cssText = 'canvas{display:inline-block;overflow:hidden;' +
            // default size is 300x150 in Gecko and Opera
            'text-align:left;width:300px;height:150px}' +
            'g_vml_\\:*{behavior:url(#default#VML)}' +
            'g_o_\\:*{behavior:url(#default#VML)}';

      }

      // find all canvas elements
      var els = doc.getElementsByTagName('canvas');
      for (var i = 0; i < els.length; i++) {
        this.initElement(els[i]);
      }
    },

    /**
     * Public initializes a canvas element so that it can be used as canvas
     * element from now on. This is called automatically before the page is
     * loaded but if you are creating elements using createElement you need to
     * make sure this is called on the element.
     * @param {HTMLElement} el The canvas element to initialize.
     * @return {HTMLElement} the element that was created.
     */
    initElement: function(el) {
      if (!el.getContext) {

        el.getContext = getContext;

        // Remove fallback content. There is no way to hide text nodes so we
        // just remove all childNodes. We could hide all elements and remove
        // text nodes but who really cares about the fallback content.
        el.innerHTML = '';

        // do not use inline function because that will leak memory
        el.attachEvent('onpropertychange', onPropertyChange);
        el.attachEvent('onresize', onResize);

        var attrs = el.attributes;
        if (attrs.width && attrs.width.specified) {
          // TODO: use runtimeStyle and coordsize
          // el.getContext().setWidth_(attrs.width.nodeValue);
          el.style.width = attrs.width.nodeValue + 'px';
        } else {
          el.width = el.clientWidth;
        }
        if (attrs.height && attrs.height.specified) {
          // TODO: use runtimeStyle and coordsize
          // el.getContext().setHeight_(attrs.height.nodeValue);
          el.style.height = attrs.height.nodeValue + 'px';
        } else {
          el.height = el.clientHeight;
        }
        //el.getContext().setCoordsize_()
      }
      return el;
    }
  };

  function onPropertyChange(e) {
    var el = e.srcElement;

    switch (e.propertyName) {
      case 'width':
        el.style.width = el.attributes.width.nodeValue + 'px';
        el.getContext().clearRect();
        break;
      case 'height':
        el.style.height = el.attributes.height.nodeValue + 'px';
        el.getContext().clearRect();
        break;
    }
  }

  function onResize(e) {
    var el = e.srcElement;
    if (el.firstChild) {
      el.firstChild.style.width =  el.clientWidth + 'px';
      el.firstChild.style.height = el.clientHeight + 'px';
    }
  }

  G_vmlCanvasManager_.init();

  // precompute "00" to "FF"
  var dec2hex = [];
  for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
      dec2hex[i * 16 + j] = i.toString(16) + j.toString(16);
    }
  }

  function createMatrixIdentity() {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  function matrixMultiply(m1, m2) {
    var result = createMatrixIdentity();

    for (var x = 0; x < 3; x++) {
      for (var y = 0; y < 3; y++) {
        var sum = 0;

        for (var z = 0; z < 3; z++) {
          sum += m1[x][z] * m2[z][y];
        }

        result[x][y] = sum;
      }
    }
    return result;
  }

  function copyState(o1, o2) {
    o2.fillStyle     = o1.fillStyle;
    o2.lineCap       = o1.lineCap;
    o2.lineJoin      = o1.lineJoin;
    o2.lineWidth     = o1.lineWidth;
    o2.miterLimit    = o1.miterLimit;
    o2.shadowBlur    = o1.shadowBlur;
    o2.shadowColor   = o1.shadowColor;
    o2.shadowOffsetX = o1.shadowOffsetX;
    o2.shadowOffsetY = o1.shadowOffsetY;
    o2.strokeStyle   = o1.strokeStyle;
    o2.globalAlpha   = o1.globalAlpha;
    o2.arcScaleX_    = o1.arcScaleX_;
    o2.arcScaleY_    = o1.arcScaleY_;
    o2.lineScale_    = o1.lineScale_;
  }

  function processStyle(styleString) {
    var str, alpha = 1;

    styleString = String(styleString);
    if (styleString.substring(0, 3) == 'rgb') {
      var start = styleString.indexOf('(', 3);
      var end = styleString.indexOf(')', start + 1);
      var guts = styleString.substring(start + 1, end).split(',');

      str = '#';
      for (var i = 0; i < 3; i++) {
        str += dec2hex[Number(guts[i])];
      }

      if (guts.length == 4 && styleString.substr(3, 1) == 'a') {
        alpha = guts[3];
      }
    } else {
      str = styleString;
    }

    return {color: str, alpha: alpha};
  }

  function processLineCap(lineCap) {
    switch (lineCap) {
      case 'butt':
        return 'flat';
      case 'round':
        return 'round';
      case 'square':
      default:
        return 'square';
    }
  }

  /**
   * This class implements CanvasRenderingContext2D interface as described by
   * the WHATWG.
   * @param {HTMLElement} surfaceElement The element that the 2D context should
   * be associated with
   */
  function CanvasRenderingContext2D_(surfaceElement) {
    this.m_ = createMatrixIdentity();

    this.mStack_ = [];
    this.aStack_ = [];
    this.currentPath_ = [];

    // Canvas context properties
    this.strokeStyle = '#000';
    this.fillStyle = '#000';

    this.lineWidth = 1;
    this.lineJoin = 'miter';
    this.lineCap = 'butt';
    this.miterLimit = Z * 1;
    this.globalAlpha = 1;
    this.canvas = surfaceElement;

    var el = surfaceElement.ownerDocument.createElement('div');
    el.style.width =  surfaceElement.clientWidth + 'px';
    el.style.height = surfaceElement.clientHeight + 'px';
    el.style.overflow = 'hidden';
    el.style.position = 'absolute';
    surfaceElement.appendChild(el);

    this.element_ = el;
    this.arcScaleX_ = 1;
    this.arcScaleY_ = 1;
    this.lineScale_ = 1;
  }

  var contextPrototype = CanvasRenderingContext2D_.prototype;
  contextPrototype.clearRect = function() {
    this.element_.innerHTML = '';
  };

  contextPrototype.beginPath = function() {
    // TODO: Branch current matrix so that save/restore has no effect
    //       as per safari docs.
    this.currentPath_ = [];
  };

  contextPrototype.moveTo = function(aX, aY) {
    var p = this.getCoords_(aX, aY);
    this.currentPath_.push({type: 'moveTo', x: p.x, y: p.y});
    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  contextPrototype.lineTo = function(aX, aY) {
    var p = this.getCoords_(aX, aY);
    this.currentPath_.push({type: 'lineTo', x: p.x, y: p.y});

    this.currentX_ = p.x;
    this.currentY_ = p.y;
  };

  contextPrototype.bezierCurveTo = function(aCP1x, aCP1y,
                                            aCP2x, aCP2y,
                                            aX, aY) {
    var p = this.getCoords_(aX, aY);
    var cp1 = this.getCoords_(aCP1x, aCP1y);
    var cp2 = this.getCoords_(aCP2x, aCP2y);
    bezierCurveTo(this, cp1, cp2, p);
  };

  // Helper function that takes the already fixed cordinates.
  function bezierCurveTo(self, cp1, cp2, p) {
    self.currentPath_.push({
      type: 'bezierCurveTo',
      cp1x: cp1.x,
      cp1y: cp1.y,
      cp2x: cp2.x,
      cp2y: cp2.y,
      x: p.x,
      y: p.y
    });
    self.currentX_ = p.x;
    self.currentY_ = p.y;
  }

  contextPrototype.quadraticCurveTo = function(aCPx, aCPy, aX, aY) {
    // the following is lifted almost directly from
    // http://developer.mozilla.org/en/docs/Canvas_tutorial:Drawing_shapes

    var cp = this.getCoords_(aCPx, aCPy);
    var p = this.getCoords_(aX, aY);

    var cp1 = {
      x: this.currentX_ + 2.0 / 3.0 * (cp.x - this.currentX_),
      y: this.currentY_ + 2.0 / 3.0 * (cp.y - this.currentY_)
    };
    var cp2 = {
      x: cp1.x + (p.x - this.currentX_) / 3.0,
      y: cp1.y + (p.y - this.currentY_) / 3.0
    };

    bezierCurveTo(this, cp1, cp2, p);
  };

  contextPrototype.arc = function(aX, aY, aRadius,
                                  aStartAngle, aEndAngle, aClockwise) {
    aRadius *= Z;
    var arcType = aClockwise ? 'at' : 'wa';

    var xStart = aX + mc(aStartAngle) * aRadius - Z2;
    var yStart = aY + ms(aStartAngle) * aRadius - Z2;

    var xEnd = aX + mc(aEndAngle) * aRadius - Z2;
    var yEnd = aY + ms(aEndAngle) * aRadius - Z2;

    // IE won't render arches drawn counter clockwise if xStart == xEnd.
    if (xStart == xEnd && !aClockwise) {
      xStart += 0.125; // Offset xStart by 1/80 of a pixel. Use something
                       // that can be represented in binary
    }

    var p = this.getCoords_(aX, aY);
    var pStart = this.getCoords_(xStart, yStart);
    var pEnd = this.getCoords_(xEnd, yEnd);

    this.currentPath_.push({type: arcType,
                           x: p.x,
                           y: p.y,
                           radius: aRadius,
                           xStart: pStart.x,
                           yStart: pStart.y,
                           xEnd: pEnd.x,
                           yEnd: pEnd.y});

  };

  contextPrototype.rect = function(aX, aY, aWidth, aHeight) {
    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
  };

  contextPrototype.strokeRect = function(aX, aY, aWidth, aHeight) {
    var oldPath = this.currentPath_;
    this.beginPath();

    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.stroke();

    this.currentPath_ = oldPath;
  };

  contextPrototype.fillRect = function(aX, aY, aWidth, aHeight) {
    var oldPath = this.currentPath_;
    this.beginPath();

    this.moveTo(aX, aY);
    this.lineTo(aX + aWidth, aY);
    this.lineTo(aX + aWidth, aY + aHeight);
    this.lineTo(aX, aY + aHeight);
    this.closePath();
    this.fill();

    this.currentPath_ = oldPath;
  };

  contextPrototype.createLinearGradient = function(aX0, aY0, aX1, aY1) {
    var gradient = new CanvasGradient_('gradient');
    gradient.x0_ = aX0;
    gradient.y0_ = aY0;
    gradient.x1_ = aX1;
    gradient.y1_ = aY1;
    return gradient;
  };

  contextPrototype.createRadialGradient = function(aX0, aY0, aR0,
                                                   aX1, aY1, aR1) {
    var gradient = new CanvasGradient_('gradientradial');
    gradient.x0_ = aX0;
    gradient.y0_ = aY0;
    gradient.r0_ = aR0;
    gradient.x1_ = aX1;
    gradient.y1_ = aY1;
    gradient.r1_ = aR1;
    return gradient;
  };

  contextPrototype.drawImage = function(image, var_args) {
    var dx, dy, dw, dh, sx, sy, sw, sh;

    // to find the original width we overide the width and height
    var oldRuntimeWidth = image.runtimeStyle.width;
    var oldRuntimeHeight = image.runtimeStyle.height;
    image.runtimeStyle.width = 'auto';
    image.runtimeStyle.height = 'auto';

    // get the original size
    var w = image.width;
    var h = image.height;

    // and remove overides
    image.runtimeStyle.width = oldRuntimeWidth;
    image.runtimeStyle.height = oldRuntimeHeight;

    if (arguments.length == 3) {
      dx = arguments[1];
      dy = arguments[2];
      sx = sy = 0;
      sw = dw = w;
      sh = dh = h;
    } else if (arguments.length == 5) {
      dx = arguments[1];
      dy = arguments[2];
      dw = arguments[3];
      dh = arguments[4];
      sx = sy = 0;
      sw = w;
      sh = h;
    } else if (arguments.length == 9) {
      sx = arguments[1];
      sy = arguments[2];
      sw = arguments[3];
      sh = arguments[4];
      dx = arguments[5];
      dy = arguments[6];
      dw = arguments[7];
      dh = arguments[8];
    } else {
      throw Error('Invalid number of arguments');
    }

    var d = this.getCoords_(dx, dy);

    var w2 = sw / 2;
    var h2 = sh / 2;

    var vmlStr = [];

    var W = 10;
    var H = 10;

    // For some reason that I've now forgotten, using divs didn't work
    vmlStr.push(' <g_vml_:group',
                ' coordsize="', Z * W, ',', Z * H, '"',
                ' coordorigin="0,0"' ,
                ' style="width:', W, 'px;height:', H, 'px;position:absolute;');

    // If filters are necessary (rotation exists), create them
    // filters are bog-slow, so only create them if abbsolutely necessary
    // The following check doesn't account for skews (which don't exist
    // in the canvas spec (yet) anyway.

    if (this.m_[0][0] != 1 || this.m_[0][1]) {
      var filter = [];

      // Note the 12/21 reversal
      filter.push('M11=', this.m_[0][0], ',',
                  'M12=', this.m_[1][0], ',',
                  'M21=', this.m_[0][1], ',',
                  'M22=', this.m_[1][1], ',',
                  'Dx=', mr(d.x / Z), ',',
                  'Dy=', mr(d.y / Z), '');

      // Bounding box calculation (need to minimize displayed area so that
      // filters don't waste time on unused pixels.
      var max = d;
      var c2 = this.getCoords_(dx + dw, dy);
      var c3 = this.getCoords_(dx, dy + dh);
      var c4 = this.getCoords_(dx + dw, dy + dh);

      max.x = m.max(max.x, c2.x, c3.x, c4.x);
      max.y = m.max(max.y, c2.y, c3.y, c4.y);

      vmlStr.push('padding:0 ', mr(max.x / Z), 'px ', mr(max.y / Z),
                  'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',
                  filter.join(''), ", sizingmethod='clip');")
    } else {
      vmlStr.push('top:', mr(d.y / Z), 'px;left:', mr(d.x / Z), 'px;');
    }

    vmlStr.push(' ">' ,
                '<g_vml_:image src="', image.src, '"',
                ' style="width:', Z * dw, 'px;',
                ' height:', Z * dh, 'px;"',
                ' cropleft="', sx / w, '"',
                ' croptop="', sy / h, '"',
                ' cropright="', (w - sx - sw) / w, '"',
                ' cropbottom="', (h - sy - sh) / h, '"',
                ' />',
                '</g_vml_:group>');

    this.element_.insertAdjacentHTML('BeforeEnd',
                                    vmlStr.join(''));
  };

  contextPrototype.stroke = function(aFill) {
    var lineStr = [];
    var lineOpen = false;
    var a = processStyle(aFill ? this.fillStyle : this.strokeStyle);
    var color = a.color;
    var opacity = a.alpha * this.globalAlpha;

    var W = 10;
    var H = 10;

    lineStr.push('<g_vml_:shape',
                 ' filled="', !!aFill, '"',
                 ' style="position:absolute;width:', W, 'px;height:', H, 'px;"',
                 ' coordorigin="0 0" coordsize="', Z * W, ' ', Z * H, '"',
                 ' stroked="', !aFill, '"',
                 ' path="');

    var newSeq = false;
    var min = {x: null, y: null};
    var max = {x: null, y: null};

    for (var i = 0; i < this.currentPath_.length; i++) {
      var p = this.currentPath_[i];
      var c;

      switch (p.type) {
        case 'moveTo':
          c = p;
          lineStr.push(' m ', mr(p.x), ',', mr(p.y));
          break;
        case 'lineTo':
          lineStr.push(' l ', mr(p.x), ',', mr(p.y));
          break;
        case 'close':
          lineStr.push(' x ');
          p = null;
          break;
        case 'bezierCurveTo':
          lineStr.push(' c ',
                       mr(p.cp1x), ',', mr(p.cp1y), ',',
                       mr(p.cp2x), ',', mr(p.cp2y), ',',
                       mr(p.x), ',', mr(p.y));
          break;
        case 'at':
        case 'wa':
          lineStr.push(' ', p.type, ' ',
                       mr(p.x - this.arcScaleX_ * p.radius), ',',
                       mr(p.y - this.arcScaleY_ * p.radius), ' ',
                       mr(p.x + this.arcScaleX_ * p.radius), ',',
                       mr(p.y + this.arcScaleY_ * p.radius), ' ',
                       mr(p.xStart), ',', mr(p.yStart), ' ',
                       mr(p.xEnd), ',', mr(p.yEnd));
          break;
      }


      // TODO: Following is broken for curves due to
      //       move to proper paths.

      // Figure out dimensions so we can do gradient fills
      // properly
      if (p) {
        if (min.x == null || p.x < min.x) {
          min.x = p.x;
        }
        if (max.x == null || p.x > max.x) {
          max.x = p.x;
        }
        if (min.y == null || p.y < min.y) {
          min.y = p.y;
        }
        if (max.y == null || p.y > max.y) {
          max.y = p.y;
        }
      }
    }
    lineStr.push(' ">');

    if (!aFill) {
      var lineWidth = this.lineScale_ * this.lineWidth;

      // VML cannot correctly render a line if the width is less than 1px.
      // In that case, we dilute the color to make the line look thinner.
      if (lineWidth < 1) {
        opacity *= lineWidth;
      }

      lineStr.push(
        '<g_vml_:stroke',
        ' opacity="', opacity, '"',
        ' joinstyle="', this.lineJoin, '"',
        ' miterlimit="', this.miterLimit, '"',
        ' endcap="', processLineCap(this.lineCap), '"',
        ' weight="', lineWidth, 'px"',
        ' color="', color, '" />'
      );
    } else if (typeof this.fillStyle == 'object') {
      var fillStyle = this.fillStyle;
      var angle = 0;
      var focus = {x: 0, y: 0};

      // additional offset
      var shift = 0;
      // scale factor for offset
      var expansion = 1;

      if (fillStyle.type_ == 'gradient') {
        var x0 = fillStyle.x0_ / this.arcScaleX_;
        var y0 = fillStyle.y0_ / this.arcScaleY_;
        var x1 = fillStyle.x1_ / this.arcScaleX_;
        var y1 = fillStyle.y1_ / this.arcScaleY_;
        var p0 = this.getCoords_(x0, y0);
        var p1 = this.getCoords_(x1, y1);
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        angle = Math.atan2(dx, dy) * 180 / Math.PI;

        // The angle should be a non-negative number.
        if (angle < 0) {
          angle += 360;
        }

        // Very small angles produce an unexpected result because they are
        // converted to a scientific notation string.
        if (angle < 1e-6) {
          angle = 0;
        }
      } else {
        var p0 = this.getCoords_(fillStyle.x0_, fillStyle.y0_);
        var width  = max.x - min.x;
        var height = max.y - min.y;
        focus = {
          x: (p0.x - min.x) / width,
          y: (p0.y - min.y) / height
        };

        width  /= this.arcScaleX_ * Z;
        height /= this.arcScaleY_ * Z;
        var dimension = m.max(width, height);
        shift = 2 * fillStyle.r0_ / dimension;
        expansion = 2 * fillStyle.r1_ / dimension - shift;
      }

      // We need to sort the color stops in ascending order by offset,
      // otherwise IE won't interpret it correctly.
      var stops = fillStyle.colors_;
      stops.sort(function(cs1, cs2) {
        return cs1.offset - cs2.offset;
      });

      var length = stops.length;
      var color1 = stops[0].color;
      var color2 = stops[length - 1].color;
      var opacity1 = stops[0].alpha * this.globalAlpha;
      var opacity2 = stops[length - 1].alpha * this.globalAlpha;

      var colors = [];
      for (var i = 0; i < length; i++) {
        var stop = stops[i];
        colors.push(stop.offset * expansion + shift + ' ' + stop.color);
      }

      // When colors attribute is used, the meanings of opacity and o:opacity2
      // are reversed.
      lineStr.push('<g_vml_:fill type="', fillStyle.type_, '"',
                   ' method="none" focus="100%"',
                   ' color="', color1, '"',
                   ' color2="', color2, '"',
                   ' colors="', colors.join(','), '"',
                   ' opacity="', opacity2, '"',
                   ' g_o_:opacity2="', opacity1, '"',
                   ' angle="', angle, '"',
                   ' focusposition="', focus.x, ',', focus.y, '" />');
    } else {
      lineStr.push('<g_vml_:fill color="', color, '" opacity="', opacity,
                   '" />');
    }

    lineStr.push('</g_vml_:shape>');

    this.element_.insertAdjacentHTML('beforeEnd', lineStr.join(''));
  };

  contextPrototype.fill = function() {
    this.stroke(true);
  }

  contextPrototype.closePath = function() {
    this.currentPath_.push({type: 'close'});
  };

  /**
   * @private
   */
  contextPrototype.getCoords_ = function(aX, aY) {
    var m = this.m_;
    return {
      x: Z * (aX * m[0][0] + aY * m[1][0] + m[2][0]) - Z2,
      y: Z * (aX * m[0][1] + aY * m[1][1] + m[2][1]) - Z2
    }
  };

  contextPrototype.save = function() {
    var o = {};
    copyState(this, o);
    this.aStack_.push(o);
    this.mStack_.push(this.m_);
    this.m_ = matrixMultiply(createMatrixIdentity(), this.m_);
  };

  contextPrototype.restore = function() {
    copyState(this.aStack_.pop(), this);
    this.m_ = this.mStack_.pop();
  };

  function matrixIsFinite(m) {
    for (var j = 0; j < 3; j++) {
      for (var k = 0; k < 2; k++) {
        if (!isFinite(m[j][k]) || isNaN(m[j][k])) {
          return false;
        }
      }
    }
    return true;
  }

  function setM(ctx, m, updateLineScale) {
    if (!matrixIsFinite(m)) {
      return;
    }
    ctx.m_ = m;

    if (updateLineScale) {
      // Get the line scale.
      // Determinant of this.m_ means how much the area is enlarged by the
      // transformation. So its square root can be used as a scale factor
      // for width.
      var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
      ctx.lineScale_ = sqrt(abs(det));
    }
  }

  contextPrototype.translate = function(aX, aY) {
    var m1 = [
      [1,  0,  0],
      [0,  1,  0],
      [aX, aY, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_), false);
  };

  contextPrototype.rotate = function(aRot) {
    var c = mc(aRot);
    var s = ms(aRot);

    var m1 = [
      [c,  s, 0],
      [-s, c, 0],
      [0,  0, 1]
    ];

    setM(this, matrixMultiply(m1, this.m_), false);
  };

  contextPrototype.scale = function(aX, aY) {
    this.arcScaleX_ *= aX;
    this.arcScaleY_ *= aY;
    var m1 = [
      [aX, 0,  0],
      [0,  aY, 0],
      [0,  0,  1]
    ];

    setM(this, matrixMultiply(m1, this.m_), true);
  };

  contextPrototype.transform = function(m11, m12, m21, m22, dx, dy) {
    var m1 = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx,  dy,  1]
    ];

    setM(this, matrixMultiply(m1, this.m_), true);
  };

  contextPrototype.setTransform = function(m11, m12, m21, m22, dx, dy) {
    var m = [
      [m11, m12, 0],
      [m21, m22, 0],
      [dx,  dy,  1]
    ];

    setM(this, m, true);
  };

  /******** STUBS ********/
  contextPrototype.clip = function() {
    // TODO: Implement
  };

  contextPrototype.arcTo = function() {
    // TODO: Implement
  };

  contextPrototype.createPattern = function() {
    return new CanvasPattern_;
  };

  // Gradient / Pattern Stubs
  function CanvasGradient_(aType) {
    this.type_ = aType;
    this.x0_ = 0;
    this.y0_ = 0;
    this.r0_ = 0;
    this.x1_ = 0;
    this.y1_ = 0;
    this.r1_ = 0;
    this.colors_ = [];
  }

  CanvasGradient_.prototype.addColorStop = function(aOffset, aColor) {
    aColor = processStyle(aColor);
    this.colors_.push({offset: aOffset,
                       color: aColor.color,
                       alpha: aColor.alpha});
  };

  function CanvasPattern_() {}

  // set up externs
  G_vmlCanvasManager = G_vmlCanvasManager_;
  CanvasRenderingContext2D = CanvasRenderingContext2D_;
  CanvasGradient = CanvasGradient_;
  CanvasPattern = CanvasPattern_;

})();

} // if
