import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { APP_ENVIRONMENT, SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { AppEnvironment } from '../model/env';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-image-reader',
  templateUrl: './image-reader.component.html',
  styleUrls: ['./image-reader.component.scss']
})
export class ImageReaderComponent implements OnInit, OnDestroy {

  alive: boolean = true;
  form: FormGroup = new FormGroup({
    title: new FormControl('GIOCONDA',[Validators.required,Validators.minLength(1)]),
    image: new FormControl('assets/images/GIOCONDA.jpg',[Validators.required, Validators.minLength(1)]),
    desc: new FormControl(null,[]),
    pittogramma: new FormControl(null,[]),
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
    },
    {
      label: 'Pittogramma',
      key: 'PITTOGRAMMA',
    }
  ];

  selectedTypes: any[] = [];
  results: any[] = [];


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
    }
    // this.form.get('selectedType')?.valueChanges.pipe(takeWhile(()=>this.alive)).subscribe(res=>{
    //   if(res){
    //     let type=this.types.find(x=>x.key==res);
    //     this.selectedTypes=type ? [type] : [];
    //     res=='PITTOGRAMMA' ? this.elaboraPittogramma() : this.elabora();
    //   }
    //   else{
    //     this.selectedTypes=[];
    //     this.elabora();
    //   }
    // });
  }

  elaboraAll(){
    this.results=[];
    this.selectedTypes=([] as any[]).concat(this.types);
    this.selectedTypes.forEach(t=>{
      t.key=='PITTOGRAMMA' ? this.elaboraPittogramma() : this.results.push(JSON.parse(JSON.stringify(t)));
    });
    this.elabora1();
  }

  checkType(e: any, type: any){
    if(e){
      this.selectedTypes.push(type);
      for(let t of this.types){
        if(t.key!==type.key){
          this.form.get('checkbox_'+t.key)?.patchValue(false);
        }
      }
    }
    else{
      if(this.selectedTypes.findIndex(x=>x.key==type.key)>=0) this.selectedTypes.splice(this.selectedTypes.findIndex(x=>x.key==type.key),1);
    }
  }

  elabora1(){
    this.apiService.elaboraImmagine(this.form.value.title, this.results).pipe(takeWhile(()=>this.alive))
    .subscribe((res: any)=>{
      if(res){
        console.log(res)
        // if(this.results.length>0) this.form.get(this.results[0].key)?.patchValue(res.sintesi[0]?.descrizione);
        // else{
        //   this.form.patchValue({desc: res.descrizione});
        // }
      }
    });
  }

  elabora(){
    this.results=[];
    this.form.get('pittogramma')?.patchValue(null);
    this.form.patchValue({desc: null});
    for(let t of this.types){
      this.form.get(t.key)?.patchValue(null);
      if(this.selectedTypes.findIndex(x=>x.key==t.key)>=0) this.results.push(JSON.parse(JSON.stringify(t)));
    }
    this.apiService.elaboraImmagine(this.form.value.title, this.results).pipe(takeWhile(()=>this.alive))
    .subscribe((res: any)=>{
      if(res){
        if(this.results.length>0) this.form.get(this.results[0].key)?.patchValue(res.sintesi[0]?.descrizione);
        else{
          this.form.patchValue({desc: res.descrizione});
        }
      }
    });
    // if(this.results.length>0) this.form.get(this.results[0].key)?.patchValue('prova');
    // else{
    //   this.form.patchValue({desc: 'prova'});
    // }
  }

  elaboraPittogramma(){
    // this.results=[];
    // this.form.patchValue({desc: null});
    // for(let t of this.types){
    //   this.form.get(t.key)?.patchValue(null);
    // }
    this.form.get('pittogramma')?.patchValue('assets/images/pittogramma_gioconda.png');
  }

  checkTrad(){
    return this.form.invalid || this.selectedTypes.length==0;
  }

  checkAccordion(){
    let check=false;
    if(this.form.get('pittogramma')?.value?.length>0) return true;
    if(this.form.get('desc')?.value?.length>0) return true;
    for(let t of this.results){
      if(this.form.get(t.key)?.value?.length>0){
        check=true;
        break;
      }
    }
    return check;
  }

}
