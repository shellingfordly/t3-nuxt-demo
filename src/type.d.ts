interface GithubUserItem {
  avatarUrl: string; // user avatar
  url: string; // user id
  login: string; // user name
}

interface GithubCommentItem {
  body: string; // comment content
  bodyHTML: string; // create time
  createdAt: string; // comment url
  id: string;
  author: GithubUserItem;
}

type GithubCommentReaction =
  | "THUMBS_UP"
  | "THUMBS_DOWN"
  | "HEART"
  | "EYES"
  | "LAUGH"
  | "HOORAY"
  | "CONFUSED"
  | "ROCKET";
