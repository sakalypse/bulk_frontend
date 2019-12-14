import { Injectable, Inject } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: "root"
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let authInfo = {
      authenticated: (this.authService.hasToken()&&!this.authService.hasTokenExpired())
    };

    if (!authInfo.authenticated) {
      this.authService.clearStorage();
      this.router.navigate(["login"]);
      return false;
    }

    return true;
  }
}