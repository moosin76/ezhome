const pm2 = require('pm2');

pm2.launchBus(function (err, pm2_bus) {
	// pm2_bus.on('process:msg', function(packet){
	// 	console.log(packet);
	// })
	pm2_bus.on('config:update', function ({ data }) {
		if (data.cf_client) {
			$config.client[data.cf_key] = data.cf_val;
		} else {
			$config.server[data.cf_key] = data.cf_val;
		}
	});
	pm2_bus.on('config:remove', function ({ data }) {
		delete $config.client[data];
		delete $config.server[data];
	});
})