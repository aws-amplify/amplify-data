const logError = (error) => {
	console.error('\x1b[31m%s\x1b[0m', error); // Use red for console.error
	return;
};

export default {
	logError,
};