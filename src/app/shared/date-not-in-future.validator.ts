import {FormControl} from "@angular/forms";

export function dateNotInFutureValidator(control: FormControl): { [key: string]: any } | null {
  const today = new Date();
  const incomingDate = new Date(control.value)
  if(incomingDate > today) {
    return { dateNotInFuture: true }
  }
  return null

}
