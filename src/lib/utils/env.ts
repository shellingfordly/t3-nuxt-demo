export function getEnv() {
  const env = {
    clientId: import.meta.env.VITE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_CLIENT_SECRET,
    githubAuthor: import.meta.env.VITE_GITHUB_AUTHOR,
    githubRepo: import.meta.env.VITE_GITHUB_REPO,
  };

  return env;
}
