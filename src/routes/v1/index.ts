import express, { Router } from "express";
import userRoute from "./users/user.route";
import profileRoute from "./profiles/profile.route";
import followRoute from "./following/following.route";
import commentRoute from "./comments-post/comments-post.route";
import contestRoute from "./contest/contest.route";
import postRoute from "./posts/posts.route";
import userLikeRoute from "./user-likes/user-likes.route";
import voteRoute from "./votes/votes.route";
import uploadRoute from "./upload/upload.route";
import { routingBaseUrlEnum } from "../../enums/v1";

const router: Router = express.Router();

router.use(routingBaseUrlEnum.USER_V1_BASEURL, userRoute);
router.use(routingBaseUrlEnum.PROFILE_V1_BASEURL, profileRoute);
router.use(routingBaseUrlEnum.FOLLOWING_V1_BASEURL, followRoute);
router.use(routingBaseUrlEnum.COMMENT_V1_BASEURL, commentRoute);
router.use(routingBaseUrlEnum.USERLIKES_V1_BASEURL, userLikeRoute);
router.use(routingBaseUrlEnum.CONTEST_V1_BASEURL, contestRoute);
router.use(routingBaseUrlEnum.VOTES_V1_BASEURL, voteRoute);
router.use(routingBaseUrlEnum.UPLOAD_V1_BASEURL, uploadRoute);
router.use(routingBaseUrlEnum.POST_V1_BASEURL, postRoute);

export default router;
