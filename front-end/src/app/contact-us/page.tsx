import React from "react";
import ContactForm from "@/components/view/contact/contact-form";
import ContactInfo from "@/components/view/contact/contact-info";

function ContactUsPage() {
  return (
    <div className="h-full flex items-center justify-center pt-16">
      <div className="flex flex-col md:flex-row justify-stretch items-stretch  md:gap-6 gap-8  pb-[12%]">
        <ContactInfo />

        <ContactForm />
      </div>
      
    </div>
  );
}

export default ContactUsPage;
