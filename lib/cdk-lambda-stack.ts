import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

interface MyCloudFrontStackProps extends cdk.StackProps {
  bucketName: string;
}
export class CdkLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // const originName = this.node.tryGetContext('originName') as string
    // if (originName == undefined) {
    //   throw new Error('Context value [originName] is not set')
    // }
    
    // const mybucket = s3.Bucket.fromBucketName(this, 'ExistingBucket', originName);

    const originAccessControl = new cloudfront.CfnOriginAccessControl(this, 'MyCfnOriginAccessControl', {
      originAccessControlConfig: {
        name: 'MyOAC',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
    
        // the properties below are optional
        description: 'MyOAC',
      },
    });

    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      // Lambda和Edge Lambda的服务主体
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('edgelambda.amazonaws.com')
      ),
      description: 'An example IAM role for Lambda and Edge Lambda',
    });
    
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));

    const ImageConverterFunction  = new cloudfront.experimental.EdgeFunction(
      this,
      'ImageConverter',
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../resources')
        ),
        handler: 'index.handler',
        role: lambdaRole, 
        runtime: lambda.Runtime.NODEJS_LATEST,
        memorySize: 512,
        timeout: Duration.seconds(20),
      }
    );

    const myCachePolicy = new cloudfront.CachePolicy(this, 'myCachePolicy', {
      cachePolicyName: 'ImageConvert1',
      comment: 'Cache Policy for Image-convert1',
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.allowList('width', 'format'),
      defaultTtl: Duration.days(30),
      minTtl: Duration.days(1),
    });

    // const distribution = new cloudfront.Distribution(this, 'Distribution', {
    //   defaultBehavior: {
    //     allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
    //     cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
    //     cachePolicy: myCachePolicy,
    //     viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //     origin: new s3origins.HttpOrigin(originName),
    //     edgeLambdas: [
    //       {
    //         eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
    //         functionVersion: ImageConverterFunction.currentVersion,
    //       },
    //     ],
    //   },
    // });
    
    // const cfnDistribution = distribution.node
    //   .defaultChild as cloudfront.CfnDistribution;
    //   cfnDistribution.addPropertyOverride(
    //     "DistributionConfig.Origins.0.OriginAccessControlId",
    //     originAccessControl.getAtt("Id")
    //   );  

  }
}