import { SynthUtils } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';

import { WidgetService } from '../src/widget-service';

test('WidgetService creates a stack', () => {
  const stack = new Stack();
  new WidgetService(stack, 'test-subject');
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});