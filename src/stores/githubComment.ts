import { defineStore } from "pinia";
import { GithubComment } from "../lib/github";

export const useGithubCommentStore = defineStore("githubCommentStore", () => {
  const comments = ref<GithubCommentItem[]>([]);

  const githubComment = new GithubComment();

  async function initComments() {
    const data = await githubComment.getComments();
    comments.value = data;
  }

  async function postComment(content: string, id: string) {
    const result = await githubComment.createComment(content, id);
    if (result.errors && result.errors.length > 0) {
      const error = result.errors[0];

      alert(error.message);
      return false;
    }

    return true;
  }

  return {
    comments,
    initComments,
    postComment,
  };
});
