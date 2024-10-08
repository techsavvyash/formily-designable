import { Select as FormilySelect } from '@formily/next';
import { createBehavior, createResource } from '@samagrax/core';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export const Select = FormilySelect;
Select.Behavior = createBehavior({
    name: 'Select',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Select',
    designerProps: {
        propsSchema: createFieldSchema(AllSchemas.Select),
    },
    designerLocales: AllLocales.Select,
});
Select.Resource = createResource({
    icon: 'SelectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: 'Select',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
            },
        },
    ],
});
