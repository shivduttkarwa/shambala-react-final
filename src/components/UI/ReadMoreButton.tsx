import React from 'react';
import { Link } from 'react-router-dom';
import './ReadMoreButton.css';

interface ReadMoreButtonProps {
  text?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  target?: '_blank' | '_self';
  rel?: string;
  /** Kept for API compatibility — all sizes now render the shared cta-submit-button design. */
  size?: 'default' | 'compact' | 'card';
}

const ReadMoreButton: React.FC<ReadMoreButtonProps> = ({
  text = 'Read More',
  href,
  onClick,
  disabled = false,
  className = '',
  target = '_self',
  rel,
}) => {
  const content = (
    <>
      <span className="read-more-button__text">{text}</span>
      <span className="read-more-button__arrow">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 10H16M16 10L11 5M16 10L11 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );

  const classes = [
    'read-more-button',
    disabled ? 'is-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href && !disabled) {
    if (href.startsWith('/')) {
      return (
        <Link to={href} className={classes}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {content}
    </button>
  );
};

export default ReadMoreButton;
