import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener
} from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-stack-input',
  standalone: true,
  imports: [SvgIconComponent, FormsModule, AsyncPipe],
  templateUrl: './stack-input.component.html',
  styleUrl: './stack-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: StackInputComponent
    }
  ]
})
export class StackInputComponent implements ControlValueAccessor {
  value$ = new BehaviorSubject<string[]>([]);
  #disabled = false;
  innerInput = '';

  @HostBinding('class.disabled')
  get disabled() {
    return this.#disabled;
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.innerInput.trim()) return;

    this.value$.next([...this.value$.value, this.innerInput]);
    this.innerInput = '';

    this.onChange(this.value$.value);
  }

  writeValue(stack: string[] | null): void {
    this.value$.next(stack ?? []);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.#disabled = isDisabled;
  }

  onChange(value: string[] | null) {}

  onTouched() {}

  onTagDelete(index: number) {
    const tags = this.value$.value;
    tags.splice(index, 1);
    this.value$.next(tags);

    this.onChange(this.value$.value);
  }
}
