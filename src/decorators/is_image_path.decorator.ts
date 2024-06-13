import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsImagePath(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isImagePath',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const imagePathRegex =
            /^image\/eventBackground\/[a-zA-Z0-9]+\.(png|jpg|jpeg|gif|svg)$/;
          return typeof value === 'string' && imagePathRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} должен быть правильного формата, например: image/eventBackground/nameImage.formatImage`;
        },
      },
    });
  };
}
