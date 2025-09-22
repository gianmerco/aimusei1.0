import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { APP_ENVIRONMENT, SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { AppEnvironment } from '../model/env';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {

  alive: boolean = true;
  form: FormGroup = new FormGroup({
    title: new FormControl('PANTHEON',[Validators.required,Validators.minLength(1)]),
    input: new FormControl(null,[Validators.required,Validators.minLength(1)]),
    selectedType: new FormControl(null, []),
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
      key: 'DISCALCULIA',
    }
  ];

  currentTag: string  = '';
  selectedTypes: any[] = [];

  results: any = {};

  validate: any = {};
  edit: any = {};

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
      this.form.addControl('checkbox_'+t.key, new FormControl(false,[]));
      this.form.addControl(t.key, new FormControl(null,[]));
      this.edit[t.key]=false;
      this.validate[t.key]=false;
    }
    // this.form.get('selectedType')?.valueChanges.pipe(takeWhile(()=>this.alive)).subscribe(res=>{
    //   if(res){
    //     let type=this.types.find(x=>x.key==res);
    //     this.selectedTypes=type ? [type] : [];
    //     this.elabora();
    //   }
    //   else{
    //     this.selectedTypes=[];
    //     this.elabora();
    //   }
    // });
    this.search();
  }

  checkType(e: any, type: any){
    if(e){
      this.selectedTypes.push(type);
    }
    else{
      if(this.selectedTypes.findIndex(x=>x.key==type.key)>=0) this.selectedTypes.splice(this.selectedTypes.findIndex(x=>x.key==type.key),1);
    }
  }

  elabora(){
    this.results={};
    this.selectedTypes=([] as any[]).concat(this.types);
    if(this.selectedTypes.length>0){
      this.apiService.elaboraTesto(this.form.value.title, this.form.value.input, this.form.value.tag, this.selectedTypes).pipe(takeWhile(()=>this.alive))
      .subscribe((res: any)=>{
        this.results=res;
        for(let key of Object.keys(this.results)){
          this.form.get(key)?.patchValue(this.results[key]);
          this.edit[key]=false;
          this.validate[key]=false;
        }
      });
    }
  }

  checkTrad(){
    return this.form.invalid || this.selectedTypes.length==0;
  }

  getResults(){
    return this.selectedTypes.filter(x=>Object.keys(this.results).findIndex(y=>y==x.key)>=0).sort((a,b)=>{
      return this.types.findIndex(x=>x.key==a.key)-this.types.findIndex(x=>x.key==b.key);
    });
  }

  checkEdit(key: string){
    return this.edit[key];
  }

  checkValidate(key: string){
    return this.validate[key];
  }

  editFun(key: string){
    this.apiService.modificaSintesi(
      this.currentTag,
      this.form.get(key)?.value,
      key
    ).pipe(takeWhile(()=>this.alive)).subscribe(()=>{
      this.setValidation(key,true);
    });
  }

  setValidation(key: string, check: boolean = false){
    this.validate[key]=check;
    this.apiService.cambiaValiditaSintesi(
      this.currentTag,
      this.validate[key],
      key
    ).pipe(takeWhile(()=>this.alive)).subscribe();
  }

  search(){ 
    this.currentTag = this.form.get('tag')?.value + '';   
    let title=this.form.get('title')?.value+'';
    this.selectedTypes=([] as any[]).concat(this.types);
    this.form.reset();
    this.form.get('title')?.patchValue(title);
    this.apiService.getOpera(this.currentTag).pipe(takeWhile(()=>this.alive)).subscribe(res=>{
      if(res){
        this.form.get('input')?.setValue(res.descrizione);
        if(res.sintesi){
          this.results={};
          for(let sint of res.sintesi){
            if(sint.disabilita){
              if(this.selectedTypes.findIndex(x=>x.key==sint.disabilita)<0){
                this.form.get('checkbox_'+sint.disabilita)?.patchValue(true);
              }
              this.form.get(sint.disabilita)?.patchValue(sint.descrizione);
              this.results[sint.disabilita]=sint.descrizione;
              this.edit[sint.disabilita]=false;
              this.validate[sint.disabilita]=sint.validata;
            }
          }
        }
      }
    });
  }

  rielabora(key: string){
    this.apiService.getSintesi(this.form.get('tag')?.value, key+'_NEW').pipe(takeWhile(()=>this.alive)).subscribe((res: any)=>{
      let app=res?.sintesi?.find((x: any)=>x.disabilita==key);
      if(app) this.form.get(key)?.patchValue(app.descrizione);
      this.setValidation(key,false);
    });
  }

}
