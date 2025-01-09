"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
// sanityClient.ts
var client_1 = require("@sanity/client");
exports.client = (0, client_1.createClient)({
    projectId: 'rohwei6u', // Replace with your project ID
    dataset: 'production', // Or your dataset name
    apiVersion: '2024-01-04', // Today's date or latest API version
    useCdn: false, // Disable CDN for real-time updates
    token: "skwAYL2EVT699VvWODU6xcibH3o0mwbKP9DoMrexRkfzRpaWfQahfSiwEuAlwZqU4FibHyEoVOR8gmHnwnDXW640gZU3mp1afdgil0yTqqL9Oqw4pqTssSZERXnLbXopBPVqpiW0OVN7hTAH0fF7GbSjAKDDk9kbYAAZZpDfdWhYAHWmtFAY"
});
