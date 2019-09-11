import { FormControl, AbstractControl } from '@angular/forms';

export class CustomValidator {

  public static passwordMatch(control: AbstractControl) {
    const a = control.get('pwd').value;
    const b = control.get('cpwd').value;
    if (a !== b) {
      control.get('cpwd').setErrors({ wrongpwd: true });
    }
  }
}