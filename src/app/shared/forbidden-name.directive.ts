import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";
import {Directive, Input} from "@angular/core";

@Directive({
  selector: '[appForbiddenName]',
  providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenNameDirective, multi: true}]
})
export class ForbiddenNameDirective implements Validator {
  @Input('appForbiddenNames') forbiddenNames: string[] = [];
  @Input('appCurrentName') currentName: string = '';

  validate(control: AbstractControl): ValidationErrors | null {
    return this.forbiddenNames.includes(control.value) && control.value !== this.currentName ? {forbiddenName: { value: control.value }} : null
  }
}
