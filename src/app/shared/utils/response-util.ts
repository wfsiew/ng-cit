import { HttpHeaders } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { AppConstant } from 'src/app/shared/constants/app.constant';
import { ResponseWrapper } from 'src/app/shared/models/response-wrapper';

export class ResUtil {

  static convertResponseList<T>(res: HttpResponse<any>, o: new () => T): ResponseWrapper {
    const results = [];

    for (let i = 0; i < res.body.length; i++) {
      const entity: T = Object.assign(new o(), res.body[i]);
      results.push(entity);
    }

    return new ResponseWrapper(res.headers, results, res.status);
  }

  static convertResponse<T>(res: HttpResponse<any>, o: new () => T): ResponseWrapper {
    const entity: T = Object.assign(new o(), res.body);

    return new ResponseWrapper(res.headers, entity, res.status);
  }
}