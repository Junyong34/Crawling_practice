const configEnv = {
	// Env Settings servletURL
	servletURL:
		process.env.NODE_ENV === 'staging'
			? window.appEnv.demoServletURL
			: window.appEnv.servletURL,
	// Env Settings socketURL
	socketURL: window.appEnv.socketURL,
	// Env Settings interMaxURL
	interMaxURL: window.appEnv.interMaxURL,
	maxSelectionSize: window.appEnv.maxSelectionSize,
	healthIndicatorStateInfo: window.appEnv.healthIndicatorStateInfo,
};

export default configEnv;
