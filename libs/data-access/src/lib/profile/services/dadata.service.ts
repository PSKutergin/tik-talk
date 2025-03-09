import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments';
import { map } from 'rxjs';
import { DadataSuggestion } from '..';

@Injectable({
  providedIn: 'root'
})
export class DadataService {
  private http = inject(HttpClient);

  getSuggestion(query: string) {
    return this.http
      .post<{ suggestions: DadataSuggestion[] }>(
        environment.apiDadata,
        { query },
        {
          headers: {
            Authorization: `Token ${environment.dadataToken}`
          }
        }
      )
      .pipe(
        map((res) => {
          return res.suggestions.filter((suggestion) => suggestion.data.city);
          // return Array.from(
          //   new Set(
          //     res.suggestions
          //       .filter((suggestion) => suggestion.data.city)
          //       .map((suggestion) => suggestion.data.city)
          //   )
          // );
        })
      );
  }
}
