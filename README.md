# Redstone-Circuit-Dictonary

# Directory
```
redstone-circuit-dictonary
┣ backend
┃  ┣ domain      #外部サービスとの連携
┃  ┃  ┣ cognito  #AWSのログイン管理サービス
┃  ┃  ┗ db       #AWSのデータベース:Dynamodb
┃  ┣ handler     #フロントエンドからのリクエストの入り口
┃  ┃  ┣ cognito  #ユーザのサインアップが完了したときなどに起動する
┃  ┃  ┗ https    #https形式で送られてきたリクエストを受け取る
┃  ┣ usecase     #handlerから得たリクエストをデータや環境変数のみusecaseに渡して処理を行う
┃  ┃  ┣ input    #hanlerからusecaseにデータを渡すときの型情報
┃  ┃  ┗ ...  
┃  ┣ util        #上記以外の共通の処理をまとめる(時間系、環境変数)
┃  ┣ Dockerfile         #バックエンドのデプロイ時に使う、イメージの作成、handlerのhttps
┃  ┣ Dockerfile.cognito #バックエンドのデプロイ時に使う、イメージの作成、handlerのCognito
┃  ┣ go.mod             #goのパッケージ(indirectのやつは基本いじらない)
┃  ┣ go.sum             #goのパッケージ(基本いじらない)
┃  ┣ main               #Dcokerfileでイメージの作成時に使う
┃  ┣ OpenAPI.yml        #フロントエンドのためのAPI仕様書
┃  ┣ serverless.yml     #バックエンドの構成情報をのせた設計書、デプロイ時に使う
┃  ┃
┃  ┣ test_db_json       #現在未使用、ローカル環境でDBを作るためのJson
┃  ┣ .air.toml          #現在未使用、ローカル環境
┃  ┣ docker-compose.yml #現在未使用、ローカル環境
┃  ┣ Dockerfile.dev     #現在未使用、ローカル環境
┃  ┣ package-lock.json　#現在未使用、環境変数を扱うためのパッケージ?
┃  ┣ package.json       #現在未使用、環境変数を扱うためのパッケージ?
┃  ┗ .env               #現在未使用、環境変数
┃
┣ frontend              #ぐちゃぐちゃ過ぎてわからない
┃  ┗ ...
┣ .gitignore
┗ README.md
```

# 環境構成

| ツール | 説明 | バージョン | URL |
| :----: | ---- | :----: | ---- |
| vscode | コード エディター | 1.93.0 | |
| docker | コンテナを用いてアプリケーションをすばやく構築、テスト、デプロイできるソフトウェアプラットフォーム | 以下参照 | |
| postman | WebAPIのテストを行うことができるAPIプラットフォーム  | 10.24.3 ||
| github  |   |  ||
| aws-cli |   | 2.17.0 ||
| SAM CLI |   | 1.119.0 ||
| AWS Serverless Framework(serverless) |   | 4.2.5 ||
| npm     |   | 6.14.18 ||
| ubuntu  |   | 22.04.3 LTS ||
| node    |   | 20.15.0 | |


## docker
```
Client:
 Version:           26.1.4
 API version:       1.45
 Go version:        go1.21.11
 Git commit:        ...
 Built:             Wed Jun  5 11:29:54 2024
 OS/Arch:           windows/amd64
 Context:           desktop-linux

Server: Docker Desktop 4.31.1 (153621)
 Engine:
  Version:          26.1.4
  API version:      1.45 (minimum version 1.24)
  Go version:       go1.21.11
  Git commit:       ...
  Built:            Wed Jun  5 11:29:22 2024
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.33
  GitCommit:        ...
 runc:
  Version:          1.1.12
  GitCommit:        v1.1.12-0-g51d5e94
 docker-init:
  Version:          0.19.0
  GitCommit:        ...
```

## vscodeの拡張機能
| ツール | バージョン |
| :----: |  :----: |
| AWS CLI Configure  | v0.3.0 |
| Docker | v1.29.2 |
| DynamoDB | v0.0.1 |
| ES7 React/Redux/GraphQL/React-Native snippets | v1.9.3 |
| Git Graph | v1.30.0 |
| Go | v0.42.0 |
| NPM | v1.7.4 |
| npm Intellisense | v1.4.5 |
| OpenAPI (Swagger) Editor | v4.28.1  |
| YAML | v1.15.0 |
