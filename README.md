# Welcome to your CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`CdkLambdaStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
# cdk-lambda


Install dependencies

```
npm install
```

install "sharp" for lambda@edge

```
cd resources
npm install --arch=x64 --platform=linux sharp
```


Go back to the root and run bootstrap the AWS CDK
```
npx cdk bootstrap -c originName={Origin domain}
```

Deploy the stack
```
npx cdk deploy -c originName={Origin domain}
```

# Query Parameters

https://dxxxxx.cloudfront.net/image/test.jpg?width=240&format=jpg

```
npx cdk bootstrap -c originName="minimaxzoompic.s3.us-west-2.amazonaws.com"
npx cdk synth -c originName="minimaxzoompic.s3.us-west-2.amazonaws.com"
npx cdk deploy -c originName="minimaxzoompic.s3.us-west-2.amazonaws.com"
```
