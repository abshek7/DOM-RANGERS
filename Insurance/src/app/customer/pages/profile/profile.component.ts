import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface Customer {
  id: string;
  customerId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  aadhar: string;
  pan: string;
  nominee: string;
  dateOfBirth: string;
  gender: string;
}

interface ProfileData {
  userId: string;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  aadhar: string;
  pan: string;
  nominee: string;
  dateOfBirth: string;
  gender: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  currentUserId: string = 'u102'; // In real app, get from auth service

  profileData: ProfileData | null = null;
  loading: boolean = true;
  editMode: boolean = false;

  // Form data for editing
  formData: ProfileData = {
    userId: '',
    customerId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    aadhar: '',
    pan: '',
    nominee: '',
    dateOfBirth: '',
    gender: ''
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.loading = true;

    // Fetch both user and customer data
    forkJoin({
      user: this.http.get<User>(`${this.apiUrl}/users/${this.currentUserId}`),
      customers: this.http.get<Customer[]>(`${this.apiUrl}/customers?userId=${this.currentUserId}`)
    }).subscribe({
      next: (result) => {
        const user = result.user;
        const customer = result.customers[0]; // Get first matching customer

        if (user && customer) {
          // Join user and customer data
          this.profileData = {
            userId: user.id,
            customerId: customer.customerId,
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            zipCode: customer.zipCode,
            aadhar: customer.aadhar,
            pan: customer.pan,
            nominee: customer.nominee,
            dateOfBirth: customer.dateOfBirth,
            gender: customer.gender
          };

          // Copy to form data
          this.formData = { ...this.profileData };
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    if (this.editMode) {
      // Cancel edit - reset form data
      this.formData = { ...this.profileData! };
    }
    this.editMode = !this.editMode;
  }

  saveProfile(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    // Update both user and customer data
    const userUpdate = {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      phone: this.formData.phone
    };

    const customerUpdate = {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      phone: this.formData.phone,
      address: this.formData.address,
      city: this.formData.city,
      state: this.formData.state,
      zipCode: this.formData.zipCode,
      aadhar: this.formData.aadhar,
      pan: this.formData.pan,
      nominee: this.formData.nominee,
      dateOfBirth: this.formData.dateOfBirth,
      gender: this.formData.gender
    };

    // Update both endpoints
    forkJoin({
      user: this.http.patch(`${this.apiUrl}/users/${this.formData.userId}`, userUpdate),
      customer: this.http.patch(`${this.apiUrl}/customers/${this.formData.customerId}`, customerUpdate)
    }).subscribe({
      next: () => {
        this.profileData = { ...this.formData };
        this.editMode = false;
        this.loading = false;
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.loading = false;
        alert('Error updating profile. Please try again.');
      }
    });
  }

  validateForm(): boolean {
    if (!this.formData.firstName || !this.formData.lastName) {
      alert('First name and last name are required');
      return false;
    }
    if (!this.formData.email || !this.formData.phone) {
      alert('Email and phone are required');
      return false;
    }
    return true;
  }

  getInitials(): string {
    if (!this.profileData) return 'C';
    return (this.profileData.firstName[0] + this.profileData.lastName[0]).toUpperCase();
  }
}
