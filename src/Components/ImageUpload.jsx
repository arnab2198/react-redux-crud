import { Avatar, Box, IconButton } from '@mui/material'
import React from 'react'
import { CameraAlt, Delete } from '@mui/icons-material';

function ImageUploadButton(props) {

    const { image, onDelete, acceptFiles = ['image/jpeg'], onChange } = props;

    const imageUpload = () => {
        const element = document.createElement('input');
        element.type = 'file';
        element.accept = acceptFiles;
        element.addEventListener('change', (e) => {
            if (onChange && acceptFiles.includes(e.target.files[0].type)) {
                onChange(e.target.files[0], 200);
            } else if (!acceptFiles.includes(e.target.files[0].type)) {
                onChange(e.target.files[0], 422);
                return false;
            }
        });
        element.click();
    };

    const imageDelete = () => {
        if (onDelete)
            onDelete()
    }

    return (
        <Box className='uploadAvatarMainWrap'>
            <Avatar
                src={image}
                sx={{
                    backgroundColor: '#e0e0e0',
                    width: '100%',
                    height: '100%',
                    fontWeight: 600,
                    border: '1px solid #d2d2d2'
                }}
            />
            <Box className='uploadOverlay' onClick={imageUpload}>
                <Box className='hoverImg'>
                    <Box component='span'>
                        Upload a image
                    </Box>
                    <CameraAlt />
                </Box>
            </Box>
            {image &&
                <IconButton className='deleteBtn' onClick={imageDelete}>
                    <Delete />
                </IconButton>
            }
        </Box>
    )
}

export default ImageUploadButton;