import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { HomeComponent } from './home/home.component';
import { ImageReaderComponent } from './image-reader/image-reader.component';
import { HomeWithMenuComponent } from './home-with-menu/home-with-menu.component';
import { HomepageIframeComponent } from './homepage-iframe/homepage-iframe.component';

const routes: Routes = [
  { path: 'image-reader', component: ImageReaderComponent},
  { path: 'backoffice', component: HomepageComponent},
  { path: 'backoffice-iframe', component: HomepageIframeComponent},
  { path: 'aimusei', component: HomeComponent},
  { path: 'home-with-menu', component: HomeWithMenuComponent},
  { path: '**', redirectTo: 'aimusei' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
