import { getCommentsQuery, postCommentQuery } from "./query";

export class GithubComment {
  private BaseUrl = "https://api.github.com/";
  //I_kwDOLrNqr86FF056
  private issueNodeId = "";

  constructor(_issueNodeId?: string) {
    if (_issueNodeId) this.issueNodeId = _issueNodeId;
  }

  private queryMap = {
    get: getCommentsQuery(),
    post: postCommentQuery(),
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
      query: this.queryMap.get,
    });

    return result.data.repository.issue.comments.nodes;
  }

  postComments(content: string, id: string) {
    const issueNodeId = this.issueNodeId || id;

    return this.fetch("graphql").post({
      variables: {
        issueNodeId,
        content,
      },
      query: this.queryMap.post,
    });
  }

  // async function reaction(content: "-1" | "+1" | "heart") {
  //   const { data } = await useFetch(
  //     "https://api.github.com/repos/meteorlxy/vssue/issues/comments/2044452619/reactions",
  //     {
  //       headers: {
  //         Authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN,
  //       },
  //     }
  //   ).post({
  //     content,
  //   });
  //   console.log("reaction - %s - %s", content, data);
  // }

  // function editor() {
  //   // patch https://api.github.com/repos/meteorlxy/vssue/issues/comments/2044452619
  //   // delete https://api.github.com/repos/meteorlxy/vssue/issues/comments/2044452619
  // }
}
