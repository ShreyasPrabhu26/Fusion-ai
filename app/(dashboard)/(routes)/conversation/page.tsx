"use client";
import * as z from "zod";
import axios from "axios";

import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "./constants";
import Heading from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((cuurent) => [...cuurent, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      // TODO: Open AI Pro MOdel
      console.error(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most Advanced Conversation Model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg-col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="How far is the Moon?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          <div className="flex flex-col-reverse gap-y-4">
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message, index) => (
                <div key={index}>
                  {Array.isArray(message.content)
                    ? message.content.map((part, partIndex) => {
                        if ("text" in part) {
                          return <span key={partIndex}>{part.text}</span>;
                        } else {
                          // Handle 'ChatCompletionContentPartImage' case here
                          return null;
                        }
                      })
                    : message.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
