import { GetCommentsQuery, PostCommentQuery } from "./constants";

export async function getCommentsApi() {
  const { data } = await useFetch(`https://api.github.com/graphql`, {
    headers: {
      Authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN,
      Accept: "application/vnd.github.v3+json",
    },
  }).post({
    variables: {
      owner: "shellingfordly",
      repo: "vue-comment",
      issueId: 1,
      perPage: 10,
    },
    query: GetCommentsQuery(),
  });

  const result = JSON.parse(data.value as string);

  return result.data.repository.issue.comments.nodes;
}

export async function postCommentApi(content: string, id: string) {
  const { data } = await useFetch(
    `https://api.github.com/graphql`,

    {
      headers: {
        Authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN,
        Accept: "application/vnd.github.v3+json",
      },
    }
  ).post({
    variables: {
      // postComment needs issue NodeId, so we store it internally
      issueNodeId: "I_kwDOLrNqr86FF056",
      content,
    },
    query: PostCommentQuery(),
  });

  const result = JSON.parse(data.value as string);

  return result;
}
