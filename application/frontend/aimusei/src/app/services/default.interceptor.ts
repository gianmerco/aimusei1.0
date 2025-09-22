import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpXsrfTokenExtractor, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { ToastService } from './toast.service';
import { SessionService } from './session.service';
import { finalize } from 'rxjs/operators';

interface headers{
  "Permissions-Policy"?: string;
  "Strict-Transport-Security"?: string;
  "X-Frame-Options"?: string;
  "X-Content-Type-Options"?: string;
  "X-Xss-Protection"?: string;
  "Content-Security-Policy"?: string;
  "X-XSRF-TOKEN"?: string;
  "X-AUTH-XSRF-TOKEN"?: string;
}

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  defaultHeaders = {
    "Permissions-Policy": "camera=*,geolocation=*,microphone=*,autoplay=*,fullscreen=*,picture-in-picture=*,sync-xhr=*,encrypted-media=*,oversized-images=*",
    "Strict-Transport-Security": "max-age=31536000; includeSubdomains",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Content-Type-Options": "nosniff",
    "X-Xss-Protection": "1; mode=block",
    "Content-Security-Policy": "script-src https: 'unsafe-inline' 'unsafe-eval';style-src https: 'unsafe-inline' 'unsafe-eval';img-src https: data:;font-src https: data:;",
    "X-XSRF-TOKEN": '1RXatgxGBUNcXoWgdMHMQX0qSW8TkjXgEEZEtcznK8unruhR4iDrhjglYyZxa72SFuz4chkfZA4n9gXNI399jPjUHaqRmo1h',
  };

  private totalRequests = 0;

  constructor(
    private tokenExtractor: HttpXsrfTokenExtractor,
    private toastService: ToastService,
    private sessionService: SessionService,
  ) {}
  
  intercept( 
    request: HttpRequest<any>, 
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let csrfToken = null;
    const cookies = document.cookie.split('; ');
    let app=JSON.parse(JSON.stringify(this.defaultHeaders));

    /**
     * check and save XSRF cookie token
     */
    for (const cookie of cookies) {
      if (cookie.startsWith('XSRF-TOKEN=')) {
        csrfToken = cookie.substring('XSRF-TOKEN='.length);
      }
    }

    if(csrfToken == null || request.headers.has('X-XSRF-TOKEN')){
      delete app['X-XSRF-TOKEN']
    }
    else{
      app['X-XSRF-TOKEN']=csrfToken;
    }

    request = request.clone({
      setHeaders: {
      ... app,
    },
      withCredentials: request.withCredentials ? true : false 
    });

    this.totalRequests++;
    this.sessionService.showSpinner=true;

    return Observable.create((observer: any) => {
      const subscription = next.handle(request)
        .pipe(
          finalize(() => {
            this.totalRequests--;
            if (this.totalRequests === 0) {
              this.sessionService.showSpinner=false;
            }
          })
        )
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              observer.next(event);
            }
          },
          error => {
            if (error.error instanceof Error) {
              console.error('An error occurred:', error.error.message);
            }else{
              console.error(`Backend returned code ${error?.status}, body was: `,error.error);
              this.toastService.showErrorToast('ERRORE', error);
            }
            observer.error(error);
          },
          () => {
            observer.complete();
          });
      return () => {
        subscription.unsubscribe();
      };
    });
  }
}
