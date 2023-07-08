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
exports.sendActivationTokenToUserMail = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
// import https from "https";
const formData = new form_data_1.default();
const sendActivationTokenToUserMail = (user, url) => __awaiter(void 0, void 0, void 0, function* () {
    // const axiosAgent = new https.Agent({
    //   rejectUnauthorized: false,
    // });
    // console.log(`calling: ${user.email}`);
    formData.append("to", user.email);
    formData.append("subject", "Activate Account");
    formData.append("text", `This is the activation link to verify your account: ${url}`);
    formData.append("html", `<p>This is the activation link to verify your account: <a href=${url}>activate</a></p>`);
    try {
        yield axios_1.default.post(process.env.EMAIL_SENDING_URL, formData);
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
exports.sendActivationTokenToUserMail = sendActivationTokenToUserMail;
