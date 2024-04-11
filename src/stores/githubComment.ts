import { defineStore } from "pinia";
import { GithubComment } from "../lib/github";
import { useRouteQuery } from "@vueuse/router";
import dayjs from "dayjs";

export const useGithubCommentStore = defineStore("githubCommentStore", () => {
  const _githubCode = useRouteQuery("code", "");
  const _githubComment = reactive(new GithubComment());

  const comments = ref<GithubCommentItem[]>([]);
  const pageInfo = reactive<Partial<GithubCommentPageInfo>>({});
  const commentContent = ref("");
  const commentTotalCount = ref(Infinity);

  watch(
    _githubCode,
    async (code) => {
      if (code) _githubComment.getAccessToken(code);
    },
    { immediate: true }
  );

  // login github authorize
  function loginAuthorize() {
    _githubComment.loginAuthorize();
  }

  function sortComments(data: GithubCommentItem[]) {
    return data.sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );
  }

  async function updateComments() {
    const result = await _githubComment.getComments(pageInfo);
    const newComments = sortComments(result.nodes);
    comments.value = [...comments.value, ...newComments];

    pageInfo.endCursor = result.pageInfo.endCursor;
    pageInfo.startCursor = result.pageInfo.startCursor;
    commentTotalCount.value = result.totalCount;
  }

  async function createComment(content: string, id: string) {
    const result = await _githubComment.createComment(content, id);
    if (result.errors && result.errors.length > 0) {
      const error = result.errors[0];

      alert(error.message);
      return false;
    }

    return true;
  }

  async function reactionComment(
    commentId: string,
    content: GithubCommentReactionType
  ) {
    _githubComment.reactionComment(commentId, content);
  }

  async function getReactionsComment() {
    // githubComment.getCommentReactions(co)
  }

  function getUserInfo() {
    return _githubComment.getUser();
  }

  return {
    comments,
    commentContent,
    commentTotalCount,
    updateComments,
    createComment,
    reactionComment,
    getReactionsComment,
    loginAuthorize,
    getUserInfo,
  };
});
