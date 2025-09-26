import { AbstractControl, ValidationErrors } from '@angular/forms';

export function confirmPasswordValidator(group: AbstractControl): ValidationErrors | null {
  const newPass = group.get('new')?.value;
  const confirmPass = group.get('confirm')?.value; 
  if (!newPass && confirmPass) return { noNewPassword: true };  
  if (newPass && confirmPass && newPass !== confirmPass) return { passwordMismatch: true };  
  return null;
}
