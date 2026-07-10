"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetsAI = exports.assets = void 0;
const path_1 = require("path");
exports.assets = (0, path_1.join)(__dirname, '..', 'assets');
exports.assetsAI = (0, path_1.join)(exports.assets, 'ai');
