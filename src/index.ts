import { } from '@aws-cdk/core';
import widget_service from './widget-service';

export class MyWidgetServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new widget_service.WidgetService(this, 'widgets');
  }
}

if (require.main === module) {
  const app = new cdk.App();
  (new  MyWidgetServiceStack(app, 'MyWidgetServiceStack'));
  app.synth();
}
