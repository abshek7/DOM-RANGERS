import { Pipe, PipeTransform } from '@angular/core';
import { Claims } from '../models/claims';

@Pipe({
  name: 'claimStatusClass',
  standalone: true,
})
export class ClaimStatusClassPipe implements PipeTransform {
  transform(status: Claims['status']): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800';

      case 'approved':
        return 'bg-green-200 text-green-800';

      case 'rejected':
        return 'bg-red-200 text-red-800';

      default:
        return 'bg-gray-200 text-gray-800';
    }
  }
}
