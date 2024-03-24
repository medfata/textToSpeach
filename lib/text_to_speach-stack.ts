import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class TextToSpeachStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    const bucket = new s3.Bucket(this, 'TextToSpeechBucket', {
      bucketName: 'text_to_speach', // Bucket name
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for testing purposes
    });

    const api = new apigateway.RestApi(this, 'TextToSpeechAPI', {
      restApiName: 'TextToSpeechAPI',
      description: 'API for Text to Speech functionality',
    });
    const textToSpeechResource = api.root.addResource('text_to_speech');

    const s3Integration = new apigateway.AwsIntegration({
      service: 's3',
      integrationHttpMethod: 'POST', // Change the HTTP method to POST
      options: {
        requestParameters: {
          'integration.request.header.Host': "'${bucket.bucketDomainName}'",
        },
        integrationResponses: [
          {
            statusCode: '201',
            responseParameters: {
              'method.response.header.Content-Type': "'application/octet-stream'",
            },
          },
        ],
      },
    });
    textToSpeechResource.addMethod('POST',  s3Integration)
  }
}
