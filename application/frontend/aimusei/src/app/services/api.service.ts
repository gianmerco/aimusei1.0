import { HttpClient, HttpParams } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { APP_ENVIRONMENT, SessionService } from "./session.service";
import { AppEnvironment } from "../model/env";
import { Opera, Sintesi } from "../model/opera.model";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
        private http: HttpClient,
        private sessionService: SessionService,
        @Inject(APP_ENVIRONMENT) public env: AppEnvironment,
    ){}

    elaboraImmagine(title: string, dist: any[]){
        let params: HttpParams = new HttpParams();
        params=params.set('titolo',title);
        // params=params.set('disabilita',dist.length==1 ? dist[0].key : null);
        for(let d of dist){
            params=params.append('disabilita',d.key);
        }
        return this.http.get<any>(this.env.apiUrl + '/elabora', {params: params});
    }

    elaboraTesto(title: string, descr: string, tag: string, dist: any[]){
        let obj={
            titolo: title,
            descrizione: descr,
            tag: tag,
            disabilita: dist.map(x=>x.key),
        }
        return this.http.post<any>(this.env.apiUrl + '/elaboraTestiDisabilita', obj);
    }

    getDescrizione(tag: string){
        let params: HttpParams = new HttpParams();
        params=params.set('tag',tag);
        return this.http.get<any>(this.env.apiUrl + '/getDescrizioneOpera', {params: params});
    }

    getSintesi(tag: string, dist: string){
        let params: HttpParams = new HttpParams();
        params=params.set('tag',tag);
        params=params.set('disabilita',dist);
        return this.http.get<any>(this.env.apiUrl + '/getSintesi', {params: params});
    }

    modificaSintesi(tag: string, descr: string, dist: string){
        let obj={
            tag: tag,
            nuovaSintesi: descr,
            disabilita: dist,
        }
        return this.http.post<any>(this.env.apiUrl + '/modificaSintesi', obj);
    }

    getOpera(tag: string){
        let params: HttpParams = new HttpParams();
        params=params.set('tag',tag);
        return this.http.get<Opera>(this.env.apiUrl + '/getOpera', {params: params});
    }

    cambiaValiditaSintesi(tag: string, val: boolean, dist: string){
        let obj={
            tag: tag,
            validata: val,
            disabilita: dist,
        }
        return this.http.post<any>(this.env.apiUrl + '/modificaFlagSintesi', obj);
    }

}