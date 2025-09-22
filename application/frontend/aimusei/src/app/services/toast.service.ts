import { Injectable } from "@angular/core";
import { Toast } from "../model/toast.model";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    $toasts = new BehaviorSubject<Toast[]>([]);

    constructor(
        private router: Router
    ) { }

    closeToast(toast: Toast){
        let ind=this.$toasts.value.findIndex(x => x.id == toast.id);
        if(ind>=0) this.$toasts.value.splice(ind, 1);
    }

    showToast(toast: Toast) {
        let lastId = this.$toasts.value.length > 0 ? this.$toasts.value[this.$toasts.value.length - 1].id : 0;
        let app = { id: lastId! + 1, ...toast };
        this.$toasts.value.push(app);
        setTimeout(() => {
            this.closeToast(app);
        }, 5000);
    }

    showErrorToast(title: string, error: any, message: string | null = null) {
        let msg = message ? message : (error.error?.error?.message ? error.error.error.message : (
            error.error?.message ? error.error.message : error.message
        ));
        this.showToast({ msg: msg, title: title, type: 'ERROR' });
    }

    showSuccessToast(title: string, msg: string) {
        this.showToast({ msg: msg, title: title, type: 'SUCCESS' });
    }

    showWarningToast(title: string, msg: string) {
        this.showToast({ msg: msg, title: title, type: 'WARNING' });
    }
}