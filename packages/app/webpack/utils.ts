// @ts-ignore
import packageJson from '../package.json';
import { execSync } from 'child_process';

const getBranch = () => execSync(`git rev-parse --abbrev-ref HEAD`, { encoding: 'utf8' }).trim();

const getCommit = () => execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();

const { version: _version } = packageJson;

/**
 * For CI builds, we add a random number after the patch version.
 */
export function getVersion() {
  const branch = getBranch();
  if (!branch || branch.includes('master')) return _version;
  return `${_version}.${Math.floor(Math.floor(Math.random() * 1000))}`;
}

export function getGithubDetails() {
  const version = getVersion();
  const commit = getCommit();
  const branch = getBranch();
  return {
    version,
    commit,
    branch,
  };
}

// Segment
export const getSegmentKey = () => {
  // Netlify sets CONTEXT=production for production releases.
  // https://docs.netlify.com/site-deploys/overview/#deploy-contexts
  if (process.env.CONTEXT === 'production') {
    return 'KZVI260WNyXRxGvDvsX4Zz0vhshQlgvE';
  }
  return 'Cs2gImUHsghl4SZD8GB1xyFs23oaNAGa';
};
