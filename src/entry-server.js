import { createApp } from "./main";

export default (ctx) => {
	return new Promise((resolve, reject) => {
		const { app, router, store } = createApp();
		console.log('entry-server.js before router.push');
		router.push(ctx.url);
		console.log('entry-server.js after router.push');
		router.onReady(() => {
			console.log('entry-server.js onReady');
			ctx.rendered = () => ctx.state = store.state;
			const matchedComponents = router.getMatchedComponents();
			if (matchedComponents.length === 0) {
				return reject({ code: 404 });
			}
			return resolve(app);
		}, reject)
	});
}