import React from "react";
import { Box, Divider, useMediaQuery } from "@mui/material";
import Head from "../Head/Head";
import Member from "./Member";
import styles from "./MembersBox.module.css";
import { useSelector } from "react-redux";

const MembersBox = () => {
  const smallSize = useMediaQuery("(max-width:768px)");
  const { team, isLoading } = useSelector((state) => state.team);
  return (
    !isLoading && (
      <Box className={`grid jcs aic ${styles.members_box}`}>
        <Head title={"Members"} align={"center"} h={"h5"} />
        <Divider variant="fullWidth" orientation="horizontal" />
        <Box className={`grid jcs aic g10 ${styles.members}`}>
          {smallSize ? (
            <>
              <Member data={data.filter((m) => m.role === "Leader")[0]} />
              <Box className={`flex flex_wrap jcc aic g10`}>
                {data.map(
                  (member, i) =>
                    member.role === "Member" && <Member key={i} data={member} />
                )}
              </Box>
            </>
          ) : (
            team.Members.map((member, i) => (
              <Member
                leader={team.TeamLeader.Name === member.Name}
                key={i}
                data={member}
              />
            ))
          )}
        </Box>
      </Box>
    )
  );
};

export default MembersBox;
