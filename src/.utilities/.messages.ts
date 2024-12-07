export function sendLocalMessage(id: string, message: string, timeoutInSeconds?: number) {
  const div = document.createElement('div');
  div.id = id;
  const specialId = id + Date.now();
  div.classList.add('ChatMessage', 'deeplib-message', specialId);
  div.setAttribute('data-time', ChatRoomCurrentTime());
  div.setAttribute('data-sender', Player?.MemberNumber + '');

  const messageContent = message.replaceAll('\n\t', '') + '<br>';
  const closeButton = document.createElement('a');
  closeButton.classList.add('deeplib-text');
  closeButton.addEventListener('click', () => {
    div?.remove();
  });
  closeButton.innerHTML = '<b>Close (Click)</b>';

  div.innerHTML = messageContent;
  div.append(closeButton);

  ChatRoomAppendChat(div);
  if (!timeoutInSeconds) return;
  setTimeout(() => div?.remove(), timeoutInSeconds * 1000);
}

export function sendActionMessage(msg: string, target: undefined | number = undefined, dictionary: ChatMessageDictionaryEntry[] = []) {
  if (!msg) return;
  ServerSend('ChatRoomChat', {
    Content: 'DEEPLIB_CUSTOM_ACTION',
    Type: 'Action',
    Target: target ?? undefined,
    Dictionary: [
      { Tag: 'MISSING TEXT IN "Interface.csv": DEEPLIB_CUSTOM_ACTION', Text: msg },
      ...dictionary,
    ],
  });
}
