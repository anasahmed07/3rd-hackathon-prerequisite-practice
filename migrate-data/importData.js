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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var sanityClient_js_1 = require("./sanityClient.js");
function uploadImageToSanity(imageUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var response, buffer, asset, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get(imageUrl, { responseType: 'arraybuffer' })];
                case 1:
                    response = _a.sent();
                    buffer = Buffer.from(response.data);
                    return [4 /*yield*/, sanityClient_js_1.client.assets.upload('image', buffer, {
                            filename: imageUrl.split('/').pop(), // Extract the filename from URL
                        })];
                case 2:
                    asset = _a.sent();
                    // Debugging: Log the asset returned by Sanity
                    console.log('Image uploaded successfully:', asset);
                    return [2 /*return*/, asset._id]; // Return the uploaded image asset reference ID
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Failed to upload image:', imageUrl, error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function importData() {
    return __awaiter(this, void 0, void 0, function () {
        var response, products, _i, products_1, product, imageRef, sanityProduct, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, axios_1.default.get('https://fakestoreapi.com/products')];
                case 1:
                    response = _c.sent();
                    products = response.data;
                    _i = 0, products_1 = products;
                    _c.label = 2;
                case 2:
                    if (!(_i < products_1.length)) return [3 /*break*/, 7];
                    product = products_1[_i];
                    imageRef = '';
                    if (!product.image) return [3 /*break*/, 4];
                    return [4 /*yield*/, uploadImageToSanity(product.image)];
                case 3:
                    imageRef = _c.sent();
                    _c.label = 4;
                case 4:
                    sanityProduct = {
                        _id: "product-".concat(product.id), // Prefix the ID to ensure validity
                        _type: 'product',
                        name: product.title,
                        price: product.price,
                        discountPercentage: product.discountPercentage || 0,
                        tags: product.category ? [product.category] : [],
                        image: {
                            _type: 'image',
                            asset: {
                                _type: 'reference',
                                _ref: imageRef, // Set the correct asset reference ID
                            },
                        },
                        description: product.description,
                        rating: ((_a = product.rating) === null || _a === void 0 ? void 0 : _a.rate) || 0,
                        ratingCount: ((_b = product.rating) === null || _b === void 0 ? void 0 : _b.count) || 0,
                    };
                    // Log the product before attempting to upload it to Sanity
                    console.log('Uploading product:', sanityProduct);
                    // Import data into Sanity
                    return [4 /*yield*/, sanityClient_js_1.client.createOrReplace(sanityProduct)];
                case 5:
                    // Import data into Sanity
                    _c.sent();
                    console.log("\u2705 Imported product: ".concat(sanityProduct.name));
                    _c.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    console.log('✅ Data import completed!');
                    return [3 /*break*/, 9];
                case 8:
                    error_2 = _c.sent();
                    console.error('❌ Error importing data:', error_2);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
importData();
