import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { takeWhile } from 'rxjs/operators';
import { Toast } from 'src/app/model/toast.model';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit, OnDestroy {

  toasts: Toast[] = [];
  alive: boolean = true;

  constructor(
    public sessionService: SessionService,
    public toastService: ToastService,
  ) { }

  ngOnDestroy(): void {
      this.alive=false;
  }

  ngOnInit(): void {
    this.toastService.$toasts.pipe(takeWhile(() => this.alive)).subscribe(ts => {
      this.toasts = ts;
    });
  }

}
