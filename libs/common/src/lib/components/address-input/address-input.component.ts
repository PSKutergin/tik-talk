import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  signal
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { TtInputComponent } from '../tt-input/tt-input.component';
import { DadataService, DadataSuggestion } from '@tt/data-access';
import { debounceTime, switchMap, tap } from 'rxjs';
import { AddressFormatPipe } from '../../pipes';

@Component({
  selector: 'tt-address-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TtInputComponent,
    AddressFormatPipe
  ],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true
    }
  ]
})
export class AddressInputComponent implements ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);
  private dadataService = inject(DadataService);
  private addressFormatPipe = inject(AddressFormatPipe);

  innerSearchControl = new FormControl();
  isDropdownOpen = signal<boolean>(true);

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    house: new FormControl(''),
    flat: new FormControl('')
  });

  suggestions$ = this.innerSearchControl.valueChanges.pipe(
    debounceTime(500),
    switchMap((value) =>
      this.dadataService
        .getSuggestion(value)
        .pipe(tap((res) => this.isDropdownOpen.set(!!res.length)))
    )
  );

  onChange = (value: string | null) => {};
  onTouched = () => {};

  writeValue(value: string | null): void {
    this.innerSearchControl.setValue(value, { emitEvent: false });

    if (!value) {
      this.isDropdownOpen.set(false);
      this.addressForm.reset();
      return;
    }

    const address = value.split(', ');
    this.addressForm.patchValue({
      city: address[0] || '',
      street: address[1] || '',
      house: address[2] || '',
      flat: address[3] || ''
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  selectSuggestion(suggestion: DadataSuggestion): void {
    const address = this.formatAddress(suggestion);

    this.onChange(address);
    this.innerSearchControl.setValue(address, { emitEvent: false });

    this.isDropdownOpen.set(false);
    this.addressForm.patchValue({
      city: suggestion.data.city,
      street: suggestion.data.street,
      house: suggestion.data.house,
      flat: suggestion.data.flat
    });

    this.cdr.markForCheck();
  }

  formatAddress(suggestion: DadataSuggestion): string {
    return this.addressFormatPipe.transform(suggestion.data);
  }
}
