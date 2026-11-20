import HttpException from "~/models/http-exception.model";
import profileMapper from "~/utils/profile.utils";
import {definePrivateEventHandler} from "~/auth-event-handler";

export default definePrivateEventHandler(async (event, {auth}) => {
    const username = getRouterParam(event, 'username');

    const profile = await usePrisma().user.findUnique({
        where: {
            username,
        },
        select: {
            username: true,
            bio: true,
            image: true,
            followedBy: useViewerOnly(auth?.id),
        },
    });

    if (!profile) {
        throw new HttpException(404, {errors: {profile: ['not found']}});
    }

    return {profile: profileMapper(profile, auth?.id)};
}, {requireAuth: false});
