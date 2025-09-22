import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultInterceptor } from './services/default.interceptor';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ImageReaderComponent } from './image-reader/image-reader.component';
import { HomeWithMenuComponent } from './home-with-menu/home-with-menu.component';
import { HomepageIframeComponent } from './homepage-iframe/homepage-iframe.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HomepageIframeComponent,
    HomeComponent,
    ImageReaderComponent,
    HomeWithMenuComponent,
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }