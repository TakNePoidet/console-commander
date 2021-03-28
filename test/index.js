const { Commander, Command } = require('../dist/index');

/**
 *
 */
class TestCommand extends Command {
	signature = 'test-command {--list=}';

	get description() {
		return 'Тестовое описание';
	}

	handle() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(this.options);
			}, this.options.timeout * 1000);
		});
	}
}
const commander = new Commander();

commander.registration(TestCommand);
commander
	.start()
	.then((result) => {
		console.log(result);
	})
	.catch((error) => console.error(error.message));
