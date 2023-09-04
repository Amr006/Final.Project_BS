import React from "react";
import { Box, Typography } from "@mui/material";
import styles from "./Head.module.css";

const Head = ({ title, teamName, align, h, color, special }) => {
  return (
    <Box
      className={`flex aic ${
        align === "center" ? "jcc" : align === "left" ? "jcfs" : "jcfe"
      } ${styles.head} ${special && styles.head_special}`}
    >
      <Typography
        sx={{ textAlign: { align }, color: color ? color : "#333" }}
        variant={h}
      >
        {teamName && title && title.length > 20
          ? title.slice(0, 20) + "..."
          : title}
      </Typography>
    </Box>
  );
};

export default Head;
