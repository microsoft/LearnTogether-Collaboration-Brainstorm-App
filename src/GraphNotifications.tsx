import { MouseEvent } from 'react';
import { Providers, ProviderState } from '@microsoft/mgt-element';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Person, ViewType } from '@microsoft/mgt-react';
import { SendIcon } from '@fluentui/react-icons-mdl2';

export async function GraphChat(userId: undefined) {
  const provider = Providers.globalProvider;
  if (provider.state === ProviderState.SignedIn) {
    let graphClient = provider.graph.client;
    let chatDetails = await graphClient.api('/me/chats').get();
    const strChatDetails = JSON.stringify(chatDetails);
    const parseChat = JSON.parse(strChatDetails);

    console.log(`chat details: + ${strChatDetails}`);
    if (parseChat.value != null) {
      console.log(`value: ${parseChat.value}`);
      //for(let chat of parseChat.value)
      for (let chat = 0; chat < parseChat.value.length; chat++) {
        if (parseChat.value[chat].chatType === "oneOnOne") {
          let getChatMembers = await graphClient.api('/chats/' + parseChat.value[chat].id)
            .expand('members')
            .get();

          const strMembers = JSON.stringify(getChatMembers)
          const parseMembers = JSON.parse(strMembers);
          console.log(`members details: ${strMembers}`);

          for (let member = 0; member < parseMembers.members.length; member++) {
            if (parseMembers.members[member].userId === userId) {
              const chatMessage = {
                body: {
                  content: `Come collaborate with us! ${window.location}`
                }
              };
              await graphClient.api('/chats/' + parseChat.value[chat].id + '/messages')
                .post(chatMessage);
            }
          }
        }
        else {
          console.log(`there is no oneOnOne chat found`);
        }
      }

    }
    else {

      const chat = {
        chatType: 'oneOnOne',
        members: [
          {
            '@odata.type': '#microsoft.graph.aadUserConversationMember',
            roles: ['owner'],
            'user@odata.bind': 'https://graph.microsoft.com/v1.0/users(\'' + userId + '\')'
          },
          {
            '@odata.type': '#microsoft.graph.aadUserConversationMember',
            roles: ['owner'],
            'user@odata.bind': 'https://graph.microsoft.com/v1.0/users(\'' + userId + '\')'
          }
        ]
      };

      await graphClient.api('/chats')
        .post(chat);
    }
  }
}

export async function Notification(message: string) {
  const provider = Providers.globalProvider;
  //SignalR Message - Presence Change Notifications
  // console.log(message);
  const parsedMessage = JSON.parse(message);

  // console.log(parsedMessage);
  const userId = parsedMessage.id;
  const userAvailability = parsedMessage.availability;

  console.log(`id: ${userId}`);
  console.log(`availability: ${userAvailability}`);
  console.log("user id:" + userId);

  //get logged in user's id
  let graphClient = provider.graph.client;
  let loggedInUser = await graphClient.api('/me').get();
  const strLoggedInUser = JSON.stringify(loggedInUser);
  const parseLoggedInUser = JSON.parse(strLoggedInUser);

  //notification id to prevent duplicate toast notifications
  const customId = userId;
  if (userAvailability === "Available" && userId !== parseLoggedInUser.id) {

    //notificatin message
    const Msg = () => (

      <div className="ToastDiv">
        <Person
          userId={userId}
          view={ViewType.threelines}
          showPresence
          person-presence="Available" />
        
        <button
          className="ToastButton"
          id="ToastButton"
          onClick={handleMouseEvent}>Invite  <SendIcon></SendIcon>
        </button>

      </div>
    )

    const handleMouseEvent = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      // Do something

      GraphChat(userId);

    };

    toast(Msg, { toastId: customId });

  }
}