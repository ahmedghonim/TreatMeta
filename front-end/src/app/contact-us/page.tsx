import React from "react";
import ContactForm from "@/components/view/contact/contact-form";
import ContactInfo from "@/components/view/contact/contact-info";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the TreatMeta team. Have questions about meta-analysis data conversion, suggestions for new features, or need assistance? We're here to help.",
  openGraph: {
    title: "Contact Us | TreatMeta",
    description: "Get in touch with the TreatMeta team for questions, suggestions, or assistance.",
  },
};

function ContactUsPage() {
  return (
    <div className="h-full flex items-center justify-center pt-16">
      <div className="flex flex-col md:flex-row justify-stretch items-stretch md:gap-6 gap-8 pb-[12%]">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  );
}

export default ContactUsPage;
