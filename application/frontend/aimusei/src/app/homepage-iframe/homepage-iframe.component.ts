import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { APP_ENVIRONMENT, SessionService } from '../services/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppEnvironment } from '../model/env';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-homepage-iframe',
  templateUrl: './homepage-iframe.component.html',
  styleUrls: ['./homepage-iframe.component.scss']
})
export class HomepageIframeComponent implements OnInit, OnDestroy {

  alive: boolean = true;
  form: FormGroup = new FormGroup({
    title: new FormControl(null,[Validators.required,Validators.minLength(1)]),
    input: new FormControl(null,[Validators.required,Validators.minLength(1)]),
    selectedType: new FormControl(null, []),
    version: new FormControl('V4', []),
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
      key: 'DISCALCULIA',
    }
  ];
  currentTag: string = '';
  selectedTypes: any[] = [];

  results: any = {};
  lastUpdates: any = {};
  editors: any = {};

  validate: any = {};
  edit: any = {};
  text: string = '';
  funz: string = "";
  tag: string = "";
  status: string = '';

  constructor(
    public sessionService: SessionService,
    private router: Router,
    @Inject(APP_ENVIRONMENT) public env: AppEnvironment,
    private apiService: ApiService,
    private toastService: ToastService,
    private route: ActivatedRoute,
  ) { }

  ngOnDestroy(): void {
    this.alive=false;
  }

  ngOnInit(): void {
    window.addEventListener('message', event => {
      // if (event.origin !== 'https://trusted-domain.com') return;
      const { type, payload } = event.data;
      if(payload?.text && payload?.funz && payload?.tag && payload?.status){
        this.status=payload.status;
        this.text=payload.text;
        this.funz=payload.funz;
        this.form.get("title")?.setValue(payload.title);
        this.currentTag=payload.tag;
        for(let t of this.types){
          this.form.addControl('checkbox_'+t.key, new FormControl(false,[]));
          this.form.addControl(t.key, new FormControl(null,[]));
          this.edit[t.key]=false;
          this.validate[t.key]=false;
        }
        this.search();
      }
    });
    // this.route.queryParams.pipe(takeWhile(()=>this.alive)).subscribe(params=>{
    //   if(params['text']){
    //     this.text=params['text'];
    //     for(let t of this.types){
    //       this.form.addControl('checkbox_'+t.key, new FormControl(false,[]));
    //       this.form.addControl(t.key, new FormControl(null,[]));
    //       this.edit[t.key]=false;
    //       this.validate[t.key]=false;
    //     }
    //     // this.form.get('selectedType')?.valueChanges.pipe(takeWhile(()=>this.alive)).subscribe(res=>{
    //     //   if(res){
    //     //     let type=this.types.find(x=>x.key==res);
    //     //     this.selectedTypes=type ? [type] : [];
    //     //     this.elabora();
    //     //   }
    //     //   else{
    //     //     this.selectedTypes=[];
    //     //     this.elabora();
    //     //   }
    //     // });
    //     this.search();
    //   }
    // });
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
    return this.selectedTypes.sort((a,b)=>{
      return this.types.findIndex(x=>x.key==a.key)-this.types.findIndex(x=>x.key==b.key);
    });
  }

  checkEdit(key: string){
    return this.edit[key];
  }

  checkValidate(key: string, check: boolean = false){
    if(check){
      return this.form.get(key)?.value?.length>0;
    }
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
    ).pipe(takeWhile(()=>this.alive)).subscribe(()=>{
    });
  }

  search(){
    // mantiene il valore del tag attivo

    let tag = this.form.get('tag')?.value;
    let title=this.form.get('title')?.value+'';
    let version=this.form.get('version')?.value+'';
    this.selectedTypes=([] as any[]).concat(this.types);
    this.form.reset();
    this.form.get('title')?.patchValue(title);
    this.form.get('version')?.patchValue(version);
    this.apiService.getOpera(this.currentTag).pipe(takeWhile(()=>this.alive)).subscribe(res=>{
      if(res){
        this.form.get('input')?.setValue(this.text);
        // this.form.get('input')?.setValue(res.descrizione);
        setTimeout(()=>{
          this.sessionService.showSpinner=true;
          setTimeout(()=>{
            this.sessionService.showSpinner=false;
            if(res.sintesi){
              this.results={};
              this.lastUpdates={};
              for(let sint of res.sintesi){
                if(sint.disabilita){
                  if(this.selectedTypes.findIndex(x=>x.key==sint.disabilita)<0){
                    this.form.get('checkbox_'+sint.disabilita)?.patchValue(true);
                  }
                  if(this.status=='new' && sint.disabilita=='DISLESSIA'){
                    this.form.get(sint.disabilita)?.patchValue('');
                    this.results[sint.disabilita]='';
                    this.editors[sint.disabilita]=sint.editor;
                    this.lastUpdates[sint.disabilita]=sint.lastUpdate ? new Date(sint.lastUpdate) : new Date();
                    this.edit[sint.disabilita]=false;
                    this.validate[sint.disabilita]=false;
                  }
                  else{
                    this.form.get(sint.disabilita)?.patchValue(sint.descrizione);
                    this.results[sint.disabilita]=sint.descrizione;
                    this.editors[sint.disabilita]=sint.editor;
                    this.lastUpdates[sint.disabilita]=sint.lastUpdate ? new Date(sint.lastUpdate) : new Date();
                    this.edit[sint.disabilita]=false;
                    this.validate[sint.disabilita]=sint.validata;
                    if(this.status=='new'){
                      this.setValidation(sint.disabilita,false);
                    }
                  }
                }
              }
            }
          },5000);
        },500);
      }
    });
  }

  rielabora(key: string){
    this.apiService.getSintesi(this.currentTag, key+'_NEW').pipe(takeWhile(()=>this.alive)).subscribe((res: any)=>{
      let app=res?.sintesi?.find((x: any)=>x.disabilita==key+'_NEW');
      if(app) this.form.get(key)?.patchValue(app.descrizione);
      this.setValidation(key,false);
    });
  }

  formatDate(d: Date){
    return d.toLocaleDateString();//+' - '+d.toLocaleTimeString();
  }

  salva(){
    let check=true;
    for(let t of this.types){
      if(!this.form.get(t.key)?.value || this.form.get(t.key)?.value.length==0){
        check=false;
        break;
      }
    }
    let elems=document.getElementsByClassName('accordion-collapse');
    if(elems){
      for(let i=0;i<elems.length;i++){
        elems.item(i)?.classList.remove('show');
      }
    }
    let elems2=document.getElementsByClassName('accordion-button');
    if(elems2){
      for(let i=0;i<elems2.length;i++){
        elems2.item(i)?.classList.add('collapsed');
      }
    }
    window.parent.postMessage({ type: 'saved', id: 'xyz',
      body: {
        tag: this.currentTag,
        hash: '4f434few085o64tfgt53',  //MOCKED HASH
      },
      status: check ? (this.types.some(t=>!this.validate[t.key]) ? 'ai' : 'ok') : 'nok' }, '*');
  }

  checkDisabled(){
    return this.types.some(t=>!this.form.get(t.key)?.value || this.form.get(t.key)?.value.length==0);
  }

  getStatus(key: string){
    if(this.form.get(key)?.value?.length>0 && this.checkValidate(key)){
      return 'Validato';
    }
    else if(this.form.get(key)?.value?.length>0 && !this.checkValidate(key)){
      return 'Generato';
    }
    else if(!this.checkValidate(key,true)){
      return 'Non presente';
    }
    else{
      return '';
    }
  }

}
