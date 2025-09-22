import { AfterContentChecked, ChangeDetectorRef, Component, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { filter, takeWhile } from 'rxjs/operators';
import { SessionService } from './services/session.service';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AppEnvironment } from './model/env';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentChecked, OnDestroy {
  title = 'aimusei';

  alive: boolean = true;

  constructor(
    private changeDetector: ChangeDetectorRef,
    public sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (window.location.pathname.includes('iframe')) {
          document.body.classList.add('bg-white');
        }
       else {
          document.body.classList.remove('bg-white');
        }
      }
    });
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  checkMenu() {
    return window.location.pathname.includes('menu');
  }

  checkIframe() {
    return window.location.pathname.includes('iframe');
  }

}
