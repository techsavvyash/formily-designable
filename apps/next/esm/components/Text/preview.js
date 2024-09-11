import React from 'react';
import { createBehavior, createResource } from '@samagrax/core';
import { createVoidFieldSchema } from '../Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import cls from 'classnames';
import './styles.less';
export const Text = (props) => {
    const tagName = props.mode === 'normal' || !props.mode ? 'div' : props.mode;
    return React.createElement(tagName, {
        ...props,
        className: cls(props.className, 'dn-text'),
        'data-content-editable': 'x-component-props.content',
    }, props.content);
};
Text.Behavior = createBehavior({
    name: 'Text',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'Text',
    designerProps: {
        propsSchema: createVoidFieldSchema(AllSchemas.Text),
    },
    designerLocales: AllLocales.Text,
});
Text.Resource = createResource({
    icon: 'TextSource',
    elements: [
        {
            componentName: 'Field',
            props: {
                type: 'string',
                'x-component': 'Text',
            },
        },
    ],
});