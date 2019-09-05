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
}