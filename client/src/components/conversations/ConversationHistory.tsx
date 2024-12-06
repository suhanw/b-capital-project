import { Fragment, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { useGetCurrentConversation } from "../../store/conversations";

function ConversationHistory() {
  const theme = useTheme();
  const { currentConversation } = useGetCurrentConversation();
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const scrollToLatestMessage = () => {
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToLatestMessage();
  }, [currentConversation?.messages?.length]);

  if (!currentConversation?.messages?.length) {
    return (
      <Box sx={{ padding: "20px 0" }}>
        <Typography variant="h3" textAlign="center">
          What can I help with?
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        paddingBottom: "20px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflowY: "auto",
      }}
    >
      {currentConversation?.messages?.map(({ _id, role, content }: any) => (
        <Fragment key={_id}>
          {role === "user" ? (
            <Box
              sx={{
                background: theme.palette.grey[100],
                display: "inline-flex",
                alignSelf: "flex-end",
                padding: "10px 20px",
                marginTop: "20px",
                borderRadius: "20px",
              }}
            >
              {content}
            </Box>
          ) : (
            <Box
              sx={{
                padding: "10px 10px 10px 0",
                marginTop: "20px",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <SmartToyIcon
                fontSize="large"
                sx={{
                  marginRight: "10px",
                }}
              />
              <Typography>{content}</Typography>
            </Box>
          )}
        </Fragment>
      ))}
      <div ref={latestMessageRef} />
    </Box>
  );
}

export default ConversationHistory;
