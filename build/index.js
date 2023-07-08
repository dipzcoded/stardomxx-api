"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env" });
const PORT = process.env.PORT || 6000;
app_1.app.listen(PORT, () => {
    console.log(`api running on PORT: ${PORT}`);
});
