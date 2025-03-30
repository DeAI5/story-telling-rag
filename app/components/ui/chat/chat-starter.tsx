import { useChatUI } from "@llamaindex/chat-ui";
import { StarterQuestions } from "@llamaindex/chat-ui/widgets";
import { useEffect, useState } from "react";
import { useClientConfig } from "./hooks/use-config";

export function ChatStarter() {
  // Disable starter messages by always returning null
  return null;
}
