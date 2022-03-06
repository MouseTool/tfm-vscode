# tfm-vscode

Lua Language Server (VSCode) environment definition for Transformice.

## Usage

### Configure to use MouseTool NPM repository

```sh
npm login --scope=@mousetool --registry=https://npm.pkg.github.com

> Username: Your username here
> Password: Your GitHub PAT token here
> Email: PUBLIC-EMAIL-ADDRESS
```

It is mandatory to set this up for the first time when dealing with MouseTool NPM packages, otherwise GitHub will deny you from installing them. More on authenticating to GitHub NPM repository can be found [here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).


### Install for your workspace

```sh
npm install --save-dev @mousetool/tfm-vscode
```

Set your VSCode workspace settings to register our third party library.

```json
{
    "Lua.workspace.userThirdParty": [
        "./node_modules/@mousetool/tfm-vscode"
    ],
    "Lua.workspace.useGitIgnore": false
}
```

If you are using `.luarc.json`, this would be:
```json
{
    "workspace": {
        "userThirdParty": [
            "./node_modules/@mousetool/tfm-vscode"
        ]
    }
}
```

Finally, you should be asked to load the Transformice environment after writing your code.
