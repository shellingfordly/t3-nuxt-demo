import {
  deleteCommentQuery,
  getCommentsQuery,
  createCommentQuery,
  editorCommentQuery,
  reactionComment,
} from "./query";

export class GithubComment {
  private BaseUrl = "https://api.github.com/";
  //I_kwDOLrNqr86FF056
  private issueNodeId = "";

  constructor(_issueNodeId?: string) {
    if (_issueNodeId) this.issueNodeId = _issueNodeId;
  }

  private apiQueryMap = {
    get: getCommentsQuery(),
    post: createCommentQuery(),
    editor: editorCommentQuery(),
    delete: deleteCommentQuery(),
    reaction: reactionComment(),
  };

  private fetch(api: string) {
    const url = this.BaseUrl + api;

    const fetch = useFetch(url, {
      headers: {
        Authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN,
        Accept: "application/vnd.github.v3+json",
      },
    });

    return {
      post: async (params: any) => {
        const result = await fetch.post(params);
        return JSON.parse(result.data.value as string);
      },
      get: fetch.get,
      delete: fetch.delete,
      patch: fetch.patch,
    };
  }

  async getComments() {
    const result = await this.fetch("graphql").post({
      variables: {
        owner: "shellingfordly",
        repo: "vue-comment",
        issueId: 1,
        perPage: 10,
      },
      query: this.apiQueryMap.get,
    });

    return result.data.repository.issue.comments.nodes;
  }

  async createComment(content: string, id: string) {
    const issueNodeId = this.issueNodeId || id;

    return this.fetch("graphql").post({
      variables: {
        issueNodeId,
        content,
      },
      query: this.apiQueryMap.post,
    });
  }

  async editorComment(commentId: string, content: string) {
    const result = await this.fetch("graphql").post({
      variables: {
        commentId,
        content,
      },
      query: this.apiQueryMap.editor,
    });
    return result.data.updateIssueComment.issueComment;
  }

  async deleteComment(commentId: string) {
    this.fetch("graphql").post({
      variables: {
        commentId,
      },
      query: this.apiQueryMap.delete,
    });
  }

  /**
   * reaction: ❤️ 👍 👎
   */
  async reactionComment(commentId: string, content: GithubCommentReaction) {
    return this.fetch("graphql").post({
      variables: {
        commentId,
        content,
      },
      query: this.apiQueryMap.reaction,
    });
  }
}
