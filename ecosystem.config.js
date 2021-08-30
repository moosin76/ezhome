module.exports = {
	apps : [
		{
			name : 'ezhome',
			script : './server/server.js',
			instances : 0,
			scale : 2,
			exec_mode : 'cluster',
			wait_ready : true,
			listen_timeout : 50000,
			kill_timeout : 5000,
		}
	]
}