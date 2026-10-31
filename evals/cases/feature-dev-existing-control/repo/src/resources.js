import { textField } from "./controls/textField.js";

export function resourceForm() {
  return [
    textField("title", "Title"),
    textField("slackName", "Slack channel name"),
    textField("slackId", "Slack channel id"),
  ].join("\n");
}
