/**
 * Relation filter for "is the current viewer in this list?" checks
 * (article.favoritedBy, user.followedBy).
 *
 * The database returns at most one row (the viewer), and only its id,
 * instead of every favoriter/follower. Anonymous viewers match nothing:
 * the fallback id must stay a real value, as Prisma treats `id: undefined`
 * as "no filter" and would return everyone.
 */
export const useViewerOnly = (viewerId?: number) => ({
    where: {id: viewerId ?? -1},
    select: {id: true},
});
