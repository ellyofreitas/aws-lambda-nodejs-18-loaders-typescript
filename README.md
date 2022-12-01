# AWS Lambda Node.js 18 Custom Loaders and Typescript

## Test local

Using [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

```sh
sam local invoke SomeFunction -n env.json --skip-pull-image
```

or

Using nodejs local

```sh
yarn test
```

## Deploy in AWS

```sh
sam deploy --guided
```

## Motivation

- AWS Lambda release runtime nodejs18.x - [reference](https://aws.amazon.com/pt/blogs/compute/node-js-18-x-runtime-now-available-in-aws-lambda/)
- AWS Lambda supports ES Modules - [reference](https://aws.amazon.com/pt/blogs/compute/using-node-js-es-modules-and-top-level-await-in-aws-lambda/)
- Node.js release experimental Custom Loaders Api - [reference](https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#loaders)
- Node.js release experimental import JSON modules using assert type - [reference](https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#json-modules)
- Node.js support Source Maps - [reference](https://nodejs.org/docs/latest-v18.x/api/cli.html#--enable-source-maps)
- Typescript add support for native Node.js ES Modules - [reference](https://www.typescriptlang.org/docs/handbook/esm-node.html)
- [Esbuild](https://esbuild.github.io/) **"An extremely fast JavaScript bundler"** is becoming popular in the Typescript ecosystem tools because it can be 20~30x faster than vanilla [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html), and therefore, it has been a great game changer for bundlers, how for example [Vite](https://vitejs.dev/) that can be 10-100x more performant than its competitors, standing out as faster when need to transpile Typescript font to Javascript with ESM in browser context, so it's a great choice for use on next generation web
- [@unjs](https://github.com/unjs) create a package [mlly](https://github.com/unjs/mlly) **"Missing ECMAScript module utils for Node.js Resources"** for fill Node.js ESM gaps.

Made with ❤️
