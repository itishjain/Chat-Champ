import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Alert, Button, Icon } from "rsuite";
import { auth, database, storage } from "../../../misc/firebase";
import { groupBy, transformToArrayWithId } from "../../../misc/helpers";
import MessageItem from "./MessageItem";

const PAGE_SIZE = 15;
const messagesRef = database.ref(`/messages`);

function shouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;
  return percentage > threshold;
}

const Messages = () => {
  const { chatId } = useParams();

  const selfRef = useRef();

  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMsgs = useCallback(
    (limitToLast) => {
      const node = selfRef.current;
      messagesRef.off();
      messagesRef
        .orderByChild(`roomId`)
        .equalTo(chatId)
        .limitToLast(limitToLast || PAGE_SIZE)
        .on("value", (snap) => {
          const data = transformToArrayWithId(snap.val());
          setMessages(data);

          if (shouldScrollToBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });

      setLimit((p) => p + PAGE_SIZE);
    },
    [chatId]
  );

  const loadMoreMssges = useCallback(() => {
    const node = selfRef.current;

    const oldScrollHeight = node.scrollHeight;

    loadMsgs(limit);

    setTimeout(() => {
      const newScrollHeight = node.scrollHeight;
      node.scrollTop = newScrollHeight - oldScrollHeight;
    }, 510);
  }, [loadMsgs, limit]);

  useEffect(() => {
    const node = selfRef.current;

    loadMsgs();

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 510);

    return () => {
      messagesRef.off("value");
    };
  }, [loadMsgs]);

  const handleAdmin = useCallback(
    async (uid) => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);

      let alertMsg;

      await adminsRef.transaction((admins) => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = "Admin permission removed successfully!";
          } else {
            admins[uid] = true;
            alertMsg = "Admin permission granted successfully!";
          }
        }
        return admins;
      });
      Alert.success(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async (msgId) => {
    const { uid } = auth.currentUser;

    const messageRef = database.ref(`/messages/${msgId}`);

    let alertMsg;

    await messageRef.transaction((msg) => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = "Like removed successfully!";
        } else {
          msg.likeCount += 1;

          if (!msg.likes) {
            msg.likes = {};
          }

          msg.likes[uid] = true;
          alertMsg = "Liked";
        }
      }
      return msg;
    });
    Alert.success(alertMsg, 850);
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      if (!window.confirm("Delete this message ?")) {
        return;
      }

      const isLastMsg = messages[messages.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLastMsg && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLastMsg && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);
        Alert.success("Message deleted successfully !", 4000);
      } catch (err) {
        return Alert.error(err.message, 850);
      }

      if (file) {
        try {
          const fileRef = await storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (err) {
          Alert.error(err.message, 4000);
        }
      }
    },
    [chatId, messages]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, (item) =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];

    Object.keys(groups).forEach((date) => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));
      items.push(...msgs);
    });
    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={loadMoreMssges}>
            <Icon icon="reload" className="mr-1" />
            Load Previous Messages
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No Messages Yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
