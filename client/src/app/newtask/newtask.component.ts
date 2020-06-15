import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import * as MainActions from "../store/main.actions";
import {Store} from "@ngrx/store";
import {AppState} from "../app.reducer";

@Component({
    selector: 'app-newtask',
    templateUrl: './newtask.component.html',
    styleUrls: ['./newtask.component.css']
})
export class NewtaskComponent implements OnInit {
    myForm: FormGroup;

    constructor(private fb: FormBuilder, private store: Store<AppState>) {
    }

    ngOnInit(): void {
        this.myForm = this.createForm();
    }

    createForm(): FormGroup {
        return this.fb.group({
            content: this.fb.control(''),
            priority: this.fb.control(''),
            to: this.fb.control(''),
        });
    }

    onSubmit() {
        this.store.dispatch(MainActions.TRY_SAVE_NEW_MESSAGE_DATA({payload: this.myForm.getRawValue()}));
    }
}
