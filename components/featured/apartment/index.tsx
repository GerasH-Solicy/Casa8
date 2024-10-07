"use client";

import {
  MapPin,
  Bath,
  DollarSign,
  SquareIcon,
  Bed,
  MessageCircle,
  Mail,
  Phone,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useApartament } from "@/hooks/useApartament";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Apartment } from "@/lib/interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LikeButton from "@/components/shared/likeButton";
import { useEmail } from "@/hooks/useEmail";
import { useToast } from "@/hooks/use-toast";
import LoginRequired from "@/components/shared/loginRequired";

interface ApartmentProps {
  id: string;
}

export default function ApartmentDetail({ id }: ApartmentProps) {
  const [rental, setRental] = useState<Apartment | null>(null);
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [disableLike, setDisableLike] = useState<boolean>();
  const [isCopied, setIsCopied] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [content, setContent] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { getApartamentById, toogleLikeApartament } = useApartament();
  const { sendEmail } = useEmail();
  const { toast } = useToast();

  const fetchAppartment = async () => {
    if (rental) {
      return;
    }
    const res = await getApartamentById(
      id,
      user?.primaryEmailAddress?.emailAddress ?? ""
    );
    if (!res || !res?.apartment) {
      router.push("/404");
    }
    setRental(res.apartment);
  };

  const toggleLike = async () => {
    if (disableLike || !rental) {
      return;
    }
    setDisableLike(true);
    const res = await toogleLikeApartament({
      email: user?.primaryEmailAddress?.emailAddress,
      apartmentId: rental._id,
    });
    setDisableLike(false);
    if (res.success) {
      setRental({ ...rental, liked: !rental.liked });
    }
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!rental?.images) return;
    const newIndex =
      direction === "prev"
        ? (selectedImageIndex - 1 + rental.images.length) % rental.images.length
        : (selectedImageIndex + 1) % rental.images.length;
    setSelectedImageIndex(newIndex);
  };

  const handleSubmitApplication = async () => {
    setLoading(true);
    const newContent = `
      Application from ${user?.primaryEmailAddress?.emailAddress}
      Full name - ${user?.fullName}
      Phone number - ${phoneNumber}

      Additional message.
      ${content}
    `;
    const res = await sendEmail({
      from: user?.primaryEmailAddress?.emailAddress,
      to: rental?.userEmail,
      content: newContent,
    });
    setLoading(false);
    if (res.success) {
      toast({
        title: "Successfully send.",
        description: "You message is successfuly send.",
      });
      return;
    }
    toast({
      title: "Error on sending.",
      description: "Something gone wrong.",
    });
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(rental?.phoneNumber as string);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    if (id && user !== undefined) {
      fetchAppartment();
    }
  }, [id, user]);

  const handleSendEmail = async () => {
    setLoading(true);
    const res = await sendEmail({
      from: user?.primaryEmailAddress?.emailAddress,
      to: rental?.userEmail,
      content,
    });
    setLoading(false);
    if (res.success) {
      toast({
        title: "Successfully send.",
        description: "You message is successfuly send.",
      });
      return;
    }
    toast({
      title: "Error on sending.",
      description: "Something gone wrong.",
    });
  };

  return (
    <div className="container mx-auto p-4 bg-background">
      <Link href="/">
        <Button variant="outline" className="mb-4">
          <ArrowLeft /> Back
        </Button>
      </Link>
      <Card className="w-full border-primary/20 shadow-lg">
        <CardHeader className="bg-primary/5">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {rental?.title}
            </CardTitle>
            <LikeButton
              liked={rental?.liked as boolean}
              toggleLike={toggleLike}
            />
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{rental?.address}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Carousel className="w-full max-w-xl mx-auto">
            <CarouselContent>
              {rental?.images?.map((image: string, index: number) => (
                <CarouselItem key={index}>
                  <div
                    onClick={() => openImageModal(index)}
                    className="relative h-64 w-full"
                  >
                    <Image
                      src={image}
                      alt={`Property image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {(rental?.images?.length as number) > 0 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center bg-secondary/20 p-2 rounded-md">
              <DollarSign className="h-5 w-5 mr-2 text-primary" />
              <span className="font-semibold text-primary">
                ${rental?.monthlyRent}/month
              </span>
            </div>
            <div className="flex items-center bg-secondary/20 p-2 rounded-md">
              <Bed className="h-5 w-5 mr-2 text-primary" />
              <span>
                {rental?.bedrooms
                  ? `${rental.bedrooms} Bedrooms`
                  : "No Bedrooms"}
              </span>
            </div>
            <div className="flex items-center bg-secondary/20 p-2 rounded-md">
              <Bath className="h-5 w-5 mr-2 text-primary" />
              <span>
                {rental?.bathrooms
                  ? `${rental.bathrooms} bathrooms`
                  : "No bathroom"}
              </span>
            </div>
            <div className="flex items-center bg-secondary/20 p-2 rounded-md">
              <SquareIcon className="h-5 w-5 mr-2 text-primary" />
              <span>{rental?.squareFootage} sqft</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-primary">
              Description
            </h3>
            <p className="text-muted-foreground">{rental?.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-primary">
              Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {rental?.amenities?.map((amenity: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-primary/5 mt-6">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => setIsContactOpen(true)}
          >
            Contact Landlord
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsApplyOpen(true)}
          >
            Apply Now
          </Button>
        </CardFooter>
      </Card>

      {/* Contact Landlord Dialog */}
      <Dialog
        open={isContactOpen}
        onOpenChange={(value) => {
          setIsContactOpen(value);
          setContent("");
        }}
      >
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact Landlord</DialogTitle>
            <DialogDescription>
              Choose how you'd like to get in touch with{" "}
              {rental?.landlord?.name}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="phone" className="w-full">
            <TabsList
              className={`grid w-full grid-cols-${
                !rental?.phoneNumber?.length && !rental?.isChatAllowed
                  ? 1
                  : !rental?.phoneNumber?.length || !rental?.isChatAllowed
                  ? 2
                  : 3
              }`}
            >
              {rental?.phoneNumber && (
                <TabsTrigger
                  value="phone"
                  className="flex items-center justify-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </TabsTrigger>
              )}
              <TabsTrigger
                value="email"
                className="flex items-center justify-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              {rental?.isChatAllowed && (
                <TabsTrigger
                  value="chat"
                  className="flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="chat">
              <Card>
                <CardHeader>
                  <CardTitle>Chat with {rental?.landlord?.name}</CardTitle>
                  <CardDescription>
                    Send a message to start chatting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center">Will be available soon!</p>
                  {/* <Textarea
                    placeholder="Type your message here..."
                    className="min-h-[100px]"
                  /> */}
                </CardContent>
                {/* <CardFooter>
                  <Button className="w-full">Send Message</Button>
                </CardFooter> */}
              </Card>
            </TabsContent>
            <TabsContent value="email">
              {isSignedIn ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Email {rental?.landlord?.name}</CardTitle>
                    <CardDescription>
                      Send an email to get in touch
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input value={rental?.userEmail} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailMessage">Your Message</Label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        id="emailMessage"
                        placeholder="Type your message here..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      disabled={loading}
                      onClick={handleSendEmail}
                      className="w-full"
                    >
                      {loading ? "Sending..." : "Send Email"}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <LoginRequired />
              )}
            </TabsContent>
            <TabsContent value="phone">
              <Card>
                <CardHeader>
                  <CardTitle>Call</CardTitle>
                  <CardDescription>
                    Use the phone number below to call directly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Input value={rental?.phoneNumber} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyPhone}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <a
                      href={`tel:${rental?.phoneNumber}`}
                      className="flex-grow"
                    >
                      <Button>Call</Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <Dialog open={isImageModalOpen} onOpenChange={closeImageModal}>
        <DialogContent className="bg-white sm:max-w-[90vw] h-[100%] p-0">
          <div className="relative w-full h-full">
            <Button
              size="sm"
              variant="link"
              className="absolute top-2 right-2 z-10"
              onClick={closeImageModal}
            ></Button>
            {rental?.images && (
              <Image
                src={rental.images[selectedImageIndex]}
                alt={`Property image ${selectedImageIndex + 1}`}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-2 transform -translate-y-1/2"
              onClick={() => navigateImage("prev")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
              onClick={() => navigateImage("next")}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Apply Now Dialog */}
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent className="bg-white sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Apply for this Property</DialogTitle>
          </DialogHeader>
          <form>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                {/* <CardDescription>
                  Provide your contact details for the application.
                </CardDescription> */}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      defaultValue={user?.firstName as string}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      defaultValue={user?.lastName as string}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    readOnly
                    defaultValue={user?.primaryEmailAddress?.emailAddress}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    // type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    defaultValue={user?.phoneNumbers[0]?.phoneNumber}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message (Optional)</Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    id="message"
                    name="message"
                    placeholder="Any additional information you'd like to provide..."
                  />
                </div>
                {/* <div className="flex items-center space-x-2">
                  <Checkbox id="agreeToTerms" required />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the terms and conditions of the application
                    process
                  </Label>
                </div> */}
              </CardContent>
              <CardFooter>
                <Button
                  disabled={loading}
                  onClick={handleSubmitApplication}
                  type="submit"
                  className="w-full"
                >
                  {loading ? "Sending" : "Submit Application"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
