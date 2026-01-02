import { RemoveEmptyRows } from "./cleaners/RemoveEmptyRows.js";
import { RemoveDuplicates } from "./cleaners/RemoveDuplicates.js";
import { NormalizeHeaders } from "./cleaners/NormalizeHeaders.js";
import { NormalizeNulls } from "./cleaners/NormalizeNulls.js";
import { NormalizeDates } from "./cleaners/NormalizeDates.js";
import { CapitalizeText } from "./cleaners/CapitalizeText.js";
import { ValidateEmails } from "./cleaners/ValidateEmails.js";
import { NormalizeBooleans } from "./cleaners/NormalizeBooleans.js";

export const CleanerRegistry = [
  new NormalizeHeaders(), 
  new RemoveEmptyRows(),   
  new NormalizeNulls(),    
  new RemoveDuplicates(),  
  new NormalizeDates(),    
  new CapitalizeText(),    
  new ValidateEmails(),     
  new NormalizeBooleans()   
];