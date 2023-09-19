import { openInNewTab } from '@app/common/utils/open-in-new-tab';

function makeStackTraceSection(stackTrace: string | null) {
  if (!stackTrace) return;
  return `

#### Stack trace
\`\`\`bash
${stackTrace}
\`\`\`

`;
}

export const openGithubIssue = ({
  message,
  stackTrace,
}: {
  message: string;
  stackTrace: string | null;
}) => {
  const githubUrl = new URL('https://github.com/blockstack/stacks-wallet-web/issues/new');
  const issueParams = githubUrl.searchParams;
  const issueTitle = `[${VERSION}] Bug: <describe issue>`;
  const issueLabels = 'bug,reported-from-ui';
  const issueBody = `
<!--
  PLEASE READ:
  Thanks for creating an issue. Please include as much detail as possible,
  including screenshots, operating system, browser, and steps to recreate.

  Please make sure to update the TITLE of this issue to something that
  describes the bug.
-->

An error occurred while using Leather for Web (\`${VERSION}\`).

### Error
> ${message}
${makeStackTraceSection(stackTrace)}
`;

  issueParams.set('title', issueTitle);
  issueParams.set('labels', issueLabels);
  issueParams.set('body', issueBody);

  openInNewTab(githubUrl.toString());
};
