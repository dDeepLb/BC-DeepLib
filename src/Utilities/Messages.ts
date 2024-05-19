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

export function sendActionMessage(msg: string) {
  ServerSend('ChatRoomChat', {
    Content: 'Beep',
    Type: 'Action',
    Dictionary: [
      { Tag: 'Beep', Text: 'msg' },
      { Tag: '发送私聊', Text: 'msg' },
      { Tag: '發送私聊', Text: 'msg' },
      { Tag: 'Biep', Text: 'msg' },
      { Tag: 'Sonner', Text: 'msg' },
      { Tag: 'Звуковой сигнал', Text: 'msg' },
      { Tag: 'msg', Text: msg }
    ]
  });
}
