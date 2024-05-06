import { FormControl, ValidationErrors } from "@angular/forms";

export class ECommerceValidators {
    // whitespace validation

    static notOnlyWhitespace(control: FormControl): ValidationErrors {

        //check if th string only have white space
        if((control.value !== null) && (control.value.trim().length === 0)) {          
            //invalid, return error object
            return {'notOnlyWhitespace': true};
        }
        else {
            return null;
        }
    }
}
