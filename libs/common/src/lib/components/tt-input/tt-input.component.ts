import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  signal
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'tt-input',
  standalone: true,
  imports: [FormsModule, SvgIconComponent],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TtInputComponent),
      multi: true
    }
  ]
})
export class TtInputComponent implements ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);

  type = input<'text' | 'password'>('text');
  placeholder = input<string>('');
  icon = input<string | null>(null);
  error = input<string | null>(null);
  isShowPassword = signal<boolean>(false);

  value: string | null = null;

  onChange = (value: string | null) => {};
  onTouched = () => {};

  writeValue(value: string | null): void {
    if (value) this.onTouched();

    this.value = value;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event): void {
    this.onChange((event.target as HTMLInputElement).value);
  }
}
