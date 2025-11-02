import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDto {
  name: string;
  surname: string;
  email: string;
  gender: 'MALE' | 'FEMALE' | 'NO_BINARY' | 'OTHER' ;
  dob: string; // (yyyy-MM-dd)
  city: string;
  avatarUrl: string;
}

export interface UserPutDto {
  name?: string;
  surname?: string;
  password?: string;
  gender?: 'MALE' | 'FEMALE' | 'NO_BINARY' | 'OTHER' ;
  city?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/userinformation`);
  }

  updateUserInfo(dto: UserPutDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, dto);
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profileImage', file, file.name);

    return this.http.post(`${this.apiUrl}/upload-avatar`, formData);
  }


}
