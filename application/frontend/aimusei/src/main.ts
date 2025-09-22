import { InjectionToken, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppEnvironment } from './app/model/env';
import { APP_ENVIRONMENT } from './app/services/session.service';

if (environment.production) {
  enableProdMode();
}


/**
 * @returns if present in the url replace %%ORIGIN%% with window.location.origi
 * If %%ORIGIN%% isn't present it return the url.
 */
function formatUrl(url:string): string {
  if(url.includes('%%ORIGIN%%')) {
    return url.replace('%%ORIGIN%%', window.location.origin);
  }
  else if(url.includes('%%HOSTNAME%%')) {
    return url.replace('%%HOSTNAME%%', window.location.hostname);
  }
  else return url;
}


window.fetch('assets/config/config.json')
  .then(res => res.json())
  .then((appEnvironment: AppEnvironment) => {
    // add prefix to be api endpoint
    appEnvironment.apiUrl = formatUrl(appEnvironment.apiUrl);

    platformBrowserDynamic([{ provide: APP_ENVIRONMENT, useValue: appEnvironment }]).bootstrapModule(AppModule)
      .catch(err => console.error(err));
})