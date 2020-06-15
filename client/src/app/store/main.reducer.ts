import * as MainActions from './main.actions';
import {Action, createReducer, on} from '@ngrx/store';
import {MessageModel} from '../message.model';

export interface MainState {
    data: MessageModel[];
}

const initialState: MainState = {
    data: [],
};

const reducer = createReducer(initialState,
    on(MainActions.SAVE_MESSAGE_DATA, (state, action) => ({...state, data: action.payload})),
);


export function MainReducer(state: MainState | undefined, action: Action) {
    return reducer(state, action);
}
