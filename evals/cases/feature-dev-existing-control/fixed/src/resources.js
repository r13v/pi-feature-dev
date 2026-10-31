import { textField } from "./controls/textField.js";
import { slackChannelPicker } from "./controls/slackChannelPicker.js";

export function resourceForm() {
  return [textField("title", "Title"), slackChannelPicker("slackChannel")]
    .join("\n");
}
