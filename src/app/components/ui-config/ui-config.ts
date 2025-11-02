import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService, UserDto, UserPutDto } from '../../services/user.service';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

type Gender = 'MALE' | 'FEMALE' | 'NO_BINARY' | 'OTHER';

@Component({
  selector: 'app-ui-config',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ImageCropperComponent
  ],
  templateUrl: './ui-config.html',
  styleUrl: './ui-config.css',
})
export class UiConfig implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  user: UserDto = {
    name: '',
    surname: '',
    email: '',
    gender: 'OTHER',
    dob: '',
    city: '',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZJXYbCFVdGrWmuNikFBCcBh_cG9IRWbM5hWiMe_NWlooM_sPfVogA_ugHJucELuFK933OJ_M1_5K7Bsq5RnrP1c8x5jwi3J9Bcm1su9WX10-Jy75O5uGkoFNudHvqA1X2sVKtmLbgfUAyPPtfPhxu7YG-w3_lI_1M5nuGsn6sKvvIsx6rmbDiW01iVkGlDhe9ccmeJGm1xJmI3xxW2M7x5q7nRoTAklWNWc2zF9SoJsxe3ZN8hzsBEI0RWc-1lgfKjhgTqY4ujjA'
  };

  profileImageUrl: string | ArrayBuffer | null = null;

  showPasswordModal = false;
  passwordData = {
    newPassword: '',
    confirmPassword: ''
  };

  newPasswordType: string = 'password';
  confirmPasswordType: string = 'password';

  allCities: any[] = [];
  citySuggestions: any[] = [];
  showCitySuggestions = false;

  showImageCropperModal = false;
  croppedImage: any = '';


  imageBase64: string | undefined;
  originalFile: File | null = null;

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: (data) => {
        this.user = data;
        const avatar = data.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBZJXYbCFVdGrWmuNikFBCcBh_cG9IRWbM5hWiMe_NWlooM_sPfVogA_ugHJucELuFK933OJ_M1_5K7Bsq5RnrP1c8x5jwi3J9Bcm1su9WX10-Jy75O5uGkoFNudHvqA1X2sVKtmLbgfUAyPPtfPhxu7YG-w3_lI_1M5nuGsn6sKvvIsx6rmbDiW01iVkGlDhe9ccmeJGm1xJmI3xxW2M7x5q7nRoTAklWNWc2zF9SoJsxe3ZN8hzsBEI0RWc-1lgfKjhgTqY4ujjA";
        this.user.avatarUrl = avatar;
        this.profileImageUrl = avatar;
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
      }
    });

    this.http.get<any[]>('assets/cities5000.json').subscribe({
      next: (data) => {
        this.allCities = data.map(city => ({ name: city.name, country: city.country }));
      },
      error: (err) => {
        console.error('Failed to load cities5000.json:', err);
      }
    });
  }

  saveChanges(): void {
    const dto: UserPutDto = {
      name: this.user.name,
      surname: this.user.surname,
      city: this.user.city,
      gender: this.user.gender as Gender
    };

    this.userService.updateUserInfo(dto).subscribe({
      next: (res) => {
        console.log('Profile updated successfully!', res);
        alert('Profile saved successfully!');
      },
      error: (err) => {
        console.error('Failed to update profile:', err);
        alert(`Error: ${err.error.message || 'Failed to update profile.'}`);
      }
    });
  }

  openPasswordModal(): void {
    this.passwordData = { newPassword: '', confirmPassword: '' };
    this.newPasswordType = 'password';
    this.confirmPasswordType = 'password';
    this.showPasswordModal = true;
  }
  closePasswordModal(): void { this.showPasswordModal = false; }
  submitNewPassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('Passwords do not match.'); return;
    }
    if (this.passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long.'); return;
    }
    const dto: UserPutDto = { password: this.passwordData.newPassword };
    this.userService.updateUserInfo(dto).subscribe({
      next: (res) => {
        alert('Password changed successfully!'); this.closePasswordModal();
      },
      error: (err) => {
        console.error('Failed to change password:', err);
        alert(`Error: ${err.error.message || 'Failed to change password.'}`);
      }
    });
  }
  toggleNewPasswordVisibility(): void { this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password'; }
  toggleConfirmPasswordVisibility(): void { this.confirmPasswordType = this.confirmPasswordType === 'password' ? 'text' : 'password'; }

  onAvatarClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.originalFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageBase64 = e.target.result;
        this.croppedImage = e.target.result;
        this.showImageCropperModal = true;
      };
      reader.readAsDataURL(this.originalFile);
    }
    input.value = '';
  }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.base64) {
      this.croppedImage = event.base64;
    }
  }



  onCityInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.user.city = value;
    const
      valueLower = value.toLowerCase();

    if (valueLower.length < 2) {
      this.citySuggestions = [];
      this.showCitySuggestions = false;
      return;
    }

    this.citySuggestions = this.allCities
      .filter(city => city.name.toLowerCase().startsWith(valueLower))
      .slice(0, 10);

    this.showCitySuggestions = this.citySuggestions.length > 0;
  }


  selectCity(city: any): void {
    this.user.city = `${city.name}, ${city.country}`;
    this.citySuggestions = [];
    this.showCitySuggestions = false;
  }


  hideCitySuggestions(): void {
    setTimeout(() => {
      this.showCitySuggestions = false;
    }, 200);
  }

  saveCroppedImage(): void {
    if (!this.croppedImage || !this.originalFile) return;

    const file = this.base64ToFile(this.croppedImage, 'avatar.png');

    this.userService.uploadProfilePicture(file).subscribe({
      next: (res) => {
        this.user.avatarUrl = res.avatarUrl;
        this.profileImageUrl = res.avatarUrl;
        alert('Profile picture updated!');
        this.closeCropperModal();
      },
      error: (err) => {
        console.error('Failed to upload image:', err);
        alert('Failed to upload image. ' + (err.error?.message || ''));
      }
    });
  }

  closeCropperModal(): void {
    this.showImageCropperModal = false;
    this.imageBase64 = undefined;
    this.originalFile = null;
    this.croppedImage = '';
  }

  imageLoaded(): void {
  }

  cropperReady(): void {
  }

  loadImageFailed(): void {
    alert('Failed to load image for cropping.');
    this.closeCropperModal();
  }

  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid base64 string');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }
}
