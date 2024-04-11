import { defineStore } from "pinia";
import { GithubComment } from "../lib/github";
import { useRouteQuery } from "@vueuse/router";

export const useGithubCommentStore = defineStore("githubCommentStore", () => {
  const comments = ref<GithubCommentItem[]>([]);
  const _githubComment = reactive(new GithubComment());
  const githubComment = computed(() => _githubComment);
  const githubCode = useRouteQuery("code", "");
  const commentContent = ref("");

  watch(
    githubCode,
    async (code) => {
      if (code) _githubComment.getAccessToken(code);
    },
    { immediate: true }
  );

  // login github authorize
  function loginAuthorize() {
    _githubComment.loginAuthorize();
  }

  async function getComments() {
    const data = await _githubComment.getComments();
    comments.value = data;
  }

  async function postComment(content: string, id: string) {
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

  return {
    commentContent,
    comments,
    getComments,
    postComment,
    reactionComment,
    getReactionsComment,
    githubComment,
    loginAuthorize,
  };
});
