import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    // get the current time and the time of the post / getTime() --> in milliseconds
    const now = new Date().getTime();
    // get the time of the post in milliseconds / getTime() --> convert the date to a timestamp milliseconds
    const postTime = new Date(value).getTime();

    // we divide the difference by 1000 because "getTime()" returns milliseconds and we want to get the difference in seconds
    const seconds = Math.floor((now - postTime) / 1000);

    if (seconds < 60) {
      return 'Just now';
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d`;
    }

    return new Date(value).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}
