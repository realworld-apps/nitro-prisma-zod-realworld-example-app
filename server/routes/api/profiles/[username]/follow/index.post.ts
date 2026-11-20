import HttpException from "~/models/http-exception.model";
import profileMapper from "~/utils/profile.utils";
import {definePrivateEventHandler} from "~/auth-event-handler";

export default definePrivateEventHandler(async (event, {auth}) => {
    const username = getRouterParam(event, 'username');

    const user = await usePrisma().user.findUnique({
        where: { username },
        select: { id: true },
    });

    if (!user) {
        throw new HttpException(404, {errors: {profile: ['not found']}});
    }

    const profile = await usePrisma().user.update({
        where: {
            username,
        },
        data: {
            followedBy: {
                connect: {
                    id: auth.id,
                },
            },
        },
        select: {
            username: true,
            bio: true,
            image: true,
            followedBy: useViewerOnly(auth?.id),
        },
    });

    return {profile: profileMapper(profile, auth.id)};
});
