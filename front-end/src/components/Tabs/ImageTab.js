import React, {useState} from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {DropzoneDialog} from 'material-ui-dropzone';

// image tab
function ImageTab(props) {
  const token = localStorage.getItem('token');
  const pid = props.pid;
  const uid = localStorage.getItem('uid');
  const [image, setImage] = useState([]);
  const [open, setOpen] = useState(false);
  const plantImage = props.plantImage;

  const handleChange = (image) => {
    // Saving files to state for further use and closing Modal.
    setImage(image[0]);
  };

  const onUpload = (image, pid) => {
    // eslint-disable-next-line max-len
    const url = `${process.env.REACT_APP_BASE_API_URL}/api/users/${uid}/plants/${pid}/upload`;

    const formData = new FormData();
    // prepend user id to name of file
    formData.append('sampleFile', image, `${uid}_` + image.name);

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      credentials: 'include',
    };

    fetch(url, options)
        .then((res) => {
          if (res.redirected) {
            setOpen(false);
            props.setPlantImage(`${uid}_` + image.name);
          } else {
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  return (
    <>
      <Container maxWidth="xs">
        <div>
          {plantImage ? (
            <Paper
              component="img"
              // eslint-disable-next-line max-len
              src={`${process.env.REACT_APP_BASE_API_URL}/upload/${plantImage}`}
              width="100%"
              maxWidth="15rem"
              elevation={3}
            />) : (
            <Paper
              component="img"
              // eslint-disable-next-line max-len
              src="https://www.gardenia.net/storage/app/public/uploads/images/detail/shutterstock_1260151384Optimized.jpg"
              width="100%"
              maxWidth="15rem"
              elevation={3}
            />)}
        </div>
        <div style={{marginTop: '1.5rem'}}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setOpen(true)}
          >
            Upload new image
          </Button>
          <DropzoneDialog
            open={open}
            onSave={() => onUpload(image, pid)}
            onChange={(image) => handleChange(image)}
            onDelete={(deleteFileObj) => {
              console.log('onDelete', deleteFileObj);
            }}
            filesLimit={1}
            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
            showPreviews={true}
            maxFileSize={5000000}
            onClose={() => setOpen(false)}
          />
        </div>
      </Container>
    </>
  );
}

export default ImageTab;
