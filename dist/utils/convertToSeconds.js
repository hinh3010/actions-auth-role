"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToSeconds = void 0;
function convertToSeconds(durationString) {
    const valueMatch = durationString.match(/\d+/);
    const unitMatch = durationString.match(/[a-zA-Z]+/);
    if (!valueMatch || !unitMatch) {
        return 0;
    }
    const value = parseInt(valueMatch[0]);
    const unit = unitMatch[0];
    switch (unit) {
        case 's':
            return value;
        case 'm':
            return value * 60;
        case 'h':
            return value * 60 * 60;
        case 'd':
            return value * 24 * 60 * 60;
        default:
            return 0;
    }
}
exports.convertToSeconds = convertToSeconds;
