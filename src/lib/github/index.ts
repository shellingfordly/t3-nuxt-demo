import {
  deleteCommentQuery,
  getCommentsQuery,
  createCommentQuery,
  editorCommentQuery,
  reactionComment,
  getReactionsComment,
  getUserQuery,
  getIssueQuery,
} from "./query";
import { getEnv } from "../utils/env";
import { formatUrl } from "../utils/url";

const GITHUB_ACCESS_TOKEN = useLocalStorage("GITHUB_ACCESS_TOKEN", "");

export class GithubComment {
  //I_kwDOLrNqr86FF056
  private issueNodeId: string = "";
  // private issueId: number = 0;
  private clientId: string;
  private clientSecret: string;
  get githubToken() {
    return GITHUB_ACCESS_TOKEN.value;
  }

  constructor() {
    const env = getEnv();

    this.clientId = env.clientId;
    this.clientSecret = env.clientSecret;
  }

  private apiQueryMap = {
    post: createCommentQuery(),
    editor: editorCommentQuery(),
    delete: deleteCommentQuery(),
    reaction: reactionComment(),
    getReactions: getReactionsComment(),
    getUser: getUserQuery(),
  };

  private fetch(url: string, config?: RequestInit) {
    const fetch = useFetch(url, {
      headers: {
        Authorization: "token " + this.githubToken,
        Accept: "application/vnd.github.v3+json",
      },
      ...config,
    });

    return {
      post: async <T = any>(params: any) => {
        const result = await fetch.post(params);
        return JSON.parse(result.data.value as string) as T;
      },
      get: fetch.get,
      delete: fetch.delete,
      patch: fetch.patch,
    };
  }

  get getToken() {
    return GITHUB_ACCESS_TOKEN;
  }

  get isAuthed() {
    return !!GITHUB_ACCESS_TOKEN.value;
  }

  logout() {
    GITHUB_ACCESS_TOKEN.value = "";
  }

  /**
   * Redirect to the authorization page of platform.
   *
   * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-request-a-users-github-identity
   */
  async loginAuthorize() {
    const url = "https://github.com/login/oauth/authorize";

    window.location.href = formatUrl(url, {
      client_id: this.clientId,
      redirect_uri: window.location.href,
      scope: "public_repo user:email",
      state: "vue-comment",
    });
  }

  /**
   * Get user access token via `code`
   *
   * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github
   */
  async getAccessToken(code: string) {
    /**
     * access_token api does not support cors
     * @see https://github.com/isaacs/github/issues/330
     */

    try {
      const data = await this.fetch(
        "https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token",
        {
          headers: {
            Accept: "application/json",
          },
        }
      ).post({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: window.location.href,
      });

      if (data.access_token) GITHUB_ACCESS_TOKEN.value = data.access_token;
      return true;
    } catch (error) {
      console.error("Error[getAccessToken]: ", error);
    }

    return false;
  }

  /**
   * Get the logged-in user with access token.
   *
   * @see https://developer.github.com/v4/query/ viewer
   * @see https://developer.github.com/v4/object/user/
   */
  async getUser() {
    const { data } = await this.fetch("https://api.github.com/graphql").post({
      query: this.apiQueryMap.getUser,
    });

    return data.viewer as GithubUserItem;
  }

  async getIssue(issueId: number) {
    const { data } = await this.fetch("https://api.github.com/graphql").post({
      query: getIssueQuery({
        owner: "shellingfordly",
        repo: "vue-comment",
        issueId,
      }),
    });

    this.issueNodeId = data.repository.issue.id;
  }

  /**
   * Get comments of this page according to the issue id
   *
   * @see https://developer.github.com/v4/object/issuecommentconnection/
   */
  async getComments(pageInfo: Partial<GithubCommentPageInfo>) {
    const { data } = await this.fetch("https://api.github.com/graphql").post({
      variables: {
        owner: "shellingfordly",
        repo: "vue-comment",
        issueId: 1,
        perPage: 10,
      },
      query: getCommentsQuery(pageInfo),
    });

    return data.repository.issue.comments as GithubCommentResult;
  }

  /**
   * Create a new comment
   *
   * @see https://developer.github.com/v4/mutation/addcomment/
   * @see https://developer.github.com/v4/input_object/addcommentinput/
   */
  async createComment(content: string, id: string) {
    const issueNodeId = this.issueNodeId || id;

    return this.fetch("https://api.github.com/graphql").post({
      variables: {
        issueNodeId,
        content,
      },
      query: this.apiQueryMap.post,
    });
  }

  /**
   * Edit a comment
   *
   * @see https://developer.github.com/v4/mutation/updateissuecomment/
   * @see https://developer.github.com/v4/input_object/updateissuecommentinput/
   */
  async editorComment(commentId: string, content: string): Promise<GithubResult<GithubCommentItem>> {
    const result = await this.fetch("https://api.github.com/graphql").post({
      variables: {
        commentId,
        content,
      },
      query: this.apiQueryMap.editor,
    });

    if (result.errors && result.errors.length) {
      return {
        data: null,
        error: {
          message: result.errors[0].message,
          type: result.errors[0].type,
        },
      };
    } else {
      return {
        data: result.data.updateIssueComment.issueComment,
        error: null,
      };
    }
  }

  /**
   * Delete a comment
   *
   * @see https://developer.github.com/v4/mutation/deleteissuecomment/
   */
  async deleteComment(commentId: string): Promise<GithubResult> {
    const result = await this.fetch("https://api.github.com/graphql").post({
      variables: {
        commentId,
      },
      query: this.apiQueryMap.delete,
    });

    if (result.errors && result.errors.length) {
      return {
        data: null,
        error: {
          message: result.errors[0].message,
          type: result.errors[0].type,
        },
      };
    } else {
      return {
        data: result.data,
        error: null,
      };
    }
  }

  /**
   * reaction: ❤️ 👍 👎
   */
  async reactionComment(commentId: string, content: GithubCommentReactionType) {
    return this.fetch("https://api.github.com/graphql").post({
      variables: {
        commentId,
        content,
      },
      query: this.apiQueryMap.reaction,
    });
  }

  async getCommentReactions(issueId: string) {
    this.fetch("https://api.github.com/graphql").post({
      variables: {
        owner: "shellingfordly",
        repo: "vue-comment",
        issueId,
        perPage: 100,
      },
      query: this.apiQueryMap.getReactions,
    });
  }
}
