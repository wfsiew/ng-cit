import _ from 'lodash';
import { AppConstant } from 'src/app/shared/constants/app.constant';

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

  public static getDateStr1(dt: Date) {
    let s = `${dt.getFullYear()}${this.paddZero(dt.getMonth() + 1)}${Helper.paddZero(dt.getDate())}`;
    return s;
  }

  public static paddZero(i: number) {
    let s = `${i}`;
    if (i < 10) {
      s = `0${i}`;
    }

    return s;
  }

  public static replaceNone(s: string) {
    let r = s;
    if (_.isNull(s)) return s;

    if (s.toLowerCase() === 'none') {
      r = '';
    }

    return r;
  }

  public static formatAmount(x: string) {
    let s = parseFloat(x);
    return s.toFixed(2);
  }
}