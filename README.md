<!--
title: 'Serverless Webscraper Integrated with AWS'
description: 'This project aims to provide a simple tool to scrape popular ecommerces for the bestselling items. Currently, it provides only Amazon bestsellers but other ecommerces should be integrated soon.

Fully independent, the user can deploy themselves the scraper to the cloud or use it locally with native support.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/kawaym'
authorName: 'Kaway Marinho.'
authorAvatar: 'https://avatars.githubusercontent.com/u/57325050?v=4'
-->

# Serverless Webscraper Integrated with AWS

This project aims to provide a simple tool to scrape popular ecommerces for the bestselling items. Currently, it provides only Amazon bestsellers but other ecommerces should be integrated soon.

Fully independent, the user can deploy themselves the scraper to the cloud or use it locally with native support.

## Usage

### Serverless Setup

Install serverless with:

```bash
  npm install -g serverless
```

You should now have serverless installed but without an account setup, when deploying it should ask for the account and you can refer for more info on:

<https://www.serverless.com/framework/docs/getting-started>

### Deployment

Install dependencies with:

```bash
npm install
```

Now you can deploy for use locally with:

```bash
npm run deploy:local
```

After running deploy:local, you should see output similar to:

```bash
Starting Offline at stage dev (us-east-1)

Offline [http for lambda] listening on http://localhost:3000
Function names exposed for local invocation by aws-sdk:
           * healthCheck: webscraper-ecommerce-dev-healthCheck
           * allBestsellers: webscraper-ecommerce-dev-allBestsellers
           * bestsellers: webscraper-ecommerce-dev-bestsellers
```

This means the application is up and running and can be consumed on <http://localhost:3000>

This script also uses dynamodb-local which requires Java, you can refer to more info [here](https://github.com/raisenational/serverless-dynamodb)

If you want to use with the dynamodb provided by the cloud but still run in your local machine you can use the script:

````bash
npm run deploy:test
````

Alternativaly, you can deploy it on AWS, using the Cloudformation provided by Serverless deployment:

```bash
npm run deploy:cloud
```

After running deploy:cloud, you should see output similar to:

```bash
Deploying aws-node-express-dynamodb-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-dynamodb-api-project-dev-api (766 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). Additionally, in current configuration, the DynamoDB table will be removed when running `serverless remove`. To retain the DynamoDB table even after removal of the stack, add `DeletionPolicy: Retain` to its resource definition.

### Invocation

After successful deployment, you can create a new user by calling the corresponding endpoint:

```bash
curl '<LINK_PROVIDED_BY_DEPLOYMENT_METHOD>'/bestsellers
```

Which should result in the following response:

```bash
[{"productName": "...", "productImg": "...", "productPrice": 0000, "productUrl": "..."}, ...]
```

### API Documentation

For more info about the API provided, such as endpoints and possible responses please refer to the [API Documentation](https://ten-freedom-1f7.notion.site/API-Template-27b55a9fb7e04aba8ab555f4daa510fc?pvs=4) (In portuguese)
