export function sendLocalSmart(id: string, message: string, timeoutInSeconds?: number) {
  const div = document.createElement('div');
  div.id = id;
  div.setAttribute('class', 'ChatMessage DeepLibMessage');
  div.setAttribute('data-time', ChatRoomCurrentTime());
  div.setAttribute('data-sender', Player?.MemberNumber + '');

  div.innerHTML =
    message.replaceAll('\n\t', '') +
    /*html*/ `<br><a class="DeepLibText" onClick='document.getElementById("${id}").remove();'><b>Close (Click)</b></a>`;

  ChatRoomAppendChat(div);
  if (!timeoutInSeconds) return;
  setTimeout(() => div?.remove(), timeoutInSeconds * 1000);
}

export function sendAction(msg: string) {
  ServerSend('ChatRoomChat', {
    Content: 'Beep',
    Type: 'Action',
    Dictionary: [
      // EN
      { Tag: 'Beep', Text: 'msg' },
      // CN
      { Tag: '发送私聊', Text: 'msg' },
      // DE
      { Tag: 'Biep', Text: 'msg' },
      // FR
      { Tag: 'Sonner', Text: 'msg' },
      // Message itself
      { Tag: 'msg', Text: msg }
    ]
  });
}
