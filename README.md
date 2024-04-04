# How to use cdk
  jingamz@ 



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
npx cdk bootstrap -c originName="xxxxxxxxx.s3.us-west-2.amazonaws.com"
npx cdk synth -c originName="xxxxxxxxx.s3.us-west-2.amazonaws.com"
npx cdk deploy -c originName="xxxxxxxxx.s3.us-west-2.amazonaws.com"
```
