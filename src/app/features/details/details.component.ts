import { Component, inject } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from './models/post-details-data.interface';
import { PostCommentsComponent } from '../feed/components/feed-content/components/post-comments/post-comments.component';
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-details',
  imports: [RouterLink, PostCommentsComponent, TimeAgoPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly router = inject(Router);

  postId: string = '';

  postData: Post = {} as Post;

  userId: string = '';

  ngOnInit(): void {
    this.getUserData();
    this.getPostId();
  }

  getUserData(): void {
    if (localStorage.getItem('userData')) {
      this.userId = JSON.parse(localStorage.getItem('userData')!)?._id;
    }
  }

  getPostId(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.postId = param.get('id')!;
      this.getSinglePostData();
    });
  }

  getSinglePostData(): void {
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        if (res.success) {
          this.postData = res.data.post;
        }
      },
    });
  }

  deletePostItem(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/feed']);
        }
      },
    });
  }

  likeUnlikePost(): void {
    this.postsService.likeUnlikePost(this.postData.id).subscribe({
      next: (res) => {
        if (res.success) {
          // update likes count
          this.postData.likesCount = res.data.likesCount;

          // LIKE
          if (res.data.liked) {
            if (!this.postData.likes.includes(this.userId)) {
              this.postData.likes.push(this.userId);
            }
          }

          // UNLIKE
          else {
            this.postData.likes = this.postData.likes.filter((id) => id !== this.userId);
          }
        }
      },
    });
  }
}
