"use strict";
exports.__esModule = true;
exports.createLogger = void 0;
var createLogger = function () { return ({
    debug: function (msg) { return console.debug(msg); },
    info: function (msg) { return console.log(msg); },
    error: function (msg, error) { return console.error(msg, error); }
}); };
exports.createLogger = createLogger;
