import dayjs from "dayjs";
import {
  deleteCommentQuery,
  getCommentsQuery,
  createCommentQuery,
  editorCommentQuery,
  reactionComment,
  getReactionsComment,
  getUserQuery,
} from "./query";
import { getEnv } from "../utils/env";
import { formatUrl } from "../utils/url";

const GITHUB_ACCESS_TOKEN = useLocalStorage("GITHUB_ACCESS_TOKEN", "");

export class GithubComment {
  //I_kwDOLrNqr86FF056
  private issueNodeId = "";
  private clientId: string;
  private clientSecret: string;
  get githubToken() {
    return GITHUB_ACCESS_TOKEN.value;
  }

  constructor(_issueNodeId?: string) {
    if (_issueNodeId) this.issueNodeId = _issueNodeId;

    const env = getEnv();

    this.clientId = env.clientId;
    this.clientSecret = env.clientSecret;
  }

  private apiQueryMap = {
    get: getCommentsQuery(),
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
      post: async (params: any) => {
        const result = await fetch.post(params);
        return JSON.parse(result.data.value as string);
      },
      get: fetch.get,
      delete: fetch.delete,
      patch: fetch.patch,
    };
  }

  private createRandomState() {
    const ran = Math.random();

    return String(dayjs().valueOf() + ran);
  }

  public setConfig({ code }: { code: string }) {}

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
      scope: "public_repo",
      state: this.createRandomState(),
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

  /**
   * Get comments of this page according to the issue id
   *
   * @see https://developer.github.com/v4/object/issuecommentconnection/
   */
  async getComments() {
    const result = await this.fetch("https://api.github.com/graphql").post({
      variables: {
        owner: "shellingfordly",
        repo: "vue-comment",
        issueId: 1,
        perPage: 100,
      },
      query: this.apiQueryMap.get,
    });

    const data = result.data.repository.issue.comments
      .nodes as GithubCommentItem[];

    return data.sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );
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
  async editorComment(commentId: string, content: string) {
    const result = await this.fetch("https://api.github.com/graphql").post({
      variables: {
        commentId,
        content,
      },
      query: this.apiQueryMap.editor,
    });
    return result.data.updateIssueComment.issueComment;
  }

  /**
   * Delete a comment
   *
   * @see https://developer.github.com/v4/mutation/deleteissuecomment/
   */
  async deleteComment(commentId: string) {
    this.fetch("https://api.github.com/graphql").post({
      variables: {
        commentId,
      },
      query: this.apiQueryMap.delete,
    });
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
