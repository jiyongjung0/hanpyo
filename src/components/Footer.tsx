import { DATA_UPDATE_DATE } from '../dataUpdateDate'
import { MESSAGES } from '../constants/messages'
import { URLS } from '../constants/urls'
import { GitHubIcon } from './icons/GitHubIcon'

export const Footer = () => {
  return (
    <>
      <p className="data-source">
        {MESSAGES.DATA_SOURCE_LABEL}{' '}
        <a
          href={URLS.NIKL_FOREIGN_WORDS}
          target="_blank"
          rel="noopener noreferrer"
        >
          {MESSAGES.DATA_SOURCE_NAME}
        </a>
        {' '}({DATA_UPDATE_DATE} 다운로드)
      </p>

      <a
        href={URLS.GITHUB_REPO}
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
        aria-label={MESSAGES.GITHUB_LABEL}
      >
        <GitHubIcon />
      </a>
    </>
  )
}
