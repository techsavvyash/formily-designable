import { ICustomEvent } from '@samagrax/shared';
import { AbstractWorkspaceEvent } from './AbstractWorkspaceEvent';
export declare class AddWorkspaceEvent extends AbstractWorkspaceEvent implements ICustomEvent {
    type: string;
}