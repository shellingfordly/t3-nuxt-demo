interface GithubUserItem {
  avatarUrl: string; // user avatar
  url: string; // user id
  login: string; // user name
}
interface GithubCommentReactionGroup {
  content: GithubCommentReactionType;
  users: { totalCount: number };
}

interface GithubCommentItem {
  body: string; // comment content
  bodyHTML: string; // create time
  createdAt: string; // comment url
  id: string;
  author: GithubUserItem;
  reactionGroups: GithubCommentReactionGroup[];
}

interface GithubCommentPageInfo {
  endCursor: string;
  startCursor: string;
  sort: "last" | "first";
}
interface GithubCommentResult {
  nodes: GithubCommentItem[];
  pageInfo: GithubCommentPageInfo;
  totalCount: number;
}

type GithubCommentReactionType =
  | "THUMBS_UP"
  | "THUMBS_DOWN"
  | "HEART"
  | "EYES"
  | "LAUGH"
  | "HOORAY"
  | "CONFUSED"
  | "ROCKET";
