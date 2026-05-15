import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Complaint {
  _id?: string;
  userId?: any;
  subject: string;
  message: string;
  status?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = `${environment.apiUrl}/complaints`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    };
  }

  submitComplaint(data: { subject: string, message: string }): Observable<Complaint> {
    return this.http.post<Complaint>(this.apiUrl, data, this.getHeaders());
  }

  getAllComplaints(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl, this.getHeaders());
  }

  updateComplaintStatus(id: string, status: string): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.apiUrl}/${id}`, { status }, this.getHeaders());
  }
}
