import * as FromMain from './store/main.reducer';
import {ActionReducerMap} from '@ngrx/store';

export interface AppState {
    mainState: FromMain.MainState;
}

export const reducers: ActionReducerMap<AppState> = {
    mainState: FromMain.MainReducer,
};
