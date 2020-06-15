import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {NewtaskComponent} from './newtask/newtask.component';
import {ViewtaskComponent} from './viewtask/viewtask.component';
import {ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {reducers} from './app.reducer';
import {EffectsModule} from '@ngrx/effects';
import {MainEffects} from './store/main.effects';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NewtaskComponent,
        ViewtaskComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([MainEffects]),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
