import * as yup from 'yup';
import {
    wrongEmailLength,
    wrongEmailFormat,
    wrongPasswordLength,
} from '../modules/user/register/errorMessages';

export const registerPasswordValidation = yup
    .string()
    .min(3, wrongPasswordLength)
    .max(255);

export const registerEmailValidation = yup
    .string()
    .min(3, wrongEmailLength)
    .max(255)
    .email(wrongEmailFormat);
