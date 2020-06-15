import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {NewtaskComponent} from './newtask/newtask.component';

const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    {
        path: 'newtask', component: NewtaskComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
