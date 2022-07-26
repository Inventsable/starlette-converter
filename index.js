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
        "dark",
        "darkest",
        "light",
        "lightest",
        "gradient",
        "ILST",
        "AEFT",
        "DRWV",
        "FLPR",
        "IDSN",
        "PHXS",
        "PPRO",
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
var runTest = function (param) { return __awaiter(void 0, void 0, void 0, function () {
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
                treated = fs.writeFileSync(path.resolve("./result.json"), JSON.stringify(result));
                console.log("Done?");
                return [2 /*return*/];
        }
    });
}); };
runTest("Hello world");
