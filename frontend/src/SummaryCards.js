import React from 'react';

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  width: '200px',
  margin: '10px',
  backgroundColor: '#fff',
  textAlign: 'center',
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  marginBottom: '30px',
  flexWrap: 'wrap',
};

function SummaryCards({ revenue, users }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h3>Total Revenue</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${revenue.toLocaleString()}</p>
      </div>
      <div style={cardStyle}>
        <h3>Total Users</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{users.toLocaleString()}</p>
      </div>
      {/* Add more cards here if needed */}
    </div>
  );
}

export default SummaryCards;
