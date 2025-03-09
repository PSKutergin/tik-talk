import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { AddressData } from '@tt/data-access';

@Pipe({
  name: 'addressFormat',
  standalone: true,
  pure: true // не пересчитывается без изменения входных данных
})
@Injectable({
  providedIn: 'root'
})
export class AddressFormatPipe implements PipeTransform {
  transform(data: AddressData): string {
    if (!data) return '';

    const city = data.city ? `${data.city_type}.${data.city}` : '';
    const street = data.street ? `, ${data.street_type}.${data.street}` : '';
    const house = data.house ? `, ${data.house_type}.${data.house}` : '';
    const flat = data.flat ? `, ${data.flat_type}.${data.flat}` : '';

    return `${city}${street}${house}${flat}`;
  }
}
