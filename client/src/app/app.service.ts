import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    constructor(private http: HttpClient) {
    }

    getMessageData(): Observable<any> {
        const websiteDataEndpoint = 'http://localhost:3000/worker/messages';
        // We do not subscribe here! We let the resolver take care of that...
        return this.http.get(websiteDataEndpoint, {observe: 'response'});
    }

    saveNewMessageData(data): Observable<any> {
        const websiteDataEndpoint = 'http://localhost:3000/worker/messages';
        // We do not subscribe here! We let the resolver take care of that...
        return this.http.post(websiteDataEndpoint, data, {observe: 'response'});
    }
    deleteMessageData(data): Observable<any> {
        const websiteDataEndpoint = 'http://localhost:3000/worker/message/' + data;
        // We do not subscribe here! We let the resolver take care of that...
        return this.http.delete(websiteDataEndpoint, {observe: 'response'});
    }
}
