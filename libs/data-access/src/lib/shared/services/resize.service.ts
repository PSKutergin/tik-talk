import { Injectable, ElementRef } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  /**
   * Метод для настройки высоты элемента в зависимости от размеров окна.
   * @param hostElement - ссылка на элемент, для которого нужно вычислить высоту.
   * @param size - размер элемента в пикселах (по умолчанию 65).
   */
  resizeElement(hostElement: ElementRef, size = 24): void {
    const { top } = hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - size;

    hostElement.nativeElement.style.height = `${height}px`;
  }

  /**
   * Метод для подписки на событие resize с debounce.
   * @param debounceTimeMs - время задержки для debounce.
   * @returns Observable, который будет испускать события resize.
   */
  onResize(debounceTimeMs = 1000): Observable<Event> {
    return fromEvent(window, 'resize').pipe(debounceTime(debounceTimeMs));
  }
}
