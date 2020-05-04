import { App, Stack, StackProps } from '@aws-cdk/core';
import { WidgetService } from './widget-service';

export class MyWidgetServiceStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    new WidgetService(this, 'widgets');
  }
}

if (require.main === module) {
  const app = new App();
  (new  MyWidgetServiceStack(app, 'MyWidgetServiceStack'));
  app.synth();
}
