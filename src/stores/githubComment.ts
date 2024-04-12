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
  const userInfo = ref<Partial<GithubUserItem>>({});
  const router = useRouter();

  watch(
    _githubCode,
    async (code) => {
      if (code) {
        await _githubComment.getAccessToken(code);
        router.push("/");
      }
    },
    { immediate: true }
  );

  watch(() => _githubComment.isAuthed, init, { immediate: true });

  async function init() {
    if (_githubComment.isAuthed) {
      await _githubComment.getIssue(1);
      getUserInfo();
      initComments();
    }
  }

  // login github authorize
  function loginAuthorize() {
    _githubComment.loginAuthorize();
  }

  function sortComments(data: GithubCommentItem[]) {
    return data.sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );
  }

  function setPageInfo(result: GithubCommentResult) {
    pageInfo.endCursor = result.pageInfo.endCursor;
    pageInfo.startCursor = result.pageInfo.startCursor;
    commentTotalCount.value = result.totalCount;
  }

  async function initComments() {
    if (!_githubComment.isAuthed) return;

    const result = await _githubComment.getComments({ sort: "last" });
    comments.value = sortComments(result.nodes);

    setPageInfo(result);
  }

  async function updateComments() {
    if (!_githubComment.isAuthed) return;

    const result = await _githubComment.getComments(pageInfo);
    const newComments = sortComments(result.nodes);
    comments.value = [...comments.value, ...newComments];

    setPageInfo(result);
  }

  async function createComment(content: string, id: string) {
    if (!_githubComment.isAuthed) return;

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
    if (!_githubComment.isAuthed) return;

    _githubComment.reactionComment(commentId, content);
  }

  async function getReactionsComment() {
    // _githubComment.getCommentReactions("")
  }

  async function getUserInfo() {
    if (!_githubComment.isAuthed) return;

    userInfo.value = (await _githubComment.getUser()) || {};

    return userInfo.value;
  }

  function logout() {
    _githubComment.logout();
    window.location.reload();
  }

  return {
    comments,
    commentContent,
    commentTotalCount,
    userInfo,
    initComments,
    updateComments,
    createComment,
    reactionComment,
    getReactionsComment,
    loginAuthorize,
    getUserInfo,
    logout,
  };
});
