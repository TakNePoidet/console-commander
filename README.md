# console-commander

Simple Console Command Manager

## Installation

Add the package to your dev-dependencies using npm or yarn

```bash
$ npm i -D console-commander

$ yarn add -D console-commander
```

## Usage

```javascript
// Importing models
const { Commander, Command } = require('console-commander');
// Creating a command handler class
class TestCommand extends Command {
	signature = 'test-command {--T|<number>timeout=1 : timeout in seconds}';

	get description() {
		return 'This is the command description';
	}

	handle() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ response: 'ok' });
			}, this.options.timeout * 1000);
		});
	}
}

// Initializing the Commander
const commander = new Commander();

// Command registration
commander.registration(TestCommand);

// start
commander
	.start()
	.then((result) => {
		console.log(result);
	})
	.catch((error) => console.error(error.message));
```

```bash
$ example test-command --timeout 5
```

## Defining the Input data

All options provided by the user are enclosed in curly brackets and prefixed with `--`

```javascript
class TestCommand extends Command {
	signature = 'test-command {--verbose}';
}
```

### Alias

To assign a shortcut when defining an option, you may specify it before the option name and use the | character as a delimiter to separate the shortcut from the full option name:

```javascript
class TestCommand extends Command {
	signature = 'test-command {--T|timeout}';
}
```

### Descriptions

You may assign descriptions to input options by separating the option name from the description using a colon.

```javascript
class TestCommand extends Command {
	signature = 'test-command {--timeout:timeout in seconds}';
}
```

### Typing

To describe the type, write it `<typing>` ahead with the option name

```javascript
class TestCommand extends Command {
	signature = 'test-command {--<number>timeout}';
}
```

The types `Number` and `String` are allowed

#### default `String`

### Input array

To wait for multiple options, press `*` after the option name

```javascript
class TestCommand extends Command {
	signature = 'test-command {--src*}';
}
```

### Default values

To define a default value, terminate the name with `=` and add the value

```javascript
class TestCommand extends Command {
	signature = 'test-command {--src=one.js}';
}
```

For multiple default values, you must complete `*=`

```javascript
class TestCommand extends Command {
	signature = 'test-command {--src*=one.js,two.js}';
}
```

The values ​​are separated by `,`

## Commander options

| Option | Alias |                          Descriptions |
| :----- | :---: | ------------------------------------: |
| --help |  -H   |                  Show the user manual |
| --list |  -L   | Displays a list of available commands |

### Help command

```bash
$ example test-command --help
```
