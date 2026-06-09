import articleMapper from "~/utils/article.mapper";
import {definePrivateEventHandler} from "~/auth-event-handler";
import {articleListQuerySchema} from "~/schemas/article.schema";
import {validateQuery} from "~/utils/validate";

export default definePrivateEventHandler(async (event, {auth}) => {
    const query = validateQuery(articleListQuerySchema, getQuery(event));
    const articlesCount = await usePrisma().article.count({
        where: {
            author: {
                followedBy: { some: { id: auth.id } },
            },
        },
    });

    const articles = await usePrisma().article.findMany({
        where: {
            author: {
                followedBy: { some: { id: auth.id } },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip: query.offset,
        take: query.limit,
        omit: {
            body: true,
        },
        include: {
            tagList: {
                select: {
                    name: true,
                },
            },
            author: {
                select: {
                    username: true,
                    image: true,
                    followedBy: { select: { id: true } },
                },
            },
            favoritedBy: { select: { id: true } },
            _count: {
                select: {
                    favoritedBy: true,
                },
            },
        },
    });

    return {
        articles: articles.map((article: any) => articleMapper(article, auth.id)),
        articlesCount,
    };
});
