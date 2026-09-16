import { Component, inject, OnInit } from '@angular/core';

import { TitleCasePipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UserService } from '../../core/services/user.service';
import { PostsService } from '../../core/services/posts.service';

import { ProfileUser } from './models/profile-data.interface';
import { Post } from '../../core/models/posts-data.interface';

import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';

import { PostCommentsComponent } from '../feed/components/feed-content/components/post-comments/post-comments.component';

@Component({
  selector: 'app-profile',

  imports: [
    TimeAgoPipe,
    TitleCasePipe,
    DatePipe,
    PostCommentsComponent,
    ReactiveFormsModule,
    RouterLink,
  ],

  templateUrl: './profile.component.html',

  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly userService = inject(UserService);

  private readonly postsService = inject(PostsService);

  // =================================================
  // ================= PROFILE ========================
  // =================================================

  user: ProfileUser | null = null;

  userId: string = '';

  // =================================================
  // ================= TABS ===========================
  // =================================================

  activeTab: 'posts' | 'saved' = 'posts';

  // =================================================
  // ================= POSTS ==========================
  // =================================================

  myPosts: Post[] = [];

  savedPosts: Post[] = [];

  // =================================================
  // ================= LOADING ========================
  // =================================================

  isProfileLoading: boolean = false;

  isPostsLoading: boolean = false;

  isSavedLoading: boolean = false;

  // =================================================
  // ================= EDIT POST ======================
  // =================================================

  editingPostId: string | null = null;

  editContentControl = new FormControl('', {
    nonNullable: true,
  });

  editSelectedFile: File | null = null;

  editImgUrl: string | ArrayBuffer | null = null;

  removeEditImage: boolean = false;

  // =================================================
  // ================= INIT ===========================
  // =================================================

  ngOnInit(): void {
    this.getMyProfile();
  }

  // =================================================
  // ================= GET PROFILE ====================
  // =================================================

  getMyProfile(): void {
    this.isProfileLoading = true;

    this.userService.getMyProfile().subscribe({
      next: (response) => {
        this.user = response.data.user;

        // store the current user's id
        this.userId = response.data.user._id;

        this.isProfileLoading = false;

        this.getMyPosts();
        this.getSavedPosts();
      },
    });
  }

  // =================================================
  // ================= CHANGE TAB =====================
  // =================================================

  changeTab(tab: 'posts' | 'saved'): void {
    this.activeTab = tab;

    if (tab === 'posts') {
      this.getMyPosts();
    }

    if (tab === 'saved') {
      this.getSavedPosts();
    }
  }

  // =================================================
  // ================= MY POSTS =======================
  // =================================================

  getMyPosts(): void {
    if (!this.userId) return;

    this.isPostsLoading = true;

    this.userService.getUserPosts(this.userId).subscribe({
      next: (response) => {
        this.myPosts = response.data.posts;

        console.log('MY POSTS:', this.myPosts);

        this.isPostsLoading = false;
      },
    });
  }

  // =================================================
  // ================= SAVED POSTS ====================
  // =================================================

  getSavedPosts(): void {
    this.isSavedLoading = true;

    this.userService.getBookmarks().subscribe({
      next: (response) => {
        this.savedPosts = response.data.bookmarks;

        console.log('SAVED POSTS:', this.savedPosts);

        this.isSavedLoading = false;
      },
    });
  }

  // =================================================
  // ================= DISPLAY POSTS ==================
  // =================================================

  get displayedPosts(): Post[] {
    return this.activeTab === 'posts' ? this.myPosts : this.savedPosts;
  }

  // =================================================
  // ================= DELETE POST ====================
  // =================================================

  deletePostItem(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        if (res.success) {
          // remove the post directly from the profile
          this.myPosts = this.myPosts.filter((post) => post.id !== postId);

          this.savedPosts = this.savedPosts.filter((post) => post.id !== postId);
        }
      },
    });
  }

  // =================================================
  // ================= LIKE / UNLIKE ==================
  // =================================================

  likeUnlikePost(post: Post): void {
    this.postsService.likeUnlikePost(post.id).subscribe({
      next: (res) => {
        if (res.success) {
          // update likes count
          post.likesCount = res.data.likesCount;

          // ================= LIKE =================

          if (res.data.liked) {
            if (!post.likes.includes(this.userId)) {
              post.likes.push(this.userId);
            }
          }

          // ================= UNLIKE =================
          else {
            post.likes = post.likes.filter((id) => id !== this.userId);
          }
        }
      },
    });
  }

  // =================================================
  // ============== BOOKMARK / UNBOOKMARK ============
  // =================================================

  bookmarkUnbookmarkPost(post: Post): void {
    const wasBookmarked = post.bookmarked;

    this.postsService.bookmarkUnbookmarkPost(post.id).subscribe({
      next: (res) => {
        if (res.success) {
          // update current post
          post.bookmarked = res.data.bookmarked;
          post.bookmarksCount = res.data.bookmarksCount;

          // =========================================
          // SAVE
          // =========================================

          if (res.data.bookmarked) {
            const alreadyExists = this.savedPosts.some((savedPost) => savedPost.id === post.id);

            if (!alreadyExists) {
              this.savedPosts.unshift(post);
            }
          }

          // =========================================
          // UNSAVE
          // =========================================
          else {
            this.savedPosts = this.savedPosts.filter((savedPost) => savedPost.id !== post.id);
          }

          // =========================================
          // UPDATE SAME POST INSIDE MY POSTS
          // =========================================

          const myPost = this.myPosts.find((myPost) => myPost.id === post.id);

          if (myPost) {
            myPost.bookmarked = res.data.bookmarked;
            myPost.bookmarksCount = res.data.bookmarksCount;
          }

          // =========================================
          // UPDATE PROFILE BOOKMARKS COUNT
          // =========================================

          if (this.user && wasBookmarked !== res.data.bookmarked) {
            if (res.data.bookmarked) {
              this.user.bookmarksCount = (this.user.bookmarksCount ?? 0) + 1;
            } else {
              this.user.bookmarksCount = Math.max((this.user.bookmarksCount ?? 0) - 1, 0);
            }
          }
        }
      },
    });
  }

  // =================================================
  // ================= START EDIT POST ================
  // =================================================

  startEditPost(post: Post): void {
    this.editingPostId = post.id;

    this.editContentControl.setValue(post.body ?? '');

    // current image
    this.editImgUrl = post.image ?? null;

    this.editSelectedFile = null;

    this.removeEditImage = false;
  }

  // =================================================
  // ================= UPDATE POST ====================
  // =================================================

  updatePostItem(postId: string): void {
    const formData = new FormData();

    formData.append('body', this.editContentControl.value);

    // if a new image is selected
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

          //
          this.getMyPosts();
        }
      },
    });
  }

  // =================================================
  // ================= CANCEL EDIT ====================
  // =================================================

  cancelEditPost(): void {
    this.editingPostId = null;

    this.editContentControl.reset();

    this.editSelectedFile = null;

    this.editImgUrl = null;

    this.removeEditImage = false;
  }

  // =================================================
  // ================= CHANGE EDIT IMAGE ==============
  // =================================================

  changeEditFile(e: Event): void {
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.editSelectedFile = input.files[0];

      this.removeEditImage = false;

      const fileReader = new FileReader();

      fileReader.readAsDataURL(this.editSelectedFile);

      fileReader.addEventListener('load', () => {
        this.editImgUrl = fileReader.result;
      });
    }
  }

  // =================================================
  // ================= REMOVE EDIT IMAGE ==============
  // =================================================

  removeEditFile(): void {
    this.editSelectedFile = null;

    this.editImgUrl = this.myPosts.find((post) => post.id === this.editingPostId)?.image ?? null;
  }
}
