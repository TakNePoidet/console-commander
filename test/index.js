const { Commander, Command } = require('../dist/index');

/**
 *
 */
class Write extends Command {
	/**
	 *
	 */
	get signature() {
		return 'write {--loop} {--U|users*}';
	}

	/**
	 *
	 */
	async handle() {
		return new Promise((resolve) => {
			setTimeout(() => {
				this.error('asdsads');
				resolve({ response: 'ok' });
			}, 1000);
		});
	}
}
const commander = new Commander();

commander.registration(Write);
commander
	.start()
	.then((result) => {
		console.log(result);
	})
	.catch((error) => console.error(error.message));
