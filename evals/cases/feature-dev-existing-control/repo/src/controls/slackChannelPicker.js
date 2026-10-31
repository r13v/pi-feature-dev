// Searches Slack channels by name and stores the channel id.
export function slackChannelPicker(name) {
  return `<slack-picker name="${name}" kind="channel"></slack-picker>`;
}
