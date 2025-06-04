// different clients with different credentials

import { OAuth2Client } from "google-auth-library";
import { initializeOAuth2Client } from "./client.js";

export class ClientManager {
    private clients: Record<string, OAuth2Client> = {};

    constructor() {
        this.clients = {};
    }

    getClient(accessToken: string): OAuth2Client {
        const cachedClient = this.clients[accessToken];
        if (cachedClient) {
            return cachedClient;
        }
        const client = initializeOAuth2Client();
        this.clients[accessToken] = client;
        client.setCredentials({
            access_token: accessToken,
        });
        return client;
    }
}