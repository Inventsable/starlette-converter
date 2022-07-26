"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var maskSchema = require("./mask.json");
var readFile = function (filePath) {
    return new Promise(function (resolve, reject) {
        if (fs.readFile)
            fs.readFile(filePath, { encoding: "utf-8" }, function (err, data) {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        else {
            resolve(fs.readFileSync(filePath, "utf-8"));
        }
    });
};
var decodeKeys = function (data) {
    var allKeys = data
        .map(function (a) { return Object.keys(a); })
        .flat()
        .filter(function (v, i, a) { return a.indexOf(v) == i; })
        .sort()
        .map(function (v) {
        return {
            key: v,
            mask: null
        };
    });
    var sorted = data
        .sort(function (a, b) {
        return a.title.localeCompare(b.title);
    })
        .map(function (a) {
        return {
            key: a.title,
            mask: null
        };
    });
    var parentKeys = [
        "ILST",
        "AEFT",
        "DRWV",
        "FLPR",
        "IDSN",
        "PHXS",
        "PPRO",
        "AUDT",
        "dark",
        "darkest",
        "light",
        "lightest",
        "gradient",
    ].map(function (i) {
        return {
            key: i,
            mask: null
        };
    });
    var masterList = __spreadArray(__spreadArray([], parentKeys, true), [allKeys, sorted], false).flat();
    masterList.forEach(function (entry, index) {
        entry.mask = decodeWriter(index);
    });
    return masterList;
};
var decodeWriter = function (index) {
    var alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    try {
        if (index < alpha.length)
            return alpha[index];
        else {
            var dividend = Math.floor(index / alpha.length);
            return "".concat(decodeWriter(dividend - 1)).concat(decodeWriter(index % alpha.length));
        }
    }
    catch (err) {
        console.error("Errored at ".concat(index, " => ").concat(alpha.length >= index ? alpha[index] : index));
    }
};
var readDir = function (targetPath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                if (!fs.existsSync(path.resolve(targetPath)) ||
                    !fs.lstatSync(path.resolve(targetPath)).isDirectory())
                    reject("Path is not a folder or does not exist");
                fs.readdir(path.resolve(targetPath), { encoding: "utf-8" }, function (err, files) {
                    if (err)
                        reject(err);
                    resolve(files);
                });
            })];
    });
}); };
var runMaskTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var basePath, fileData, _a, _b, result, treated;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                basePath = "./stylesheets/ILST/dark.json";
                _b = (_a = JSON).parse;
                return [4 /*yield*/, readFile(path.resolve(basePath))];
            case 1:
                fileData = _b.apply(_a, [_c.sent()]);
                result = decodeKeys(fileData);
                treated = fs.writeFileSync(path.resolve("./mask.json"), JSON.stringify(result));
                console.log("Done");
                return [2 /*return*/];
        }
    });
}); };
var runTest = function () { return __awaiter(void 0, void 0, void 0, function () {
    var basePath, apps, maskedData, rawData, _loop_1, _i, apps_1, app;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                basePath = "./stylesheets";
                return [4 /*yield*/, readDir(basePath)];
            case 1:
                apps = _a.sent();
                maskedData = {};
                rawData = {};
                _loop_1 = function (app) {
                    var sheets, _loop_2, _b, sheets_1, sheet;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                rawData[app] = {};
                                maskedData[lookupEncode(app)] = {};
                                return [4 /*yield*/, readDir("".concat(basePath, "/").concat(app))];
                            case 1:
                                sheets = _c.sent();
                                _loop_2 = function (sheet) {
                                    var fileData, _d, _e, maskList, rawList, _loop_3, _f, fileData_1, variable;
                                    return __generator(this, function (_g) {
                                        switch (_g.label) {
                                            case 0:
                                                sheet = sheet.replace(/\.json$/, "");
                                                rawData[app][sheet] = [];
                                                maskedData[lookupEncode(app)][lookupEncode(sheet)] = [];
                                                _e = (_d = JSON).parse;
                                                return [4 /*yield*/, readFile("".concat(basePath, "/").concat(app, "/").concat(sheet, ".json"))];
                                            case 1:
                                                fileData = _e.apply(_d, [_g.sent()]);
                                                maskList = maskedData[lookupEncode(app)][lookupEncode(sheet)], rawList = rawData[app][sheet];
                                                _loop_3 = function (variable) {
                                                    rawList.push(variable);
                                                    var temp = {};
                                                    Object.keys(variable).forEach(function (key) {
                                                        temp[lookupEncode(key)] =
                                                            key == "title"
                                                                ? lookupEncode(variable[key], app + sheet)
                                                                : variable[key];
                                                    });
                                                    maskList.push(temp);
                                                };
                                                for (_f = 0, fileData_1 = fileData; _f < fileData_1.length; _f++) {
                                                    variable = fileData_1[_f];
                                                    _loop_3(variable);
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                _b = 0, sheets_1 = sheets;
                                _c.label = 2;
                            case 2:
                                if (!(_b < sheets_1.length)) return [3 /*break*/, 5];
                                sheet = sheets_1[_b];
                                return [5 /*yield**/, _loop_2(sheet)];
                            case 3:
                                _c.sent();
                                _c.label = 4;
                            case 4:
                                _b++;
                                return [3 /*break*/, 2];
                            case 5: return [2 /*return*/];
                        }
                    });
                };
                _i = 0, apps_1 = apps;
                _a.label = 2;
            case 2:
                if (!(_i < apps_1.length)) return [3 /*break*/, 5];
                app = apps_1[_i];
                return [5 /*yield**/, _loop_1(app)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                fs.writeFileSync(path.resolve("./resultRaw.json"), JSON.stringify(rawData));
                fs.writeFileSync(path.resolve("./resultMask.json"), JSON.stringify(maskedData));
                return [2 /*return*/];
        }
    });
}); };
var lookupEncode = function (key, debugInfo) {
    try {
        return maskSchema.find(function (maskItem) { return maskItem.key == key; })
            .mask;
    }
    catch (err) {
        console.error("Could not find key of ".concat(key), debugInfo);
    }
};
var lookupDecode = function (mask) {
    return maskSchema.find(function (maskItem) { return maskItem.mask == mask; })
        .key;
};
// runMaskTest();
runTest();
var gatherFiles = function (filePath) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
