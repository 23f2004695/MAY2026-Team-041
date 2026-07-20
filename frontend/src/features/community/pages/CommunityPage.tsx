import { Bookmark, Plus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/components/common';
import { Button, Dialog, EmptyState } from '@/components/ui';
import { communityPosts, type CommunityPost, type PostComment } from '@/mocks/community';

import { CreatePostModal, type PostDraft } from '../components/CreatePostModal';
import { PostCard } from '../components/PostCard';

type Filter = 'all' | 'saved';

function addReplyToComments(comments: PostComment[], commentId: string, reply: PostComment): PostComment[] {
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

export function CommunityPage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [filter, setFilter] = useState<Filter>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const visiblePosts = useMemo(
    () => (filter === 'saved' ? posts.filter((post) => post.isSaved) : posts),
    [posts, filter],
  );
  const deletingPost = posts.find((post) => post.id === deletingPostId) ?? null;

  function handleSubmitPost(draft: PostDraft) {
    if (editingPost) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingPost.id
            ? { ...post, bookTitle: draft.bookTitle || undefined, content: draft.content, images: draft.images }
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

  return (
    <div className="flex flex-col gap-6">
      <PageTitle
        title={t('community.pageTitle')}
        description={t('community.pageDescription')}
        actions={
          <Button leadingIcon={<Plus className="size-4" />} onClick={() => setIsCreateOpen(true)}>
            {t('community.newPost')}
          </Button>
        }
      />

      <div className="flex gap-2" role="group" aria-label={t('community.filterAriaLabel')}>
        <Button variant={filter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setFilter('all')}>
          {t('community.filters.all')}
        </Button>
        <Button
          variant={filter === 'saved' ? 'primary' : 'outline'}
          size="sm"
          leadingIcon={<Bookmark className="size-4" />}
          onClick={() => setFilter('saved')}
        >
          {t('community.filters.saved')}
        </Button>
      </div>

      {visiblePosts.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t(filter === 'saved' ? 'community.empty.savedTitle' : 'community.empty.title')}
          description={t(filter === 'saved' ? 'community.empty.savedDescription' : 'community.empty.description')}
          secondaryAction={
            filter === 'saved' && (
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
              onToggleSave={() => toggleSave(post.id)}
              onAddComment={(content) => addComment(post.id, content)}
              onAddReply={(commentId, content) => addReply(post.id, commentId, content)}
              onEdit={post.isOwn ? () => setEditingPost(post) : undefined}
              onDelete={post.isOwn ? () => setDeletingPostId(post.id) : undefined}
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
    </div>
  );
}
