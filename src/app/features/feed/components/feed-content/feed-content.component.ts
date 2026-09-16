import { UserData, UserInfo } from './../../../../core/models/user-data.interface';
import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';
import { Post } from '../../../../core/models/posts-data.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostCommentsComponent } from './components/post-comments/post-comments.component';
import { RouterLink } from '@angular/router';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-feed-content',
  imports: [ReactiveFormsModule, PostCommentsComponent, RouterLink, TimeAgoPipe],
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

  editingPostId: string | null = null;

  editContentControl = new FormControl('', {
    nonNullable: true,
  });

  editSelectedFile: File | null = null;

  editImgUrl: string | ArrayBuffer | null = null;

  removeEditImage: boolean = false;

  // originalEditImage: string | null = null;

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
    });
  }

  deletePostItem(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        if (res.success) {
          this.getAllPostsData();
        }
      },
    });
  }

  likeUnlikePost(post: Post): void {
    this.postsService.likeUnlikePost(post.id).subscribe({
      next: (res) => {
        if (res.success) {
          // update likes count
          post.likesCount = res.data.likesCount;

          // Like
          if (res.data.liked) {
            if (!post.likes.includes(this.userId)) {
              post.likes.push(this.userId);
            }
          }

          // Unlike
          else {
            post.likes = post.likes.filter((id) => id !== this.userId);
          }
        }
      },
    });
  }

  startEditPost(post: Post): void {
    this.editingPostId = post.id;

    this.editContentControl.setValue(post.body ?? '');

    // show current image
    this.editImgUrl = post.image ?? null;

    this.editSelectedFile = null;

    this.removeEditImage = false;
  }

  updatePostItem(postId: string): void {
    const formData = new FormData();

    formData.append('body', this.editContentControl.value);

    // لو المستخدم اختار صورة جديدة فقط
    if (this.editSelectedFile) {
      formData.append('image', this.editSelectedFile);
    }

    this.postsService.updatePost(postId, formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.editingPostId = null;

          this.editContentControl.reset();

          this.editSelectedFile = null;
          this.editImgUrl = null;
          this.removeEditImage = false;

          this.getAllPostsData();
        }
      },
    });
  }

  cancelEditPost(): void {
    this.editingPostId = null;

    this.editContentControl.reset();

    this.editSelectedFile = null;

    this.editImgUrl = null;

    // this.originalEditImage = null;
  }

  changeEditFile(e: Event): void {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.editSelectedFile = input.files[0];

      // user selected another image
      this.removeEditImage = false;

      const fileReader = new FileReader();

      fileReader.readAsDataURL(this.editSelectedFile);

      fileReader.addEventListener('load', () => {
        this.editImgUrl = fileReader.result;
      });
    }
  }

  removeEditFile(): void {
    this.editSelectedFile = null;

    this.editImgUrl = this.postsList.find((post) => post.id === this.editingPostId)?.image ?? null;
  }

  // Bookmark or unbookmark a post

  bookmarkUnbookmarkPost(post: Post): void {
    this.postsService.bookmarkUnbookmarkPost(post.id).subscribe({
      next: (res) => {
        if (res.success) {
          post.bookmarked = res.data.bookmarked;
          post.bookmarksCount = res.data.bookmarksCount;
        }
      },
    });
  }
}
