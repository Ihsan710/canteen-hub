import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface FoodItem {
  _id?: string;
  name: string;
  category: string;
  image?: string;
  price: number;
  stock: number;
  availability: boolean;
  offer?: number;
  isSpecial?: boolean;
  tags?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = `${environment.apiUrl}/food`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
  }

  getAllFood(category?: string, isSpecial?: boolean): Observable<FoodItem[]> {
    let url = this.apiUrl;
    const params = [];
    if (category) params.push(`category=${category}`);
    if (isSpecial !== undefined) params.push(`isSpecial=${isSpecial}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    return this.http.get<FoodItem[]>(url);
  }

  createFood(food: FoodItem): Observable<FoodItem> {
    return this.http.post<FoodItem>(this.apiUrl, food, this.getHeaders());
  }

  updateFood(id: string, food: Partial<FoodItem>): Observable<FoodItem> {
    return this.http.put<FoodItem>(`${this.apiUrl}/${id}`, food, this.getHeaders());
  }

  deleteFood(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
