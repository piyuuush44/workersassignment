import {MainState} from './main.reducer';
import {createSelector} from '@ngrx/store';
import {AppState} from '../app.reducer';

export const coreState = (state: AppState) => state.mainState;

export const mainStateMessageDataSelector = createSelector(
    coreState, (state: MainState) => state.data
);
