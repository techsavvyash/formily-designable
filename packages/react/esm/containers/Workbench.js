import React from 'react';
import { observer } from '@formily/reactive-react';
import { useWorkbench } from '../hooks';
import { Workspace } from './Workspace';
export const Workbench = observer((props) => {
    const workbench = useWorkbench();
    return (React.createElement(Workspace, { id: workbench.currentWorkspace?.id }, props.children));
});
