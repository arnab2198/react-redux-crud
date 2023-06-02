import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent } from '@mui/material'
import React from 'react'

const ImageDialog = (props) => {

    const { image, open, onClose } = props;

    return (
        <Dialog maxWidth="1200px" fullScreen open={open} onClose={onClose}>
            <Box display='flex' justifyContent='flex-end' alignItems='center' height='60px' >
                <Button onClick={onClose} sx={{ borderRadius: '50%', marginTop: '10px', height: '60px' }}>
                    <Close />
                </Button>
            </Box>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
                <Box className='imgBox'>
                    <img width={'80%'} height={'100%'} src={image} />
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ImageDialog