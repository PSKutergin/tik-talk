import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: string | null): string | null {
    if (!value) return null;

    const now = new Date();
    const offset = now.getTimezoneOffset() * 60 * 1000;
    const date = new Date(value);
    const diff = now.getTime() + offset - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Логика для секунд
    if (seconds < 60) {
      return `${seconds} ${this.getDeclension(seconds, ['секунда', 'секунды', 'секунд'])} назад`;
    }

    // Логика для минут
    if (minutes < 60) {
      return `${minutes} ${this.getDeclension(minutes, ['минута', 'минуты', 'минут'])} назад`;
    }

    // Логика для часов
    if (hours < 24) {
      return `${hours} ${this.getDeclension(hours, ['час', 'часа', 'часов'])} назад`;
    }

    // Логика для дней
    if (days < 30) {
      return `${days} ${this.getDeclension(days, ['день', 'дня', 'дней'])} назад`;
    }

    // Логика для месяцев
    if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} ${this.getDeclension(months, ['месяц', 'месяца', 'месяцев'])} назад`;
    }

    // Логика для лет
    const years = Math.floor(days / 365);
    return `${years} ${this.getDeclension(years, ['год', 'года', 'лет'])} назад`;
  }

  getDeclension(number: number, forms: string[]): string {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return forms[2];
    }

    if (lastDigit === 1) {
      return forms[0];
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return forms[1];
    } else {
      return forms[2];
    }
  }
}