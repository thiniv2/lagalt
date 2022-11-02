import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useUser } from '../../Context/UserContext';
import "./ProfileBio.css"
import { updateBiography } from '../../Services/User';
import { storageRead, storageSave } from '../../Utils/Storage';



const ProfileBio = () => {
  const {user} = useUser()
    const [open, setOpen] = useState(false);
    const [bioText, setBioText] = useState("Default text")
    const bioRef = useRef()
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveChanges = () => {
      setBioText(bioRef.current.value)
      //Save changes by using API for example: saveUserBio(bioRef.current.value), saveUserBio from user service
      updateBiography(bioRef.current.value, user.microsoftId)
      const tempUser = storageRead('Lagalt-user')
      storageSave('Lagalt-user', {...tempUser, biography: bioRef.current.value})
      setOpen(false)
    }

    useEffect(() => {
       setBioText(user.biography)
    }, [user])

    return (
        <div className = "ProfileBio">
          <CssBaseline />
          <Container fixed className = "bioContainer">
            <Box className = "Box">
              <h5 className = "bioTitle">Bio</h5>
              <Typography variant="subtitle1" component="div" className = "bioText">
                {bioText}
              </Typography>
              <Button variant="outlined" size = "small" onClick={handleClickOpen}>
                EDIT
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Bio</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    type="email"
                    fullWidth
                    variant="standard"
                    inputRef={bioRef}
                    defaultValue=""
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>CANCEL</Button>
                  <Button onClick={handleSaveChanges}>SAVE CHANGES</Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Container>
        </div>
      
      );
    
}

export default ProfileBio



  