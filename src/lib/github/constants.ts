export function GetCommentsQuery() {
  return `\
  query getComments(
  $owner: String!
  $repo: String!
  $issueId: Int!
  $perPage: Int!
  ) {
  repository(owner: $owner, name: $repo) {
  issue(number: $issueId) {
    comments(
      last: $perPage
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
      }
      nodes {
        id
        body
        bodyHTML
        createdAt
        updatedAt
        author {
          avatarUrl
          login
          url
        }
        reactionGroups {
          users (first: 0) {
            totalCount
          }
          content
        }
      }
    }
  }
  }
  }`;
}

export function PostCommentQuery() {
  return `\
  mutation postComment(
  $issueNodeId: ID!
  $content: String!
  ) {
  addComment(
  input: {
    subjectId: $issueNodeId
    body: $content
  }
  ) {
  commentEdge {
    node {
      id
      body
      bodyHTML
      createdAt
      updatedAt
      author {
        avatarUrl
        login
        url
      }
      reactionGroups {
        users (first: 0) {
          totalCount
        }
        content
      }
    }
  }
  }
  }`;
}
