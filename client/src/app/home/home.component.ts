import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {AppState} from '../app.reducer';
import {mainStateMessageDataSelector} from '../store/main.selector';
import {MessageModel} from '../message.model';
import * as MainActions from '../store/main.actions';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    messages: MessageModel[];

    constructor(private store: Store<AppState>) {
    }

    ngOnInit(): void {
        this.store.dispatch(MainActions.TRY_FETCH_MESSAGE_DATA());

        this.store.pipe(select(mainStateMessageDataSelector)).subscribe(
            value => {
                this.messages = value;
            }
        );
    }

    deleteTask(index: number) {
        this.store.dispatch(MainActions.TRY_DELETE_MESSAGE_DATA({payload: this.messages[index]._id}));
    }
}
