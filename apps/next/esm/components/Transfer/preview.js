import { Transfer as FormilyTransfer } from '@formily/next';
import { createBehavior, createResource } from '@samagrax/core';
import { createFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
export const Transfer = FormilyTransfer;
Transfer.Behavior = createBehavior({
    name: 'Transfer',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Transfer',
    designerProps: {
        propsSchema: createFieldSchema(AllSchemas.Transfer),
    },
    designerLocales: AllLocales.Transfer,
});
Transfer.Resource = createResource({
    icon: 'TransferSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                title: 'Transfer',
                'x-decorator': 'FormItem',
                'x-component': 'Transfer',
            },
        },
    ],
});
