"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CommandError = void 0;
var CommandError = /** @class */ (function (_super) {
    __extends(CommandError, _super);
    function CommandError(userMessage) {
        var _this = _super.call(this, 'command error: ' + userMessage) || this;
        _this.userMessage = userMessage;
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, CommandError.prototype);
        return _this;
    }
    return CommandError;
}(Error));
exports.CommandError = CommandError;
