import { Bookmark, Heart, MessageCircle, Pencil, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Avatar, Badge, Card, CardContent, CardHeader } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { CommunityPost, PostComment } from '@/mocks/community';

export interface PostCardProps {
  post: CommunityPost;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onAddComment: (content: string) => void;
  onAddReply: (commentId: string, content: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function CommentRow({
  comment,
  depth = 0,
  onReply,
}: {
  comment: PostComment;
  depth?: number;
  onReply: (commentId: string, content: string) => void;
}) {
  const { t } = useTranslation();
  const [isReplying, setIsReplying] = useState(false);
  const [replyDraft, setReplyDraft] = useState('');

  function handleReplySubmit(event: React.FormEvent) {
    event.preventDefault();
    const content = replyDraft.trim();
    if (!content) return;
    onReply(comment.id, content);
    setReplyDraft('');
    setIsReplying(false);
  }

  return (
    <div className={cn('flex flex-col gap-2', depth > 0 && 'ml-8')}>
      <div className="flex gap-2">
        <Avatar name={comment.author} size="sm" />
        <div className="flex-1">
          <div className="rounded-lg bg-secondary/40 px-3 py-2">
            <p className="text-xs font-semibold text-foreground">{comment.author}</p>
            <p className="text-sm text-foreground">{comment.content}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsReplying((open) => !open)}
            className="mt-1 px-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {t('community.post.reply')}
          </button>
        </div>
      </div>

      {isReplying && (
        <form onSubmit={handleReplySubmit} className="ml-10 flex items-center gap-2">
          <input
            value={replyDraft}
            onChange={(event) => setReplyDraft(event.target.value)}
            placeholder={t('community.post.replyPlaceholder')}
            autoFocus
            className="h-8 flex-1 rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <button
            type="submit"
            disabled={replyDraft.trim().length === 0}
            aria-label={t('community.post.sendReply')}
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-primary transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
          >
            <Send className="size-3.5" />
          </button>
        </form>
      )}

      {comment.replies?.map((reply) => (
        <CommentRow key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
      ))}
    </div>
  );
}

export function PostCard({
  post,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onAddReply,
  onEdit,
  onDelete,
}: PostCardProps) {
  const { t } = useTranslation();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');

  function handleAddComment(event: React.FormEvent) {
    event.preventDefault();
    const content = commentDraft.trim();
    if (!content) return;
    onAddComment(content);
    setCommentDraft('');
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <Avatar name={post.author} size="md" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{post.author}</p>
          <p className="text-xs text-muted-foreground">{post.createdAt}</p>
        </div>
        {post.bookTitle && <Badge variant="outline">{post.bookTitle}</Badge>}
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={t('community.post.editAria')}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Pencil className="size-4" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={t('community.post.deleteAria')}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="whitespace-pre-wrap text-sm text-foreground">{post.content}</p>

        {post.images && post.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt=""
                className="size-24 rounded-md border border-border object-cover"
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 border-t border-border pt-2">
          <button
            type="button"
            onClick={onToggleLike}
            aria-pressed={post.isLiked}
            aria-label={t(post.isLiked ? 'community.post.unlikeAria' : 'community.post.likeAria')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-secondary',
              post.isLiked ? 'text-danger' : 'text-muted-foreground',
            )}
          >
            <Heart className={cn('size-4', post.isLiked && 'fill-danger')} />
            {post.likeCount}
          </button>

          <button
            type="button"
            onClick={() => setIsCommentsOpen((open) => !open)}
            aria-expanded={isCommentsOpen}
            aria-label={t('community.post.commentAria')}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
          >
            <MessageCircle className="size-4" />
            {post.comments.length}
          </button>

          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={post.isSaved}
            aria-label={t(post.isSaved ? 'community.post.unsaveAria' : 'community.post.saveAria')}
            className={cn(
              'ml-auto flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-secondary',
              post.isSaved ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <Bookmark className={cn('size-4', post.isSaved && 'fill-primary')} />
          </button>
        </div>

        {isCommentsOpen && (
          <div className="flex flex-col gap-3 border-t border-border pt-3">
            {post.comments.map((comment) => (
              <CommentRow key={comment.id} comment={comment} onReply={onAddReply} />
            ))}

            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                value={commentDraft}
                onChange={(event) => setCommentDraft(event.target.value)}
                placeholder={t('community.post.commentPlaceholder')}
                className="h-9 flex-1 rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <button
                type="submit"
                disabled={commentDraft.trim().length === 0}
                aria-label={t('community.post.sendComment')}
                className="flex size-9 shrink-0 items-center justify-center rounded-md text-primary transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
