import { Component, inject, Input, OnInit } from '@angular/core';
import { CommentsService } from './services/comments.service';
import { Comment } from './models/comments-data.interface';

@Component({
  selector: 'app-post-comments',
  imports: [],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
})
export class PostCommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);

  @Input({ required: true }) postId: string = '';

  commentList: Comment[] = [];

  ngOnInit(): void {
    this.getPostCommentsData();
  }

  getPostCommentsData(): void {
    this.commentsService.getPostComments(this.postId).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentList = res.data.comments;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
