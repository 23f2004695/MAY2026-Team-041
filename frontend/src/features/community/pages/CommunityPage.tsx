import { Bookmark, Flag, MessageCircle, Plus, UserX, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { StatisticCard, PageTitle } from '@/components/common';
import { Button, Dialog, EmptyState } from '@/components/ui';
import { communityPosts, type CommunityPost, type PostComment } from '@/mocks/community';
import { useAuth } from '@/providers/AuthProvider';

import { CreatePostModal, type PostDraft } from '../components/CreatePostModal';
import { PostCard } from '../components/PostCard';

type Filter = 'all' | 'saved' | 'reported';

function addReplyToComments(
  comments: PostComment[],
  commentId: string,
  reply: PostComment,
): PostComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, replies: [...(comment.replies ?? []), reply] };
    }
    if (comment.replies) {
      return { ...comment, replies: addReplyToComments(comment.replies, commentId, reply) };
    }
    return comment;
  });
}

function removeCommentById(comments: PostComment[], commentId: string): PostComment[] {
  return comments
    .filter((comment) => comment.id !== commentId)
    .map((comment) =>
      comment.replies
        ? { ...comment, replies: removeCommentById(comment.replies, commentId) }
        : comment,
    );
}

function reportCommentById(comments: PostComment[], commentId: string): PostComment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, reported: true };
    }
    if (comment.replies) {
      return { ...comment, replies: reportCommentById(comment.replies, commentId) };
    }
    return comment;
  });
}

function countComments(comments: PostComment[]): number {
  return comments.reduce((count, comment) => count + 1 + countComments(comment.replies ?? []), 0);
}

function hasReportedComment(comments: PostComment[]): boolean {
  return comments.some((comment) => comment.reported || hasReportedComment(comment.replies ?? []));
}

function countReported(comments: PostComment[]): number {
  return comments.reduce(
    (count, comment) => count + (comment.reported ? 1 : 0) + countReported(comment.replies ?? []),
    0,
  );
}

