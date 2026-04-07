import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib/core';
import { Duration } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class L3Bucket extends Bucket {
  constructor(scope: Construct, id: string, expirationInDays: number) {
    super(scope, id);

    const myL3Bucket = new Bucket(this, 'MyL2Bucket', {
      lifecycleRules: [{
        expiration: Duration.days(expirationInDays),
      }],
    });
  }
}



export class CdkStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //L1 Construct
    new CfnBucket(this, 'MyL1Bucket', {
      lifecycleConfiguration: {
        rules: [{
          expirationInDays: 1,
          status: 'Enabled',
        }]

      }
    })


    const duration = new cdk.CfnParameter(this, 'duration', {
      default: 6,
      minValue: 1,
      maxValue: 10,
      type: 'Number',
    })

    //L2 Construct
    const myL2Bucket = new Bucket(this, 'MyL2Bucket', {
      lifecycleRules: [{
        expiration: Duration.days(duration.valueAsNumber),
      }],
    });

    //console.log(myL2Bucket.bucketName);//${Token[TOKEN.22]}

    new cdk.CfnOutput(this, 'MyL2BucketName', {
      value: myL2Bucket.bucketName,
    });



    new L3Bucket(this, 'MyL3Bucket', 3);

  }
}
