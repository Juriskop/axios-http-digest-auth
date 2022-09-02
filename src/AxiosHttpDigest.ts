import {AxiosInstance} from "axios";
import {generateClientNonce, generateHA1, generateHA2,
    generateResponse, getNonceFromMessageString, getRealmFromMessageString} from "@juriskop/swish-node-digest-auth";

const configKey = 'httpDigestAuth';
const storedKey = 'storedDigestValues';

export interface HttpDigestAuthCredential {
    username: string
    password: string;
}

interface StoredDigestValues {
    nonceCounter: number;
    nonce: string;
    cnonce: string;
    realm: string;
    qop: string;
}

export const httpDigestAuth = (axiosInstance: AxiosInstance, credentials: HttpDigestAuthCredential) => {
    axiosInstance.interceptors.request.use((request) => {
        if(request[configKey] && request[configKey][storedKey]) {
            const storedValues: StoredDigestValues = request[configKey][storedKey];

            if(!request.url || !storedValues.realm || !request.method || !storedValues.nonce || !storedValues.cnonce || !request.headers) {
                throw new Error('Axios HTTP Digest Auth: Unexpected state reached.');
            }

            const digestRelevantPath = new URL(request.url).pathname;

            const ha1 = generateHA1(credentials.username, storedValues.realm, credentials.password);
            const ha2 = generateHA2(request.method.toUpperCase(), digestRelevantPath);

            const response = generateResponse(ha1, ha2, storedValues.nonce, storedValues.nonceCounter, storedValues.cnonce, storedValues.qop);
            const paddedNonceCounter = storedValues.nonceCounter.toString(10).padStart(8, '0');

            request.headers['Authorization'] = `Digest username="${credentials.username}", realm="${storedValues.realm}", nonce="${storedValues.nonce}", uri="${digestRelevantPath}", algorithm="MD5", qop=${storedValues.qop}, nc=${paddedNonceCounter}, cnonce=${storedValues.cnonce}, response="${response}"`;

            request[configKey][storedKey].nonceCounter += 1;
        }

        return request;
    });

    axiosInstance.interceptors.response.use(null, async (error) => {
        const { config } = error;
        // If the nonce counter is 1 it means that the request has been retried, and we are still being denied entry.
        if(config && config[configKey] && config[configKey][storedKey] && error.config[configKey][storedKey].nonceCounter === 1) {
            return Promise.reject(error);
        }

        if(!config[configKey]) {
            config[configKey] = {};
        }

        const message = error.response.headers['www-authenticate'];
        config[configKey][storedKey] = {
            nonce: getNonceFromMessageString(message),
            realm: getRealmFromMessageString(message),
            cnonce: generateClientNonce(),
            nonceCounter: 1,
            qop: 'auth',
        };

        return Promise.resolve(axiosInstance(error.config));
    })

    return axiosInstance;
}