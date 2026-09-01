"use client"

import { Label } from "@/components/ui/label"

import { HelpCircle, Phone } from "lucide-react"
import { useState } from "react"


import UserHeader from "@/components/custom/UserHeader"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"


export default function HelpSupportPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        orderId: "",
        message: "",
    })



    const handleContactFormChange = (field: any, value: any) => {
        setContactForm({
            ...contactForm,
            [field]: value,
        })
    }

    const handleSubmitContactForm = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        // Handle form submission
        alert("Your message has been sent. We'll get back to you soon!")
        setContactForm({
            name: "",
            email: "",
            orderId: "",
            message: "",
        })
    }

    const faqs = [
        {
            question: "How do I track my order?",
            answer:
                "You can track your order by going to 'My Orders' in your account dashboard. Click on the specific order you want to track and select 'Track Order'. You'll be able to see real-time updates on your package's location and estimated delivery date.",
        },
        {
            question: "What is your return policy?",
            answer:
                "We offer a 30-day return policy for most items. Products must be in their original condition with tags attached and original packaging. Some items like intimate apparel, earrings, and customized products cannot be returned for hygiene and personalization reasons.",
        },
        {
            question: "How long does shipping take?",
            answer:
                "Standard shipping typically takes 3-5 business days within the continental US. Express shipping is 1-2 business days. International shipping varies by location and can take 7-21 business days. You can see the estimated delivery date at checkout.",
        },
        {
            question: "Can I change or cancel my order?",
            answer:
                "You can modify or cancel your order within 1 hour of placing it. After that, our system begins processing orders for shipment. To request changes or cancellation, please contact our customer service team immediately.",
        },
        {
            question: "Do you ship internationally?",
            answer:
                "Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by location. Please note that customers are responsible for any customs fees, import taxes, or duties that may apply to international orders.",
        },
    ]



    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 to-blue-50">
            {/* Mobile Header */}
            <UserHeader
                title="Help And Support"
                isFilterOpen={false}
                setIsFilterOpen={() => { }}
                showSearch={false}
            />

            {/* Main Content */}
            <main className="flex-1 px-4 py-6 container mx-auto md:py-8">

                <Tabs defaultValue="contact" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                        <TabsTrigger value="contact">Contact Us</TabsTrigger>
                        <TabsTrigger value="faq">FAQs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="faq" className="mt-6">
                        <Card className="bg-white shadow-md">
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                                <CardDescription>Find quick answers to common questions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contact" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2">

                            <Card className="bg-white shadow-md">
                                <CardHeader>
                                    <CardTitle>Other Ways to Reach Us</CardTitle>
                                    <CardDescription>We're here to help you</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-gradient-to-r from-primary/80 to-primary p-3">
                                            <Phone className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Call Us</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Our customer service team is available Monday-Friday, 9am-5pm EST
                                            </p>
                                            <p className="mt-1 text-sm font-medium">+1 (555) 123-4567</p>
                                        </div>
                                    </div>

                                    <Separator />



                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-gradient-to-r from-primary/80 to-primary p-3">
                                            <HelpCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Help Center</h3>
                                            <p className="text-sm text-muted-foreground">Browse our comprehensive knowledge base</p>
                                            <Button variant="outline" className="mt-2">
                                                Visit Help Center
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-md">
                                <CardHeader>
                                    <CardTitle>Contact Support</CardTitle>
                                    <CardDescription>Send us a message and we'll get back to you</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmitContactForm} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={contactForm.name}
                                                onChange={(e) => handleContactFormChange("name", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={contactForm.email}
                                                onChange={(e) => handleContactFormChange("email", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="orderId">Order ID (Optional)</Label>
                                            <Input
                                                id="orderId"
                                                value={contactForm.orderId}
                                                onChange={(e) => handleContactFormChange("orderId", e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                rows={5}
                                                value={contactForm.message}
                                                onChange={(e) => handleContactFormChange("message", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary/80 hover:to-primary"
                                        >
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

            </main>
        </div>
    )
}
