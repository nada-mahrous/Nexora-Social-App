import { UserData, UserInfo } from './../../../../core/models/user-data.interface';
import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';
import { Post } from '../../../../core/models/posts-data.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostCommentsComponent } from './components/post-comments/post-comments.component';

@Component({
  selector: 'app-feed-content',
  imports: [ReactiveFormsModule, PostCommentsComponent],
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  postsList: Post[] = [];

  userId: string = '';

  // 1) selected file
  selectedFile!: File;

  imgUrl: string | ArrayBuffer | null | undefined;

  // 2) contentControl
  contentControl = new FormControl('');

  // 2) contentControl
  privacyControl = new FormControl('public');

  userData: UserInfo = {} as UserInfo;

  ngOnInit(): void {
    this.getAllPostsData();
    this.getUserData();
  }

  getAllPostsData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        if (res.success) {
          this.postsList = res.data.posts;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUserData(): void {
    if (localStorage.getItem('userData')) {
      this.userData = JSON.parse(localStorage.getItem('userData')!);
      this.userId = JSON.parse(localStorage.getItem('userData')!)?._id;
    }
  }

  changeFile(e: Event): void {
    const input = e.target as HTMLInputElement;

    if (input.files) {
      this.selectedFile = input.files[0];
    }
    this.previewImg();
  }

  previewImg(): void {
    // preview to img
    // file reader
    const fileReader = new FileReader();

    fileReader.readAsDataURL(this.selectedFile);

    fileReader.addEventListener('load', (e) => {
      this.imgUrl = e.target?.result;
    });
  }

  removeFile(): void {
    this.imgUrl = '';
  }

  submitForm(e: SubmitEvent, formElement: HTMLFormElement): void {
    e.preventDefault();

    // create form data
    const formData = new FormData();

    if (this.contentControl.value) {
      formData.append('body', this.contentControl.value);
    }

    if (this.privacyControl.value) {
      formData.append('privacy', this.privacyControl.value);
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // call api
    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.getAllPostsData();

          // reset post
          formElement.reset();
          this.imgUrl = '';
        }
      },
      error: (err) => {
        console.log('Full error:', err);
      },
    });
  }

  deletePostItem(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        this.getAllPostsData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
