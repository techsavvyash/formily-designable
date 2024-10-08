import { createBehavior, createResource } from '@samagrax/core';
import { createFieldSchema } from '../Field';
import { Container } from '../../common/Container';
import { AllLocales } from '../../locales';
export const ObjectContainer = Container;
ObjectContainer.Behavior = createBehavior({
    name: 'Object',
    extends: ['Field'],
    selector: (node) => node.props.type === 'object',
    designerProps: {
        droppable: true,
        propsSchema: createFieldSchema(),
    },
    designerLocales: AllLocales.ObjectLocale,
});
ObjectContainer.Resource = createResource({
    icon: 'ObjectSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'object',
            },
        },
    ],
});
