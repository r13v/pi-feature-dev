export function issueLink(issue) {
  return `https://sentry.example.com/issues/${issue.id}`;
}

export async function listIssues(project) {
  const res = await fetch(`https://sentry.example.com/api/${project}/issues`);
  if (!res.ok) return [];
  return res.json();
}
