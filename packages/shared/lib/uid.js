"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uid = uid;
var IDX = 36, HEX = '';
while (IDX--)
    HEX += IDX.toString(36);
function uid(len) {
    var str = '', num = len || 11;
    while (num--)
        str += HEX[(Math.random() * 36) | 0];
    return str;
}
