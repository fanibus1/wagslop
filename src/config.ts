export interface Config {
	token: string;
	clientId: string;
	guildId: string;
}

// config.json lives in the project root, outside of src/ and dist/
export const config: Config = require('../config.json');
