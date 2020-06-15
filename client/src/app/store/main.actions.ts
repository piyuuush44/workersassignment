import {createAction, props} from '@ngrx/store';
import {MessageModel} from '../message.model';

export const SAVE_MESSAGE_DATA = createAction(
    'SAVE_MESSAGE_DATA',
    props<{ payload: MessageModel[] }>()
);

export const TRY_FETCH_MESSAGE_DATA = createAction(
    'TRY_FETCH_MESSAGE_DATA',
);

export const TRY_SAVE_NEW_MESSAGE_DATA = createAction(
    'TRY_SAVE_NEW_MESSAGE_DATA',
    props<{ payload: any }>()
);

export const TRY_DELETE_MESSAGE_DATA = createAction(
    'TRY_DELETE_MESSAGE_DATA',
    props<{ payload: string }>()
);
