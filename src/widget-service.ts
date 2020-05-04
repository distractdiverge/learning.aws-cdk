import { Construct, RemovalPolicy } from '@aws-cdk/core';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { AssetCode, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Bucket } from '@aws-cdk/aws-s3';

export class WidgetService extends Construct {
    _isDevelopment() {
        // TODO: Extract this into config.
        if (!process.env.NODE_ENV) {
            return 'development';
        }

        return process.env.NODE_ENV === 'development';
    }

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const bucket = new Bucket(this, 'WigetStore', {
            removalPolicy: this._isDevelopment()  
                ? RemovalPolicy.DESTROY
                : RemovalPolicy.RETAIN,
        });

        const lambdaFn = new Function(this, 'WidgetHandler', {
            runtime: Runtime.NODEJS_12_X,
            // TODO: Replace with actual code
            code: AssetCode.fromInline('console.log("Hello World!"'),
            handler: 'wigets.main',
            environment: {
                BUCKET: bucket.bucketName,
            },
        });

        bucket.grantReadWrite(lambdaFn);

        const api = new RestApi(this, 'WidgetAPI', {
            restApiName: 'Widget Service',
            description: 'This service serves widgets',
        });

        const listWidgetsIntegration = new LambdaIntegration(lambdaFn, {
            requestTemplates: { 
                'application/json': '{ "statusCode": 200 }',
            },
        });
        api.root.addMethod('GET', listWidgetsIntegration);

        const widget = api.root.addResource('{id}');
        const createWidgetIntegration = new LambdaIntegration(lambdaFn);
        widget.addMethod('POST', createWidgetIntegration);

        const getWidgetIntegration = new LambdaIntegration(lambdaFn);
        widget.addMethod('GET', getWidgetIntegration);

        const deleteWidgetIntegration = new LambdaIntegration(lambdaFn);
        widget.addMethod('DELETE', deleteWidgetIntegration);

    }
}
