import React from 'react';
import DonaldPurple from '../assets/images/donald-purple.webp';
import DonaldYellow from '../assets/images/donald-yellow.webp';
import MarissaPink from '../assets/images/marissa-pink.webp';

const CommentsSection = () => {
  const comments = [
    {
      id: 1,
      name: 'Donald Chavez',
      date: '21 July 2021',
      avatar: DonaldYellow,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisi elit, sed do eiusmod tempor incidid ut labore etl dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati ullamco laboris nisi ut aliquex ea commodo consequat.',
    },
    {
      id: 2,
      name: 'Marissa Swan',
      date: '21 July 2021',
      avatar: MarissaPink,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisi elit, sed do eiusmod tempr incidid ut labore etl dolore magna aliqua. Ut enim ad minim veniam, quisnos exercitati ullamco laboris nisi ut aliquiex.',
    },
    {
      id: 3,
      name: 'Donald Chavez',
      date: '21 July 2021',
      avatar: DonaldPurple,
      content: 'Lorem ipsum dolor sit amet, consectetur adipisi elit, sed do eiusmod tempor incidid ut labore etl dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitati ullamco laboris nisi ut aliquex ea commodo consequat.',
    }
  ];

  return (
    <div className="comments-container">
      <h2 className="comments-title">Comments (03)</h2>
      
      <div className="comments-list">
        {comments.map((comment, index) => (
          <div 
            className={`comment ${index === 1 ? 'right' : 'left'}`} 
            key={comment.id}
          >
            <div className="comment-avatar">
              <img src={comment.avatar} alt={`${comment.name}'s avatar`} />
            </div>
            <div className="comment-content">
              <div className="comment-header">
                <h3 className="comment-author" >{comment.name}</h3>
                <span className="comment-date">{comment.date}</span>
              </div>
              <p className="comment-text">{comment.content}</p>
              <button className="reply-button">
                REPLY
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
