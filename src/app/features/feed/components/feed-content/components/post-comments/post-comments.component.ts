import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CommentsService } from './services/comments.service';
import { Comment } from './models/comments-data.interface';
import { Reply } from './models/comment-replies.interface';
import { TimeAgoPipe } from '../../../../../../shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-post-comments',
  imports: [TimeAgoPipe, FormsModule],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
})
export class PostCommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);

  private readonly cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) postId: string = '';

  commentList: Comment[] = [];

  // ================= CURRENT USER =================

  userId: string = '';

  // ================= CREATE COMMENT =================

  commentContent: string = '';

  selectedImage: File | null = null;

  imagePreview: string | ArrayBuffer | null = null;

  // ================= COMMENT MENU =================

  openMenuCommentId: string | null = null;

  // ================= EDIT COMMENT =================

  editingCommentId: string | null = null;

  editCommentContent: string = '';

  // ================= REPLIES =================

  openReplyCommentId: string | null = null;

  replyContent: Record<string, string> = {};

  repliesMap: Record<string, Reply[]> = {};

  ngOnInit(): void {
    this.getUserData();

    this.getPostCommentsData();
  }

  // ================= USER DATA =================

  getUserData(): void {
    const userData = localStorage.getItem('userData');

    if (userData) {
      const user = JSON.parse(userData);

      this.userId = user._id;
    }
  }

  // CHECK IF COMMENT BELONGS TO CURRENT USER
  isMyComment(item: Comment | Reply): boolean {
    return item.commentCreator._id === this.userId;
  }

  // ================= GET COMMENTS =================

  getPostCommentsData(): void {
    this.commentsService.getPostComments(this.postId).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentList = res.data.comments;
        }
      },
    });
  }

  // ================= CREATE COMMENT =================

  createComment(fileInput: HTMLInputElement): void {
    if (!this.commentContent.trim() && !this.selectedImage) {
      return;
    }

    const formData = new FormData();

    formData.append('content', this.commentContent.trim());

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.commentsService.createComment(this.postId, formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.resetComment(fileInput);

          this.getPostCommentsData();
        }
      },
    });
  }

  // ================= SELECT IMAGE =================

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.selectedImage = input.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(this.selectedImage);

    reader.onload = () => {
      this.imagePreview = reader.result;

      this.cdr.detectChanges();
    };
  }

  // ================= REMOVE IMAGE =================

  removeImage(fileInput: HTMLInputElement): void {
    this.selectedImage = null;

    this.imagePreview = null;

    fileInput.value = '';

    this.cdr.detectChanges();
  }

  // ================= RESET CREATE COMMENT =================

  private resetComment(fileInput: HTMLInputElement): void {
    this.commentContent = '';

    this.selectedImage = null;

    this.imagePreview = null;

    fileInput.value = '';

    this.cdr.detectChanges();
  }

  // ==================================================
  // COMMENT MENU
  // ==================================================

  toggleCommentMenu(commentId: string): void {
    if (this.openMenuCommentId === commentId) {
      this.openMenuCommentId = null;
    } else {
      this.openMenuCommentId = commentId;
    }
  }

  // ==================================================
  // EDIT COMMENT
  // ==================================================

  startEditComment(item: Comment | Reply): void {
    this.editingCommentId = item._id;

    this.editCommentContent = item.content;

    this.openMenuCommentId = null;
  }

  cancelEditComment(): void {
    this.editingCommentId = null;

    this.editCommentContent = '';
  }

  updateComment(commentId: string): void {
    if (!this.editCommentContent.trim()) {
      return;
    }

    const data = {
      content: this.editCommentContent.trim(),
    };

    this.commentsService.updateComment(this.postId, commentId, data).subscribe({
      next: (res) => {
        if (res.success) {
          this.editingCommentId = null;

          this.editCommentContent = '';

          this.getPostCommentsData();
        }
      },
    });
  }

  // ==================================================
  // DELETE COMMENT
  // ==================================================

  deleteComment(commentId: string): void {
    this.commentsService.deleteComment(this.postId, commentId).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentList = this.commentList.filter((comment) => comment._id !== commentId);

          this.openMenuCommentId = null;
        }
      },
    });
  }

  // ==================================================
  // LIKE/UNLIKE COMMENT
  // ==================================================

  isCommentLiked(item: Comment | Reply): boolean {
    return item.likes.includes(this.userId);
  }

  likeUnlikeComment(item: Comment | Reply): void {
    const isLiked = this.isCommentLiked(item);

    this.commentsService.likeUnlikeComment(this.postId, item._id).subscribe({
      next: (res) => {
        if (res.success) {
          if (isLiked) {
            item.likes = item.likes.filter((id) => id !== this.userId);
          } else {
            item.likes.push(this.userId);
          }
        }
      },
    });
  }

  // ==================================================
  // REPLIES
  // ==================================================
  toggleReply(comment: Comment): void {
    if (this.openReplyCommentId === comment._id) {
      this.openReplyCommentId = null;
      return;
    }

    this.openReplyCommentId = comment._id;

    this.getCommentReplies(comment._id);
  }

  getCommentReplies(commentId: string): void {
    this.commentsService.getCommentReplies(this.postId, commentId).subscribe({
      next: (res) => {
        console.log('REPLIES RESPONSE:', res);

        if (res.success) {
          this.repliesMap[commentId] = res.data.replies;
        }
      },
    });
  }

  createReply(comment: Comment): void {
    const content = this.replyContent[comment._id]?.trim();

    if (!content) {
      return;
    }

    const formData = new FormData();

    formData.append('content', content);

    this.commentsService.createReply(this.postId, comment._id, formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.replyContent[comment._id] = '';

          comment.repliesCount++;

          this.getCommentReplies(comment._id);
        }
      },
    });
  }

  // ==================================================
  // UPDATE REPLY
  // ==================================================

  updateReply(parentCommentId: string, replyId: string): void {
    if (!this.editCommentContent.trim()) {
      return;
    }

    const data = {
      content: this.editCommentContent.trim(),
    };

    this.commentsService.updateComment(this.postId, replyId, data).subscribe({
      next: (res) => {
        if (res.success) {
          this.editingCommentId = null;
          this.editCommentContent = '';

          // Reload replies for this comment only
          this.getCommentReplies(parentCommentId);
        }
      },
    });
  }

  deleteReply(parentComment: Comment, replyId: string): void {
    this.commentsService.deleteComment(this.postId, replyId).subscribe({
      next: (res) => {
        if (res.success) {
          // Remove reply from UI
          this.repliesMap[parentComment._id] = (this.repliesMap[parentComment._id] || []).filter(
            (reply) => reply._id !== replyId,
          );

          // Update replies count
          if (parentComment.repliesCount > 0) {
            parentComment.repliesCount--;
          }

          this.openMenuCommentId = null;
        }
      },
    });
  }
}
