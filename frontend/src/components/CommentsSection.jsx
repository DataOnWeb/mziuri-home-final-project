import React from 'react';
import DonaldPurple from '../assets/images/donald-purple.webp';
import DonaldYellow from '../assets/images/donald-yellow.webp';
import MarissaPink from '../assets/images/marissa-pink.webp';
import { useTranslation } from 'react-i18next';
const CommentsSection = () => {
  const { t } = useTranslation();
  const comments = [
    {
      id: 1,
      name: t('comments.name1'),
      date: t('comments.date'),
      avatar: DonaldYellow,
      content: t('comments.text'),
    },
    {
      id: 2,
      name: t('comments.name2'),
      date: t('comments.date'),
      avatar: MarissaPink,
      content: t('comments.text'),
    },
    {
      id: 3,
      name: t('comments.name1'),
      date: t('comments.date'),
      avatar: DonaldPurple,
      content: t('comments.text'),
    },
  ];

  return (
    <div className="comments-container">
      <h2 className="comments-title">{t('comments.quantity')}</h2>

      <div className="comments-list">
        {comments.map((comment, index) => (
          <div
            className={`comment ${index === 1 ? 'right' : 'left'}`}
            key={comment.id}
          >
            <div className="comment-avatar">
              <img
                src={comment.avatar}
                alt={`${comment.name}'s avatar`}
              />
            </div>
            <div className="comment-content">
              <div className="comment-header">
                <h3 className="comment-author">{comment.name}</h3>
                <span className="comment-date">{comment.date}</span>
              </div>
              <p className="comment-text">{comment.content}</p>
              <button className="reply-button">{t('comments.buttonText')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
