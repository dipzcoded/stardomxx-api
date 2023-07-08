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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPasswordResetMail = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const https_1 = __importDefault(require("https"));
const formData = new form_data_1.default();
const userPasswordResetMail = (user, url) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(`calling: ${user.email}`);
    const axiosAgent = new https_1.default.Agent({
        rejectUnauthorized: false,
    });
    formData.append("to", user.email);
    formData.append("subject", "Reset Password");
    formData.append("text", `This is a password reset link: ${url}`);
    formData.append("html", `<p>This is a password reset link: <a href=${url}>reset</a></p>`);
    try {
        yield axios_1.default.post(process.env.EMAIL_SENDING_URL, formData, {
            httpsAgent: axiosAgent,
        });
        return;
    }
    catch (err) {
        throw err;
    }
});
exports.userPasswordResetMail = userPasswordResetMail;
