"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Book, Clock, Heart, LogOut, Key } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { handleSignOut } from "@/actions/authActions";
import { changePassword, getProfileData, updateUserProfile } from "@/actions/memberActions";

interface FavoriteBook {
  id: number;
  title: string;
  author: string;
  genre: string;
  isbnNo: string | null;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  image: string;
  favorites: FavoriteBook[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfileData() {
      const result = await getProfileData();

      if (result.success && result.data) {
        setUser(result.data as UserProfile);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch profile data",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }
    fetchProfileData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) {
      toast({
        title: "Error",
        description: "User data is not available",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("phoneNumber", user.phoneNumber);

    const result = await updateUserProfile(formData);
    setIsLoading(false);
    if ("message" in result) {
      toast({
        title: "Success",
        description: result.message,
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    const result = await changePassword(currentPassword, newPassword);
    if ("message" in result) {
      toast({
        title: "Success",
        description: result.message,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error: Unable to load user profile</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full space-y-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3 space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 bg-primary text-primary-foreground">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary-foreground mb-4">
                    <AvatarImage
                      src={user.image || "/placeholder.svg"}
                      alt={user.firstName}
                    />
                    <AvatarFallback>
                      <User className="h-12 w-12 sm:h-16 sm:w-16" />
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">{`${user.firstName} ${user.lastName}`}</h2>
                  <p className="text-sm opacity-80 mb-4">{user.role}</p>
                  <Progress value={70} className="w-full mb-2" />
                  <p className="text-sm">70% to next reading milestone</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Reading Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Book className="mr-2 h-4 w-4" /> Books Read
                    </span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" /> Favorites
                    </span>
                    <span className="font-bold">{user.favorites.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" /> Member Since
                    </span>
                    <span className="font-bold">N/A</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-2/3 space-y-6">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold">
                      Profile Information
                    </h3>
                    <Button
                      type={isEditing ? "button" : "submit"}
                      onClick={handleEditToggle}
                      variant="outline"
                    >
                      {isEditing ? "Save" : "Edit"}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={user.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={user.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user.email}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={user.phoneNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/borrowed-books" className="block h-full">
                <Card className="h-full hover:bg-accent transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center h-full">
                    <Book className="h-8 w-8 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Borrowed Books</h4>
                      <p className="text-sm text-muted-foreground">
                        View your current loans
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/reading-history" className="block h-full">
                <Card className="h-full hover:bg-accent transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center h-full">
                    <Clock className="h-8 w-8 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Reading History</h4>
                      <p className="text-sm text-muted-foreground">
                        Browse your past reads
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/favorites" className="block h-full">
                <Card className="h-full hover:bg-accent transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center h-full">
                    <Heart className="h-8 w-8 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Favorites</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage your favorite books
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="h-full hover:bg-accent transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center h-full">
                      <Key className="h-8 w-8 mr-4 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Change Password</h4>
                        <p className="text-sm text-muted-foreground">
                          Update your password
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and a new password to update
                      your account security.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handlePasswordChange}>
                      Change Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <form action={handleSignOut}>
            <Button variant="destructive" className="w-1/8" type="submit">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
