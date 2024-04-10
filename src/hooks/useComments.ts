import { getCommentsApi, postCommentApi } from "../lib/github";

export function useComments() {
  const comments = ref<GithubCommentItem[]>([]);

  async function initComments() {
    const data = await getCommentsApi();
    comments.value = data;
  }

  async function postComment(content: string, id: string) {
    await postCommentApi(content, id);
  }

  async function reaction(content: "-1" | "+1" | "heart") {
    const { data } = await useFetch(
      "https://api.github.com/repos/meteorlxy/vssue/issues/comments/2044452619/reactions",
      {
        headers: {
          Authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN,
        },
      }
    ).post({
      content,
    });
    console.log("reaction - %s - %s", content, data);
  }

  function editor() {
    // patch https://api.github.com/repos/meteorlxy/vssue/issues/comments/2044452619
    // delete https://api.github.com/repos/meteorlxy/vssue/issues/comments/2044452619
  }

  return {
    comments,
    initComments,
    postComment,
  };
}
