import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
    title: "Contact Us | Mimi Sphere",
    description: "Get in touch with Mimi Sphere. We are here 24/7 to assist you with your orders and inquiries.",
    keywords: ["contact us", "mimi sphere contact", "support mimi sphere"],
    alternates: {
        canonical: "/contact",
    },
};

export default function ContactPage() {
    return <ContactClient />;
}