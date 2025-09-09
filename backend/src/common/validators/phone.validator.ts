import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // Basic phone number validation (E.164 format)
          const phoneRegex = /^\+[1-9]\d{1,14}$/;
          return phoneRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Phone number must be in E.164 format (e.g., +1234567890)';
        },
      },
    });
  };
}
