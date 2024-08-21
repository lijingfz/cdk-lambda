#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkLambdaStack } from '../lib/cdk-lambda-stack';

const app = new cdk.App();
new CdkLambdaStack(app, 'MyCloudFrontStack',{
   // bucketName: 'minimaxzoompic',
    env: {
        region: 'us-east-1',
        // 这是必须是 us-east-1 区域，原因是 edge@lambda函数 只能在美东1 被调用
      },
});
