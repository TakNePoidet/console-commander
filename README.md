# console-commander

Простой консольный менеджер команд

## Установка

Добавьте пакет в свои `dependencies` с помощью npm или yarn

```bash
$ npm i console-commander

$ yarn add console-commander
```

## Использование

```javascript
// Импорт модулей
const {Commander, Command} = require('console-commander');

// Создание класса обработчика команд
class TestCommand extends Command {
	signature = 'test-command {--T|<number>timeout=1 : время в секундах}';

	get description() {
		return 'Это описание команды';
	}

	handle() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({response: 'ok'});
			}, this.options.timeout * 1000);
		});
	}
}

// Инициализация Commander
const commander = new Commander();

// Добавление команд
commander.append(TestCommand);

// Старт
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

## Определение входных данных

Все параметры, предоставленные пользователем, заключены в фигурные скобки и имеют префикс "--".

```javascript
class TestCommand extends Command {
	signature = 'test-command {--verbose}';
}
```

### Алиас

Чтобы назначить алиас при определении опции, вы можете указать его перед именем опции и использовать символ | в качестве
разделителя, чтобы отделить ярлык от полного имени опции:

```javascript
class TestCommand extends Command {
	signature = 'test-command {--T|timeout}';
}
```

### Описание

Вы можете назначить описания параметрам ввода, отделив имя параметра от описания двоеточием.

```javascript
class TestCommand extends Command {
	signature = 'test-command {--timeout : время в секундах}';
}
```

### Типизация

Чтобы описать тип, напишите его `<typing>` впереди с именем параметра

```javascript
class TestCommand extends Command {
	signature = 'test-command {--<number>timeout}';
}
```

Разрешены типы `Boolean`, `Number` и `String`

#### default `Boolean`

### Ввод массива

Чтобы дождаться нескольких вариантов, нажмите `*` после имени параметра

```javascript
class TestCommand extends Command {
	signature = 'test-command {--src*}';
}
```

### Значения по умолчанию

Чтобы определить значение по умолчанию, завершите имя с помощью `=` и добавьте значение

```javascript
class TestCommand extends Command {
	signature = 'test-command {--src=one.js}';
}
```

Для нескольких значений по умолчанию необходимо написать `*=`

```javascript
class TestCommand extends Command {
	signature = 'test-command {--src*=one.js,two.js}';
}
```

Значения разделяются  `,`

## Параметры командира

| Опция | Алиас |                               Описание |
| :----- | :---: | ------------------------------------: |
| --help |  -H   |                         Вывод справки |
| --list |  -L   |                   Вывод списка команд |

### Вывод справки у команды

```bash
$ example test-command --help
```
