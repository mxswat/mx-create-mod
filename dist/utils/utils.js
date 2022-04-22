"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = exports.generateFileOrDirectoryNameForEJS = exports.isFileOrDirectoryToRename = exports.toPascalCase = exports.sanitize = void 0;
var ejs = __importStar(require("ejs"));
// const FileOrDirectorySeparator = '__'
var illegalChars = /[\/\?<>\\:\*\|"]/g; // illegal Characters https://kb.acronis.com/content/39790
/** Based on https://stackoverflow.com/a/37511463/10300983 */
function sanitize(originalText) {
    return originalText.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .replace(illegalChars, '');
}
exports.sanitize = sanitize;
/** Based on https://stackoverflow.com/a/37511463/10300983 */
function toPascalCase(str) {
    return str
        .replace(/\w\S*/g, function (m) { return m.charAt(0).toUpperCase() + m.substring(1).toLowerCase(); })
        .replace(/\s+/g, '');
}
exports.toPascalCase = toPascalCase;
/**
 * Checks if directory/file name has __ (double _)
 * @param name
 * @returns
 */
function isFileOrDirectoryToRename(name) {
    return name.indexOf('__') > -1;
}
exports.isFileOrDirectoryToRename = isFileOrDirectoryToRename;
function generateFileOrDirectoryNameForEJS(name, options) {
    return name.replace(/__(.*?)__/g, function (match, p1) { return options[p1]; });
}
exports.generateFileOrDirectoryNameForEJS = generateFileOrDirectoryNameForEJS;
function renderTemplate(content, data) {
    return ejs.render(content, data);
}
exports.renderTemplate = renderTemplate;
//# sourceMappingURL=utils.js.map