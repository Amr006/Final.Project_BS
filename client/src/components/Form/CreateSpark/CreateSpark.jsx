"use client";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import {
  SentimentSatisfiedRounded,
  AttachFileRounded,
  DeleteRounded,
  ImageRounded,
  KeyboardVoiceRounded,
  VideoLibraryRounded,
  AudiotrackRounded,
} from "@mui/icons-material";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { AudioRecorder } from "react-audio-voice-recorder";
import { RedIconButton } from "@/MUIComponents/RedIconButton/RedIconButton";
import ImagesGridBox from "@/components/ImagesGridBox/ImagesGridBox";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useContext } from "react";
import { SparkModalContext } from "@/context/SparkModalContext";
import LoadingButton from "@/components/LoadingButton/LoadingButton";
import VideosGridBox from "@/components/VideosGridBox/VideosGridBox";
import AudioGridBox from "@/components/AudioGridBox/AudioGridBox";

const CreateSpark = ({ handleChangeFile, formik }) => {
  const [dropEmojiShow, setDropEmojiShow] = useState(false);
  const [brainWaveEmojiShow, setBrainWaveEmojiShow] = useState(false);
  const {
    handleFiles,
    handleToggleChooseFiles,
    imageFiles,
    videoFiles,
    audioFiles,
    setAudioFiles,
    setRecord,
  } = useContext(SparkModalContext);
  const [recordExist, setRecordExist] = useState(false);
  const [recordBox, setRecordBox] = useState();

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    setRecordBox(
      <Box className={`grid jcfs aic g10`}>
        <Box className={`flex jcfs aic g5`}>
          <KeyboardVoiceRounded
            sx={{ color: (theme) => theme.palette.primary.main }}
          />
          <Typography variant="h6">Records</Typography>
        </Box>
        <Box className={`flex jcfs aic g10`}>
          <audio src={url} controls={true} />
          <RedIconButton onClick={deleteAudioElement}>
            <DeleteRounded />
          </RedIconButton>
        </Box>
      </Box>,
    );
    setRecordExist(true);
    setRecord(blob);
  };
  console.log(imageFiles);
  const deleteAudioElement = () => {
    setRecordBox();
    setRecord();
    setRecordExist(false);
  };
  return (
    <>
      <Box className={`grid jcs aic g20`}>
        <Box className={`grid jcs aic g5`}>
          <Box className={`flex jcs aic g5`}>
            <TextField
              id="idea"
              name="idea"
              label="Start a Spark"
              fullWidth
              multiline
              maxRows={4}
              variant="standard"
              value={formik.values.idea}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.idea && Boolean(formik.errors.idea)}
              helperText={formik.touched.idea && formik.errors.idea}
            />
            <IconButton onClick={() => setDropEmojiShow(!dropEmojiShow)}>
              <SentimentSatisfiedRounded />
            </IconButton>
          </Box>

          {dropEmojiShow && (
            <Picker
              onClickOutside={() => setDropEmojiShow(false)}
              theme={"light"}
              data={data}
              onEmojiSelect={(e) => {
                formik.values.idea += e.native;
              }}
            />
          )}
        </Box>
        <Box>
          <Box className={`flex jcs aifs g5`}>
            <TextField
              id="description"
              name="description"
              label="Brainwave"
              multiline
              fullWidth
              maxRows={10}
              variant="standard"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
            <IconButton
              onClick={() => setBrainWaveEmojiShow(!brainWaveEmojiShow)}
            >
              <SentimentSatisfiedRounded />
            </IconButton>
          </Box>
          {brainWaveEmojiShow && (
            <Picker
              onClickOutside={() => setBrainWaveEmojiShow(false)}
              theme={"light"}
              data={data}
              onEmojiSelect={(e) => {
                formik.values.description += e.native;
              }}
            />
          )}
        </Box>
      </Box>

      <Box className={`flex jcfs aic g10`}>
        <IconButton onClick={handleToggleChooseFiles}>
          <AttachFileRounded />
        </IconButton>
        {!recordExist && (
          <AudioRecorder
            onRecordingComplete={addAudioElement}
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true,
            }}
            downloadOnSavePress={false}
            downloadFileExtension="webm"
            showVisualizer={true}
          />
        )}
      </Box>

      {(recordExist ||
        imageFiles.length > 0 ||
        videoFiles.length > 0 ||
        audioFiles.length > 0) && (
        <Box className={`grid jcs aic g30`}>
          {recordExist && recordBox}
          <ImagesGridBox posting={true} data={imageFiles}>
            <Box className={`flex jcfs aic g5`}>
              <ImageRounded
                sx={{ color: (theme) => theme.palette.primary.main }}
              />
              <Typography variant="h6">Images</Typography>
            </Box>
          </ImagesGridBox>
          <VideosGridBox posting={true} data={videoFiles}>
            <Box className={`flex jcfs aic g5`}>
              <VideoLibraryRounded
                sx={{ color: (theme) => theme.palette.primary.main }}
              />
              <Typography variant="h6">Videos</Typography>
            </Box>
          </VideosGridBox>
          <AudioGridBox posting={true} data={audioFiles}>
            <Box className={`flex jcfs aic g5`}>
              <AudiotrackRounded
                sx={{ color: (theme) => theme.palette.primary.main }}
              />
              <Typography variant="h6">Audio</Typography>
            </Box>
          </AudioGridBox>
        </Box>
      )}
      <LoadingButton text={"Spark"} />
    </>
  );
};

export default CreateSpark;
