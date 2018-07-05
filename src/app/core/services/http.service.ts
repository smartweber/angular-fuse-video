import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService {
  options: Object;
  returnValue: any; // for a unit test

  constructor(private httpClient: HttpClient) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.options = { headers: headers };
  }

  get(url: string, isJwt: boolean = false): Observable<any> {
    let options = this.options;
    if(isJwt) {
      let jwtHeaders = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('trainingtube-currentuser-token'),
        'Content-Type': 'application/json'
      });

      options = { headers: jwtHeaders };
    }

    return this.httpClient.get(url, options)
     .catch((error:HttpErrorResponse) => this.handleError(error));
  }

  post(strUrl: string, objPostData: Object, isJwt: boolean = false) {
    let options = this.options;
    if(isJwt) {
      let jwtHeaders = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('trainingtube-currentuser-token'),
        'Content-Type': 'application/json'
      });

      options = { headers: jwtHeaders };
    }

    return this.httpClient.post(strUrl, objPostData, options)
      .catch((error:any) => this.handleError(error));
  }

  put(strUrl: string, objPutData: Object, isJwt: boolean = false) {
    let options = this.options;
    if(isJwt) {
      let jwtHeaders = new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('trainingtube-currentuser-token'),
        'Content-Type': 'application/json'
      });

      options = { headers: jwtHeaders };
    }

    return this.httpClient.put(strUrl, objPutData, options)
      .catch((error:any) => this.handleError(error));
  }

  handleError(error: HttpErrorResponse) {
    if(error.status === 400) {// not enough data
      return Observable.throw({
        type: 0,
        message: error['error']?error['error']['message']:''
      });
    } else if(error.status === 401) { // authentication issue
      return Observable.throw({
        type: 1
      });
    } else {
      return Observable.throw({
        type: 2
      });
    }
  }

}