export function CommunityPage() {
  const { t } = useTranslation();
  const { role } = useAuth();
  const isStaff = role === 'admin' || role === 'manager' || role === 'it-head';
  const canModerate = role === 'admin' || role === 'it-head';
  const canReport = role === 'member' || role === 'manager';
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [filter, setFilter] = useState<Filter>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [bannedAuthors, setBannedAuthors] = useState<string[]>([]);
  const [banningAuthor, setBanningAuthor] = useState<string | null>(null);

  const visiblePosts = useMemo(() => {
    if (filter === 'saved') return posts.filter((post) => post.isSaved);
    if (filter === 'reported')
      return posts.filter((post) => post.reported || hasReportedComment(post.comments));
    return posts;
  }, [posts, filter]);
  const deletingPost = posts.find((post) => post.id === deletingPostId) ?? null;

  const totalComments = useMemo(
    () => posts.reduce((sum, post) => sum + countComments(post.comments), 0),
    [posts],
  );
  const reportedCount = useMemo(
    () => posts.reduce((sum, post) => sum + countReported(post.comments), 0),
    [posts],
  );

  function handleSubmitPost(draft: PostDraft) {
    if (editingPost) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingPost.id
            ? {
                ...post,
                bookTitle: draft.bookTitle || undefined,
                content: draft.content,
                images: draft.images,
              }
            : post,
        ),
      );
      setEditingPost(null);
      return;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: t('community.you'),
      bookTitle: draft.bookTitle || undefined,
      content: draft.content,
      images: draft.images,
      createdAt: t('community.justNow'),
      likeCount: 0,
      isLiked: false,
      isSaved: false,
      isOwn: true,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    setIsCreateOpen(false);
  }

  function closePostModal() {
    setIsCreateOpen(false);
    setEditingPost(null);
  }

  function confirmDeletePost() {
    if (!deletingPost) return;
    setPosts((prev) => prev.filter((post) => post.id !== deletingPost.id));
    setDeletingPostId(null);
  }

  function confirmBanAuthor() {
    if (!banningAuthor) return;
    setBannedAuthors((prev) => (prev.includes(banningAuthor) ? prev : [...prev, banningAuthor]));
    setBanningAuthor(null);
  }

  function unbanAuthor(author: string) {
    setBannedAuthors((prev) => prev.filter((name) => name !== author));
  }

  function toggleLike(postId: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likeCount: post.likeCount + (post.isLiked ? -1 : 1) }
          : post,
      ),
    );
  }

  function toggleSave(postId: string) {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, isSaved: !post.isSaved } : post)),
    );
  }

  function addComment(postId: string, content: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `comment-${Date.now()}`,
                  author: t('community.you'),
                  content,
                  createdAt: t('community.justNow'),
                },
              ],
            }
          : post,
      ),
    );
  }

  function addReply(postId: string, commentId: string, content: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: addReplyToComments(post.comments, commentId, {
                id: `reply-${Date.now()}`,
                author: t('community.you'),
                content,
                createdAt: t('community.justNow'),
              }),
            }
          : post,
      ),
    );
  }

  function deleteComment(postId: string, commentId: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: removeCommentById(post.comments, commentId) }
          : post,
      ),
    );
  }

  function reportPost(postId: string) {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, reported: true } : post)),
    );
  }

  function reportComment(postId: string, commentId: string) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: reportCommentById(post.comments, commentId) }
          : post,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title={t('community.pageTitle')}
        description={t('community.pageDescription')}
        actions={
          !isStaff && (
            <Button leadingIcon={<Plus className="size-4" />} onClick={() => setIsCreateOpen(true)}>
              {t('community.newPost')}
            </Button>
          )
        }
      />

      {isStaff && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatisticCard
            icon={Users}
            label={t('community.adminStats.totalPosts')}
            value={String(posts.length)}
          />
          <StatisticCard
            icon={MessageCircle}
            label={t('community.adminStats.totalComments')}
            value={String(totalComments)}
          />
          <StatisticCard
            icon={Flag}
            label={t('community.adminStats.reportedComments')}
            value={String(reportedCount)}
          />
        </div>
      )}

      {canModerate && bannedAuthors.length > 0 && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <UserX className="size-4" /> {t('community.bannedUsers.title')}
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {bannedAuthors.map((author) => (
              <li key={author} className="flex items-center justify-between text-sm">
                <span className="text-foreground">
                  {author}{' '}
                  <span className="text-muted-foreground">
                    — {t('community.bannedUsers.status')}
                  </span>
                </span>
                <Button size="sm" variant="ghost" onClick={() => unbanAuthor(author)}>
                  {t('community.bannedUsers.unban')}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2" role="group" aria-label={t('community.filterAriaLabel')}>
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          {t('community.filters.all')}
        </Button>
        {!isStaff && (
          <Button
            variant={filter === 'saved' ? 'primary' : 'outline'}
            size="sm"
            leadingIcon={<Bookmark className="size-4" />}
            onClick={() => setFilter('saved')}
          >
            {t('community.filters.saved')}
          </Button>
        )}
        {isStaff && (
          <Button
            variant={filter === 'reported' ? 'primary' : 'outline'}
            size="sm"
            leadingIcon={<Flag className="size-4" />}
            onClick={() => setFilter('reported')}
          >
            {t('community.filters.reported')}
          </Button>
        )}
      </div>

      {visiblePosts.length === 0 ? (
        <EmptyState
          icon={filter === 'reported' ? Flag : Users}
          title={t(
            filter === 'saved'
              ? 'community.empty.savedTitle'
              : filter === 'reported'
                ? 'community.empty.reportedTitle'
                : 'community.empty.title',
          )}
          description={t(
            filter === 'saved'
              ? 'community.empty.savedDescription'
              : filter === 'reported'
                ? 'community.empty.reportedDescription'
                : 'community.empty.description',
          )}
          secondaryAction={
            filter !== 'all' && (
              <Button size="sm" variant="outline" onClick={() => setFilter('all')}>
                {t('community.filters.all')}
              </Button>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {visiblePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={() => toggleLike(post.id)}
              onToggleSave={isStaff ? undefined : () => toggleSave(post.id)}
              onAddComment={(content) => addComment(post.id, content)}
              onAddReply={(commentId, content) => addReply(post.id, commentId, content)}
              onDeleteComment={
                isStaff ? (commentId) => deleteComment(post.id, commentId) : undefined
              }
              onEdit={post.isOwn ? () => setEditingPost(post) : undefined}
              onDelete={post.isOwn || canModerate ? () => setDeletingPostId(post.id) : undefined}
              onBan={canModerate && !post.isOwn ? () => setBanningAuthor(post.author) : undefined}
              isBanned={bannedAuthors.includes(post.author)}
              onReportPost={
                canReport && !post.isOwn ? () => reportPost(post.id) : undefined
              }
              onReportComment={
                canReport ? (commentId) => reportComment(post.id, commentId) : undefined
              }
            />
          ))}
        </div>
      )}

      <CreatePostModal
        open={isCreateOpen || editingPost !== null}
        onClose={closePostModal}
        onSubmit={handleSubmitPost}
        initialValues={
          editingPost
            ? {
                bookTitle: editingPost.bookTitle ?? '',
                content: editingPost.content,
                images: editingPost.images ?? [],
              }
            : undefined
        }
      />

      <Dialog
        open={deletingPost !== null}
        onClose={() => setDeletingPostId(null)}
        title={t('community.deleteDialog.title')}
        description={t('community.deleteDialog.description')}
        confirmLabel={t('community.deleteDialog.confirmLabel')}
        confirmVariant="danger"
        onConfirm={confirmDeletePost}
      />

      <Dialog
        open={banningAuthor !== null}
        onClose={() => setBanningAuthor(null)}
        title={t('community.banDialog.title', { author: banningAuthor })}
        description={t('community.banDialog.description', { author: banningAuthor })}
        confirmLabel={t('community.banDialog.confirmLabel')}
        confirmVariant="danger"
        onConfirm={confirmBanAuthor}
      />
    </div>
  );
}
