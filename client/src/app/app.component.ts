import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from './app.reducer';
import * as MainActions from './store/main.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'deepsync';

    constructor(private store: Store<AppState>) {

    }

    ngOnInit() {
    }
}
