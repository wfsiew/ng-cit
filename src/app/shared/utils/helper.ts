import _ from 'lodash';
import { AppConstant } from '../constants/app.constant';

export class Helper {

  public static isEmpty(s) {
    return _.isEmpty(s);
  }
  
  public static getPostcodePattern(iso: string): string {
    const o = _.find(AppConstant.POSTALCODE, (x) => {
      return x['ISO'] === iso;
    });
    return o['Regex'];
  }

  public static getStart(page, limit) {
    return (page - 1) * limit;
  }

  public static getDateStr(dt: Date) {
    let s = `${dt.getFullYear()}-${this.paddZero(dt.getMonth() + 1)}-${Helper.paddZero(dt.getDate())}`;
    return s;
  }

  public static paddZero(i: number) {
    let s = `${i}`;
    if (i < 10) {
      s = `0${i}`;
    }

    return s;
  }
}