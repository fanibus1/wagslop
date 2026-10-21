const { logFactory } = require('pretty-js-log');

// Create a basic logger
const LOGGER = Object.freeze(logFactory({}));

module.exports = {
	LOGGER,
};
