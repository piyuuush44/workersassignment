import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {MainState} from './main.reducer';
import * as MainActions from './main.actions';
import {catchError, map, switchMap} from 'rxjs/operators';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {EMPTY} from 'rxjs';
import {AppService} from '../app.service';

@Injectable()
export class MainEffects {

    fetchMessageData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MainActions.TRY_FETCH_MESSAGE_DATA),
            switchMap(() =>
                this.appService.getMessageData().pipe(
                    map((response: HttpResponse<any>) => {
                            return MainActions.SAVE_MESSAGE_DATA({payload: response.body.result.message});
                        }
                    ),
                    catchError(error => EMPTY
                    )
                )
            )
        )
    );
    saveNewMessageData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MainActions.TRY_SAVE_NEW_MESSAGE_DATA),
            map((data) => data.payload),
            switchMap((payload) =>
                this.appService.saveNewMessageData(payload).pipe(
                    map((response: HttpResponse<any>) => {
                            this.router.navigate(['']);
                            return MainActions.TRY_FETCH_MESSAGE_DATA();
                        }
                    ),
                    catchError(error => EMPTY
                    )
                )
            )
        ),
    );

    deleteMessageData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(MainActions.TRY_DELETE_MESSAGE_DATA),
            map((data) => data.payload),
            switchMap((payload) =>
                this.appService.deleteMessageData(payload).pipe(
                    map((response: HttpResponse<any>) => {
                            this.router.navigate(['']);
                            return MainActions.TRY_FETCH_MESSAGE_DATA();
                        }
                    ),
                    catchError(error => EMPTY
                    )
                )
            )
        ),
    );

    constructor(
        private actions$: Actions,
        private store: Store<MainState>,
        private http: HttpClient,
        private router: Router,
        private appService: AppService
    ) {
    }
}
