export const FormCollapse = {
    type: 'object',
    properties: {
        accordion: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        },
    },
};
FormCollapse.CollapsePanel = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
        },
    },
};
