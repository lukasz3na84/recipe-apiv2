import {
  ValidationOptions,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';
/*
export functiom Match<T>(
  property: key of T, // np. confirmPasssword
) 

zwraca funkcję, ktorej rolą będzie zarejestrowanie dekoratora

return (object: unknown, propertyName: string)
object - obiekt np. CreateUserDto
propertyName - nazwa dekorowanej właściwości


*/

export function Match<T>(
  property: keyof T, // np. confirmPasssword
  validationOptions?: ValidationOptions,
) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropoertyName] = args.constraints;
          const relatedValue = (args.object as unknown)[relatedPropoertyName];

          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropoertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropoertyName}`;
        },
      },
    });
  };
}
