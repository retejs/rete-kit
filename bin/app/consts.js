"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetsCommon = exports.assetsStack = void 0;
const path_1 = require("path");
const consts_1 = require("../consts");
exports.assetsStack = (0, path_1.join)(consts_1.assets, 'app', 'stack');
exports.assetsCommon = (0, path_1.join)(consts_1.assets, 'app', 'common');
