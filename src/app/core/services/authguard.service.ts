import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import { CognitoService } from './cognito.service';

@Injectable()
export class AuthguardService implements CanActivate, CanActivateChild {

  constructor(private cognitoService: CognitoService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.cognitoService.checkLogin()
      .then((res) => {
        if(res) {
          localStorage.setItem('trainingtube-currentuser-token', res['token']);
          return true;
        } else {
          this.router.navigate(['/pg/auth/login']);
          return false;
        }
      })
      .catch((err) => {
        this.router.navigate(['/pg/auth/login']);
        return false;
      });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

}
