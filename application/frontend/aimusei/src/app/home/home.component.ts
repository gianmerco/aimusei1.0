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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  alive: boolean = true;
  form: FormGroup = new FormGroup({
    title: new FormControl(null,[Validators.required,Validators.minLength(1)]),
    input: new FormControl('',[Validators.required,Validators.minLength(1)]),
    selectedType: new FormControl(null, []),
    tag: new FormControl({ value: null, disabled: true })
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

  selectedTypes: any[] = [];

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
    for(let t of this.types){
      this.form.addControl('checkbox_'+t.key, new FormControl({value: false, disabled: true},[]));
      this.form.addControl(t.key, new FormControl(null,[]));
    }
    // this.form.get('selectedType')?.valueChanges.pipe(takeWhile(()=>this.alive)).subscribe(res=>{
    //   if(res){
    //     let type=this.types.find(x=>x.key==res);
    //     this.selectedTypes=type ? [type] : [];
    //     if(type){
    //       this.apiService.getSintesi(this.form.get('title')?.value, type.key).pipe(takeWhile(()=>this.alive))
    //       .subscribe(res=>{
    //         let app=res?.sintesi?.find((x: any)=>x.disabilita==type.key);
    //         if(app) this.form.get(type.key)?.patchValue(app.descrizione);
    //         else this.form.get(type.key)?.patchValue(null);
    //       });
    //     }
    //   }
    //   else{
    //     this.selectedTypes=[];
    //   }
    // });
  }

  checkType(e: any, type: any){
    if(e){
      this.selectedTypes.push(type);
      for(let t of this.types){
        if(t.key!==type.key){
          this.form.get('checkbox_'+t.key)?.patchValue(false);
        }
      }
      this.apiService.getSintesi(this.form.get('title')?.value, type.key).pipe(takeWhile(()=>this.alive))
      .subscribe(res=>{
        let app=res?.sintesi?.find((x: any)=>x.disabilita==type.key);
        if(app) this.form.get(type.key)?.patchValue(app.descrizione);
        else this.form.get(type.key)?.patchValue(null);
      });
    }
    else{
      if(this.selectedTypes.findIndex(x=>x.key==type.key)>=0) this.selectedTypes.splice(this.selectedTypes.findIndex(x=>x.key==type.key),1);
    }
  }

  getDescrizione(event: string){
    this.types.forEach(t=>{
      this.form.get('checkbox_'+t.key)?.enable();
      this.form.get('checkbox_'+t.key)?.patchValue(false);
    });
    this.apiService.getDescrizione(event).pipe(takeWhile(()=>this.alive)).subscribe((res: any)=>{
      this.form.get('input')?.patchValue(res.descrizione);
      this.selectedTypes=([] as any[]).concat(this.types);
      this.selectedTypes.forEach(t=>{
        this.apiService.getSintesi(this.form.get('title')?.value, t.key).pipe(takeWhile(()=>this.alive))
        .subscribe(res=>{
          let app=res?.sintesi?.find((x: any)=>x.disabilita==t.key);
          if(app) this.form.get(t.key)?.patchValue(app.descrizione);
          else this.form.get(t.key)?.patchValue(null);
        });
      });
    },error=>{
      this.form.get('input')?.patchValue('');
    });
  }

}
