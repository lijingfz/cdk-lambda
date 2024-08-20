#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkLambdaStack } from '../lib/cdk-lambda-stack';

const app = new cdk.App();
new CdkLambdaStack(app, 'MyCloudFrontStack',{
   // bucketName: 'minimaxzoompic',
    env: {
        region: 'ap-southeast-1',
      },
});
