import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorDialogComponent } from "./components/error-dialog/error-dialog.component";
import { HeaderComponent } from "./components/header/header.component";
import { HeaderMenuComponent } from "./components/header-menu/header-menu.component";

@NgModule({
  declarations: [
    ErrorDialogComponent,
    HeaderComponent,
    HeaderMenuComponent,
  ],
  imports: [
    MatIconModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  exports: [
    MatIconModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ErrorDialogComponent,
    HeaderComponent,
    HeaderMenuComponent,
  ],
  providers: [],
})
export class SharedModule { }