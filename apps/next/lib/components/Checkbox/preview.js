import { Checkbox as FormilyCheckbox } from '@formily/next';
import { createBehavior, createResource } from '@samagrax/core';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export const Checkbox = FormilyCheckbox;
Checkbox.Behavior = createBehavior({
    name: 'Checkbox.Group',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Checkbox.Group',
    designerProps: {
        propsSchema: createFieldSchema(AllSchemas.Checkbox.Group),
    },
    designerLocales: AllLocales.CheckboxGroup,
});
Checkbox.Resource = createResource({
    icon: 'CheckboxGroupSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'Array<string | number>',
                title: 'Checkbox Group',
                'x-decorator': 'FormItem',
                'x-component': 'Checkbox.Group',
                enum: [
                    { label: '选项1', value: 1 },
                    { label: '选项2', value: 2 },
                ],
            },
        },
    ],
});
