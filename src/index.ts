import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from './config';
import { LOGGER } from './logger';
import type { Command, Event } from './types';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// dynamically retrieve command files
LOGGER.info('Retrieving command files...');

for (const folder of commandFolders) {
	LOGGER.info(`\t${folder}/`);

	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command: Command | undefined = require(filePath).default;

		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if (command && 'data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			LOGGER.info(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}

		LOGGER.info(`\t\t${file}`);
	}
}

// dynamically retrieve all event files
LOGGER.info('Retrieving event files...');
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event: Event = require(filePath).default;

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}

	LOGGER.info(`\t\t${file}`);
}

// Log in to Discord with your client's token
client.login(config.token);
