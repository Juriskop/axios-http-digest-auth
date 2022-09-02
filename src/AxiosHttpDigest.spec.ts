import {httpDigestAuth} from "./AxiosHttpDigest";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.SWISH_USER_NAME;
const password = process.env.SWISH_PASSWORD;
const baseUrl = process.env.SWISH_BASE_URL;

const credentials = {
    username,
    password,
};

describe('AxiosHttpDigest', () => {
    it('Can connect to the a SWISH instance', async () => {
        const axiosInstance = httpDigestAuth(axios.create({}), credentials);

        const response = await axiosInstance.get( baseUrl + '/p/erbrecht.pl?format=json');
        expect(response.data).toBeDefined();
    })
});