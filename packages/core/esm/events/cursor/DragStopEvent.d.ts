import { ICustomEvent } from '@samagrax/shared';
import { AbstractCursorEvent } from './AbstractCursorEvent';
export declare class DragStopEvent extends AbstractCursorEvent implements ICustomEvent {
    type: string;
}
