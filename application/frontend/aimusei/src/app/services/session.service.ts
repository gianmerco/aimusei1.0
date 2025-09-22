import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { AppEnvironment } from "../model/env";
import { BehaviorSubject } from "rxjs";

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>('App Enviromnent Injection Token');

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    showSpinner: boolean = false;
    $config: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        @Inject(APP_ENVIRONMENT) public env: AppEnvironment,
    ){}

}