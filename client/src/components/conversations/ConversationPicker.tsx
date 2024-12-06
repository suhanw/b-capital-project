import { useTheme } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import {
  useGetConversationList,
  useSetCurrentConversationId,
} from "../../store/conversations";
import { useCurrentUser } from "../../store/auth";

function ConversationPicker() {
  const { isLoggedIn } = useCurrentUser();
  const { conversationList } = useGetConversationList(isLoggedIn);
  const { currentConversationId, setCurrentConversationId } =
    useSetCurrentConversationId();

  return (
    <List disablePadding>
      {conversationList?.map(({ _id, title }: any) => (
        <ConversationPickerItem
          key={_id}
          _id={_id}
          title={title}
          setCurrentConversationId={setCurrentConversationId}
          isSelected={currentConversationId === _id}
        />
      ))}
    </List>
  );
}

function ConversationPickerItem({
  title,
  _id,
  setCurrentConversationId,
  isSelected,
}: any) {
  const theme = useTheme();
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => {
          setCurrentConversationId(_id);
        }}
      >
        <ListItemText
          primary={title}
          sx={{
            "& .MuiListItemText-primary": {
              fontWeight: isSelected ? 600 : 400,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "&::after": {
                content: '""',
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 100,
                background: `linear-gradient(to right, transparent, ${theme.palette.secondary.main})`,
              },
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default ConversationPicker;
