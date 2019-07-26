# Boilerplate Api Node

## Time mantenedor
  - X

## Publisher dos seguintes eventos:
  - Criação de X => Topic SNS (arn:xxx)
  - Atualização de Y => EventBridge (**/entidade/update)

## Subscribe dos seguintes eventos:
  - Criação de cliente => Topic SNS (arn:xxx)
  - Atualização de cliente => EventBridge (**/entidade/update)

## Documentação API
A documentação está disponível na seguinte URL: [http://localhost:3000/](http://localhost:3000/)

## Guia
  - Dependencias
  - Estrutura do projeto
  - Configuracao
  - Execucao

## Dependencias
Este projeto utiliza diversas ferramentas e plugins, sendo eles:

### Ferramentas
  - Obrigatorios:
    - NodeJS 8+
    - MongoDB (Caso não utilize a imagem docker)

  - Opcionais:
    - Docker

### Plugins
  - Obrigatorios:
    - Eslint
  - Opcionais:
    - Editorconfig
    - Yaml Support

## Estrutura do projeto
Este projeto contem pastas e arquivos que servem para certos propositos segue a lista dos mesmos:

### Pastas
```
_/ 'Raiz'
__/__tests__ 'Contem arquivos dos testes unitarios'
__/coverage 'Contem arquivos dos relatorios gerados atraves dos testes'
__/config 'Contem arquivos de configuracao do projeto para deploy e execucao'
__/fixtures 'Contem arquivos para executar a migracao das entidades'
__/mongoose 'Contem pasta de modelos e arquivo de conexao com MongoDB'
___/models 'Contem arquivos de definicao de schema das entidades'
__/services 'Contem os serviços das entidades'
___/entidade 'Contem arquivos que sao as funcoes desta entidade'
__/utils 'Contem arquivos e funcoes utilitarias'
```

## Configuração
Existem 2 formas de executar o projeto de forma local, uma utilizando o Docker, onde é necessário instalar o Docker antecipadamente para poder rodar o docker-compose, e após a instalação executar os comandos:
```
docker-compose build
docker-compose up -d
```

Outra forma é utilizando diretamente o serverless offline, mas para isso é necessário alterar a url de configuração do mongo (que está no local default apontando para a url do docker), apontando para o uri desejado no arquivo .env.app.yml que se encontra na pasta config, após a configuração do mongo rodar os comandos:
```
npm install serverless -g
npm install
npm run start:fixture
```

É usado o start:fixture para cadastrar previamente os tipos de caminhão e 1000 motoristas na base com o faker.

## Testes unitários
Para rodar os testes unitários:
```
npm test
```

Caso queira ver cobertura dos testes:
```
npm test:coverage
```

## Endpoints:
Para qualquer uma das alternativas (Docker ou não) a API fica disponível na url:
[http://localhost:3000/](http://localhost:3000/)