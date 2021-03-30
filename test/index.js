const { Commander, Command, Console } = require('../dist/index');
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
		// Console
		// Console
		Console.print(result);
	})
	.catch((error) => {
		console.log(error);
		// Console.print(error.message)
	});

// Console.ask()
