import React from "react";
import ContactForm from "@/components/view/contact/contact-form";
import ContactInfo from "@/components/view/contact/contact-info";

function ContactUsPage() {
  return (
    <div className="flex flex-col md:flex-row justify-stretch items-stretch  md:gap-6 gap-8 pt-[15%]  pb-[12%]">
      <ContactInfo />

      <ContactForm />
    </div>
  );
}

export default ContactUsPage;
