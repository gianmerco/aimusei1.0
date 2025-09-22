import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit, OnDestroy, AfterViewInit {

  preferenzeShow: boolean = false;
  lang: string = 'ita';
  langs: any[] = [
    {key: 'ita', label: 'ITALIANO', img: 'assets/images/ita.jpg'},
    {key: 'eng', label: 'ENGLISH', img: 'assets/images/uk.png'},
  ];

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
  form: FormGroup = new FormGroup({});

  constructor(
    private sessionService: SessionService,
  ) { }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    let elem=document.getElementById('collapseExample');
    if(elem){
      elem.addEventListener('show.bs.collapse', ()=> {
        this.preferenzeShow=true;
      });
      elem.addEventListener('hide.bs.collapse', ()=> {
        this.preferenzeShow=false;
      });
    }
  }

  ngOnInit(): void {
    for(let t of this.types){
      this.form.addControl(t.key, new FormControl(null,[]));
      this.form.get(t.key)?.valueChanges.subscribe(res=>{
        if(res){
          for(let key of Object.keys(this.form.value)){
            if(key!=t.key) this.form.get(key)?.patchValue(false);
          }
          this.sessionService.$config.next(t.key);
        }
      });
    }
    this.form.valueChanges.subscribe(res=>{
      let vet=Object.keys(res).filter(k=>res[k]);
      if(vet.length==0){
        this.sessionService.$config.next(null);
      }
    })
  }

  getLang(){
    return this.langs.find(t=>t.key==this.lang);
  }

}
