Configurando o VS Code para debugar o Mocha:

Launch.json

	"configurations": [
		{
			"name": "Debug Test",
			"type": "node",
			"request": "launch",
			"program": "${workspaceRoot}/node_modules/mocha/bin/_mocha",
			"stopOnEntry": false,
			"args": ["test/dev*.js","--timeout", "0"],
			"runtimeExecutable": null,
			"env": {
				"NODE_ENV": "development"
			},
			"externalConsole": false,
			"sourceMaps": false,
			"outDir": null
		},      