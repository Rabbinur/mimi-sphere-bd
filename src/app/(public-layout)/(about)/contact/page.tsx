import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: "Contact Us 24/7 | Shopping Cart BD",
    description: "Get in touch with Shopping Cart BD for global sourcing, LC, and logistics support. We help you scale your business globally with ease.",
    keywords: ["contact us", "global sourcing BD", "trade inquiry", "Shopping Cart BD contact", "logistics support Bangladesh"],
    alternates: {
        canonical: "/contact",
    },
};

export default function ContactPage() {
    return <ContactClient />;
}