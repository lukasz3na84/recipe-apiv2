import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TransformerPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(metadata);
    if (metadata.data === 'name') {
      return value ? value.toLowerCase() : 'piekny nieznajomy';
    }
  }
}
