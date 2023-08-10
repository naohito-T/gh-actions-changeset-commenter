# contributing

## 概要

workspaceで管理しています。  
開発に関しては以下について留意すること

以下の形で管理しています

## Develop

Nodeのモジュール解決で、自分のnode_modulesにモジュールがないとき、親のnode_modules、その親のnode_modulesへとディレクトリをさかのぼってモジュールを探す仕組みがあるため`devDependencies`関連のモジュールinstallはルートパッケージに入れてください

```sh
$ pwd  # gh-actions-utils-scripts
$ yarn add -D jest -W
```

### Add new packages

`packages/`配下に新たにディレクトリを掘ってS

### Install package-only modules

パッケージ限定のモジュールをinstallするとき（dependencies）は以下コマンドで実行すること

```sh
# Add new module in packages
$ yarn workspace packages/hoge add node-fetch
```

## Reference
[GitHub REST API](https://docs.github.com/ja/rest/repos/repos?apiVersion=2022-11-28#get-a-repository)