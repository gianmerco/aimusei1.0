import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { APP_ENVIRONMENT, SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { AppEnvironment } from '../model/env';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { ToastService } from '../services/toast.service';
import { Sintesi } from '../model/opera.model';

@Component({
  selector: 'app-home-with-menu',
  templateUrl: './home-with-menu.component.html',
  styleUrls: ['./home-with-menu.component.scss']
})
export class HomeWithMenuComponent implements OnInit, OnDestroy {

  alive: boolean = true;
  form: FormGroup = new FormGroup({
    title: new FormControl('UMBRIA',[Validators.required,Validators.minLength(1)]),
    input: new FormControl('',[Validators.required,Validators.minLength(1)]),
    tag: new FormControl({ value: 'MUS1-SEZ1-ITA', disabled: true })
  });

  types: any[] = [
    {
      label: 'Testo facilitato (Easy to read)',
      key: "EASY_TO_READ",
    },
    {
      label: 'Testo semplificato (Dislessia)',
      key: "DISLESSIA",
    },
    {
      label: 'Supporto numerico semplificato (Discalculia)',
      key: 'DISCALCULIA'
    }
  ];
  valida: boolean | null = null;

  constructor(
    public sessionService: SessionService,
    private router: Router,
    @Inject(APP_ENVIRONMENT) public env: AppEnvironment,
    private apiService: ApiService,
    private toastService: ToastService,
  ) { }

  ngOnDestroy(): void {
    this.alive=false;
  }

  ngOnInit(): void {
    this.sessionService.$config.pipe(takeWhile(()=>this.alive)).subscribe(res=>{
      if(!res) this.getDescrizione();
      else{
        this.getSintesi(res);
      }
    });
  }

  getDescrizione(){
    this.valida=null;
    this.apiService.getDescrizione(this.form.get('title')?.value).pipe(takeWhile(()=>this.alive)).subscribe((res: any)=>{
      this.form.get('input')?.patchValue(res.descrizione);
    },error=>{
      this.form.get('input')?.patchValue('');
    });
  }

  getSintesi(key: string){
    this.apiService.getSintesi(this.form.get('title')?.value, key).pipe(takeWhile(()=>this.alive))
    .subscribe(res=>{
      let app=res?.sintesi?.find((x: any)=>x.disabilita==key);
      if(app){
        this.form.get('input')?.patchValue(app.descrizione);
        this.valida=app.validata;
      }
      else{
        this.form.get('input')?.patchValue(null);
        this.valida=null;
      }
    });
  }

}
