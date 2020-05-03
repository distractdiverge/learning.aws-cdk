import cdk from '@aws-cdk/core';
import apigateway from '@aws-cdk/aws-apigateway';
import lambda from '@aws-cdk/aws-lambda';
import s3 from '@aws-cdk/aws-s3';

export class WidgetService extends cdk.Construct {
    _isDevelopment() {
        // TODO: Extract this into config.
        if (!process.env.NODE_ENV) {
            return 'development';
        }

        return process.env.NODE_ENV === 'development';
    }

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const bucket = new s3.Bucket(this, 'WigetStore', {
            removalPolicy: this._isDevelopment()  
                ? cdk.RemovalPolicy.DESTROY
                : cdk.RemovalPolicy.RETAIN,
        });

        const lambda = new lambda.Function(this, 'WidgetHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.AssetCode.asset('resources'),
            handler: 'wigets.main',
            environment: {
                BUCKET: bucket.bucketName,
            },
        });

        bucket.grantReadWrite(lambda);

        const api = new apigateway.RestApi(this, 'WidgetAPI', {
            restApiName: 'Widget Service',
            description: 'This service serves widgets',
        });

        const listWidgetsIntegration = new apigateway.LambdaIntegration(lambda, {
            requestTemplate: { 'application/json': { statusCode: 200 } },
        });
        api.root.addMethod('GET', listWidgetsIntegration);

        const widget = api.root.addResource('{id}');
        const createWidgetIntegration = new apigateway.Lambda(lambda);
        widget.addMethod('POST', createWidgetIntegration);

        const getWidgetIntegration = new apigateway.LambdaIntegration(lambda);
        widget.addMethod('GET', getWidgetIntegration);

        const deleteWidgetIntegration = new apigateway.LambdaIntegration(lambda);
        widget.addMethod('DELETE', deleteWidgetIntegration);

    }
}
