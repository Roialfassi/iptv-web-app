
// src/components/GroupList.js
import React from 'react';
import '../styles/GroupList.css';

const GroupList = ({ groups, selectedGroup, onGroupSelect }) => {
  return (
    <div className="group-list">
      <h3>Groups</h3>
      {groups.length === 0 ? (
        <p className="no-data">No groups found</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li 
              key={group.name}
              className={selectedGroup && selectedGroup.name === group.name ? 'selected' : ''}
              onClick={() => onGroupSelect(group)}
            >
              <span className="group-name">{group.name}</span>
              <span className="group-count">{group.channels.length}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupList;