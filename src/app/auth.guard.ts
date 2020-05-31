import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AppService } from './app.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private appService: AppService) { }

    canActivate() {
        let allow = true;
        const currentUser = this.appService.username;
        if (!currentUser) {
            this.router.navigate(['/']);
            allow = false;
        }
        return allow;
    }
}
