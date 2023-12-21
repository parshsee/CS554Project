// PublicRooms.js
import React from 'react';
import { Modal, Typography, Card, CardContent, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function PublicRooms({ publicRooms, onClose, onCardClick }) {
  return (
    <Modal open={!!publicRooms} onClose={onClose}>
      {publicRooms && publicRooms.length > 0 ? (
        <div style={{ backgroundColor: 'white', padding: '20px', maxWidth: '800px', margin: 'auto', marginTop: '50px', overflowY: 'auto', maxHeight: '800px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Button
            onClick={onClose}
            style={{ position: 'absolute', top: '5px', right: '5px', minWidth: 0, maxWidth: 10, padding: 20 }}
            size="small"
          >
            <CloseIcon />
          </Button>
          {publicRooms.map(room => (
            <Card
              key={room._id}
              variant="outlined"
              onClick={() => onCardClick(room)}
              sx={{
                border: '1px solid #1e8678',
                boxShadow: '0 19px 38px rgba(0,0,0,0.30);',
                cursor: 'pointer',
                marginBottom: '10px',
                width: '40%',
                flex: '1 0 40%',
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: '0 19px 38px rgba(0,0,0,0.50);',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6">{room.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Code: {room._id}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', padding: '20px', maxWidth: '800px', margin: 'auto', marginTop: '50px', textAlign: 'center' }}>
          <Typography variant="body1">No public rooms available.</Typography>
          <Button onClick={onClose}>Close</Button>
        </div>
      )}
    </Modal>
  );
}

export default PublicRooms;
