import React from 'react';
import { useTransformHelper, useCursor, usePrefix } from '../../hooks';
import { observer } from '@formily/reactive-react';
import { CursorStatus } from '@samagrax/core';
export const SnapLine = observer(() => {
    const cursor = useCursor();
    const transformHelper = useTransformHelper();
    const prefix = usePrefix('aux-snap-line');
    const createLineStyle = (rect) => {
        const baseStyle = {
            top: 0,
            left: 0,
            height: rect.height || 1,
            width: rect.width || 1,
            transform: `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`,
            background: `#b0b1f3`,
            position: 'absolute',
            zIndex: 2,
        };
        return baseStyle;
    };
    if (cursor.status !== CursorStatus.Dragging)
        return null;
    return (React.createElement(React.Fragment, null, transformHelper.closestSnapLines.map((line, key) => {
        if (line.type !== 'normal')
            return null;
        return (React.createElement("div", { key: key, className: prefix, style: createLineStyle(line.rect) }));
    })));
});
SnapLine.displayName = 'SnapLine';