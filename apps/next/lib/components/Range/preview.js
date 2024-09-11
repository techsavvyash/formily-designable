import { Range as NextRange } from '@alifd/next';
import { createBehavior, createResource } from '@samagrax/core';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export const Range = NextRange;
Range.Behavior = createBehavior({
    name: 'Range',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Range',
    designerProps: {
        propsSchema: createFieldSchema(AllSchemas.Range),
    },
    designerLocales: AllLocales.Range,
});
Range.Resource = createResource({
    icon: 'SliderSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'number',
                title: 'Range',
                'x-decorator': 'FormItem',
                'x-component': 'Range',
            },
        },
    ],
});