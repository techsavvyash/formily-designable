import { ICustomEvent } from '@samagrax/shared';
import { AbstractHistoryEvent } from './AbstractHistoryEvent';
export declare class HistoryGotoEvent extends AbstractHistoryEvent implements ICustomEvent {
    type: string;
}
