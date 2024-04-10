import { getCommentsApi, postCommentApi } from "../lib/github";

export function useComments() {
  const comments = ref<GithubCommentItem[]>([]);

  onMounted(init);

  async function init() {
    const data = await getCommentsApi();
    comments.value = data;
  }

  async function postComment(id: string) {
    await postCommentApi(
      `> test comment 
        \n 1111`,
      id
    );
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
    postComment,
  };
}
