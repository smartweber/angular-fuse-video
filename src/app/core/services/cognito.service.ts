import { Injectable } from '@angular/core';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from 'amazon-cognito-identity-js';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Rx';
import {
  Router
} from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class CognitoService {
  isSignOut: boolean;
  private userPool: CognitoUserPool;
  private userPoolObservable: Observable<any>;

  constructor(private httpService: HttpService, private router: Router) {
    this.isSignOut = false;

    let organizationUrl = environment['api'] + 'organizations?organizationId=org-dev-test4';
    this.userPoolObservable = Observable.create(observer => {
      this.httpService.get(organizationUrl)
        .take(1)
        .subscribe((res: any) => {
          this.userPool = new CognitoUserPool({
            UserPoolId: res.userPoolId,
            ClientId: res.userPoolClientId
          });
          observer.next();
          observer.complete();
        }, (error: any) => {
          console.log(error);
          observer.next();
          observer.complete();
        });
    });
  }

  getUserData(session) {
    let userData = {};

    try {
      userData = {
        email: session.idToken.payload.email,
        token: session.getIdToken().getJwtToken()
      };
    } catch (err) {
      console.log(err);
      return null;
    }

    this.isSignOut = false;
    return userData;
  }

  forgotPassword(username: string) {
    return new Promise((resolve, reject) => {
      this.userPoolObservable.take(1).subscribe(()=>{
        const userData = {
          Username: username,
          Pool: this.userPool
        };
        const cognitoUser = new CognitoUser(userData);

        cognitoUser.forgotPassword({
          onSuccess: function (data) {
            // successfully initiated reset password request
            console.log('CodeDeliveryData from forgotPassword: ' + data);
          },
          onFailure: function(err) {
            reject(err);
          },
          //Optional automatic callback
          inputVerificationCode: function(data) {
            resolve();
          }
        });
      });
    });
  }

  resetPassword(username:string, verificationCode: string, newPassword: string) {
    return new Promise((resolve, reject) => {
      this.userPoolObservable.take(1).subscribe(()=>{
        const userData = {
          Username: username,
          Pool: this.userPool
        };
        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, newPassword, {
          onSuccess() {
            resolve();
          },
          onFailure(err) {
            reject(err);
          }
        });
      });
    });
  }

  signUp(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const dataEmail = {
        Name: 'email',
        Value: email
      };
      const  emailAtt = [new CognitoUserAttribute(dataEmail)];

      this.userPoolObservable.take(1).subscribe(()=>{
        this.userPool.signUp(email,  password, emailAtt, null, ((err, result) => {
          if (err && err['statusCode'] !== 200) {
            reject(err);
          } else {
            resolve(this.getUserData(result));
          }
        }));
      });
    });
  }

  signIn(username: string, password: string, newPassword: string = ''): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userPoolObservable.take(1).subscribe(()=>{
        const authData = {
          Username: username,
          Password: password
        };
        const authDetails = new AuthenticationDetails(authData);
        const userData = {
          Username: username,
          Pool: this.userPool
        };
        const cognitoUser = new CognitoUser(userData);
        const authCallbacks = {
          onSuccess: result => {
            localStorage.setItem('trainingtube-currentuser-token', result.getIdToken().getJwtToken());
            resolve(this.getUserData(result));
          },
          newPasswordRequired: userAttributes => {
            // User was signed up by an admin and must provide new
            // password and required attributes, if any, to complete
            // authentication.

            // the api doesn't accept this field back
            delete userAttributes.email_verified;

            if (!newPassword) {
              return reject({
                newPassword: true,
                message: 'must create new password'
              });
            }

            cognitoUser.completeNewPasswordChallenge(
              newPassword,
              userAttributes,
              authCallbacks
            );
          },
          onFailure: err => reject(err)
        };
        cognitoUser.authenticateUser(authDetails, authCallbacks);
      });
    });
  }

  signOut(previousPath: string = '') {
    if(this.isSignOut) {
      return;
    }

    this.userPoolObservable.take(1).subscribe(()=>{
      const cognitoUser = this.userPool.getCurrentUser();
      localStorage.removeItem('trainingtube-currentuser-token');
      if(previousPath) {
        this.router.navigate(['/pg/auth/login'], { queryParams: { ref: previousPath } });
      } else {
        this.router.navigate(['/pg/auth/login']);
      }

      this.isSignOut = true;

      if (!cognitoUser) {
        return null;
      }
      return cognitoUser.signOut();
    });
  }

  confirmRegistration(email: string, code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userPoolObservable.take(1).subscribe(()=>{
        const userData = {
          Username: email,
          Pool: this.userPool
        };

        const cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmRegistration(code, true, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          this.router.navigate(['/pg/auth/login']);
          resolve(true);
          // this.signIn(email, password).then(resolve).catch(reject);
        });
      });
    });
  }

  checkLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userPoolObservable.take(1).subscribe(()=>{
        const cognitoUser = this.userPool.getCurrentUser();
        if (!cognitoUser) {
          return reject({ message: 'no session' });
        }

        cognitoUser.getSession((err, session) => {
          if (err) {
            return reject(err);
          }
          if (!session.isValid()) {
            return reject({ message: 'invalid session' });
          }

          cognitoUser.getUserAttributes((errAttr, attributes) => {
            if (errAttr) {
              return reject(errAttr);
            }
            if (!attributes) {
              return reject({ message: 'missing user data' });
            }

            return resolve(this.getUserData(session));
          });
        });
      });
    });
  }

}
