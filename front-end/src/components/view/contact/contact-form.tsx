"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { onMailer } from "@/lib/mailer";
import React, { useState, useTransition } from "react";
import { Store } from "react-notifications-component";

function ContactForm() {
  const [data, setData] = useState({
    name: "",
    email: "",
    mail_subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const onSubmit = () => {
    if (!data.name || !data.email || !data.mail_subject || !data.message) {
      setError("All fields are required");
      return;
    }
    if (data.email && !data.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (data.message && data.message.length < 10) {
      setError("Message must be at least 10 characters");
      return;
    }
    if (data.name.length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }
    setError("");
    onMailer({
      email: data.email,
      subject: data.mail_subject,
      html: `
      <h2>name: ${data.name}</h2>
      <h3>email: ${data.email}</h3>
      <h3>subject: ${data.mail_subject}</h3>
      <h3>message:</h3>
      <p>${data.message}</p>
      `,
    }).then((res) => {
      setData({
        name: "",
        email: "",
        mail_subject: "",
        message: "",
      });
      Store.addNotification({
        title: "Success",
        message: "Message sent successfully",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    });
  };
  const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex flex-col gap-4 flex-1 h-full w-full">
      <Input required onChange={handelChange} name="name" label="Name" />
      <Input
        required
        name="email"
        onChange={handelChange}
        type="email"
        label="Your E-mail "
      />
      <Input
        required
        name="mail_subject"
        onChange={handelChange}
        type="tel"
        label="Mail subject"
      />
      <TextArea
        required
        name="message"
        onChange={handelChange as any}
        label="Message"
        rows={10}
      />

      <p className="text-red-500">{error}</p>
      <Button full onClick={() => startTransition(() => onSubmit())}>
        {isPending ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}

export default ContactForm;
