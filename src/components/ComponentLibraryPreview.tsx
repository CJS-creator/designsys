import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GeneratedDesignSystem } from "@/types/designSystem";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, Bell, Check, ChevronRight, Heart, Loader2, Mail, 
  Moon, Search, Settings, ShoppingCart, Star, Sun, User, X, Zap,
  Home, FileText, BarChart, Users, Calendar
} from "lucide-react";
import { fadeUp, scale, staggerContainer, staggerItem } from "@/lib/animations/variants";

interface ComponentLibraryPreviewProps {
  designSystem: GeneratedDesignSystem;
}

export function ComponentLibraryPreview({ designSystem }: ComponentLibraryPreviewProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("buttons");
  const [sliderValue, setSliderValue] = useState([50]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const sections = [
    { id: "buttons", label: "Buttons" },
    { id: "forms", label: "Forms" },
    { id: "cards", label: "Cards" },
    { id: "feedback", label: "Feedback" },
    { id: "navigation", label: "Navigation" },
    { id: "data", label: "Data Display" },
  ];

  return (
    <Card className={isDarkMode ? "dark bg-background" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Component Library</CardTitle>
            <CardDescription>All UI components styled with your design system</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            <Moon className="h-4 w-4" />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className={`space-y-8 ${isDarkMode ? "dark" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeUp}
          >
            {/* Buttons Section */}
            {activeSection === "buttons" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Button Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon"><Heart className="h-4 w-4" /></Button>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Button States</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleLoadingDemo} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isLoading ? "Loading..." : "Click to Load"}
                    </Button>
                    <Button disabled>Disabled</Button>
                    <Button className="gap-2">
                      <Mail className="h-4 w-4" /> With Icon
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Forms Section */}
            {activeSection === "forms" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <motion.div variants={staggerItem} className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <Label htmlFor="search">Search Input</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="search" className="pl-10" placeholder="Search..." />
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here..." />
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <Label>Select Option</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifications" />
                    <Label htmlFor="notifications">Enable notifications</Label>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <Label>Slider: {sliderValue[0]}%</Label>
                  <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
                </motion.div>
              </motion.div>
            )}

            {/* Cards Section */}
            {activeSection === "cards" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <motion.div variants={staggerItem}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>Basic Card</CardTitle>
                      <CardDescription>A simple card component</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Cards contain content and actions about a single subject.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Learn More</Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">John Doe</CardTitle>
                        <CardDescription>Software Engineer</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Badge>React</Badge>
                        <Badge variant="secondary">TypeScript</Badge>
                        <Badge variant="outline">UI/UX</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Shopping Cart
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">$99.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-medium">$5.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>$104.00</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Checkout</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Feedback Section */}
            {activeSection === "feedback" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Alerts</h3>
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Default Alert</AlertTitle>
                      <AlertDescription>This is a default alert message.</AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <X className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>Something went wrong. Please try again.</AlertDescription>
                    </Alert>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge className="gap-1"><Zap className="h-3 w-3" /> New</Badge>
                    <Badge className="gap-1"><Check className="h-3 w-3" /> Verified</Badge>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Progress</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>25%</span>
                      </div>
                      <Progress value={25} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing...</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Complete</span>
                        <span>100%</span>
                      </div>
                      <Progress value={100} />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Loading States</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </Button>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Processing...</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Navigation Section */}
            {activeSection === "navigation" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Sidebar Navigation</h3>
                  <Card className="max-w-xs">
                    <CardContent className="p-2">
                      <nav className="space-y-1">
                        {[
                          { icon: Home, label: "Dashboard", active: true },
                          { icon: Users, label: "Users", active: false },
                          { icon: FileText, label: "Documents", active: false },
                          { icon: BarChart, label: "Analytics", active: false },
                          { icon: Calendar, label: "Calendar", active: false },
                          { icon: Settings, label: "Settings", active: false },
                        ].map((item) => (
                          <motion.button
                            key={item.label}
                            whileHover={{ x: 4 }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                              item.active
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </motion.button>
                        ))}
                      </nav>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Tabs Navigation</h3>
                  <Tabs defaultValue="account">
                    <TabsList>
                      <TabsTrigger value="account">Account</TabsTrigger>
                      <TabsTrigger value="password">Password</TabsTrigger>
                      <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" className="p-4 border rounded-b-lg">
                      Account settings content
                    </TabsContent>
                    <TabsContent value="password" className="p-4 border rounded-b-lg">
                      Password settings content
                    </TabsContent>
                    <TabsContent value="notifications" className="p-4 border rounded-b-lg">
                      Notification settings content
                    </TabsContent>
                  </Tabs>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Breadcrumb</h3>
                  <nav className="flex items-center gap-2 text-sm">
                    <a href="#" className="text-muted-foreground hover:text-foreground">Home</a>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <a href="#" className="text-muted-foreground hover:text-foreground">Products</a>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">Details</span>
                  </nav>
                </motion.div>
              </motion.div>
            )}

            {/* Data Display Section */}
            {activeSection === "data" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Avatars</h3>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>LG</AvatarFallback>
                    </Avatar>
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <Avatar key={i} className="border-2 border-background">
                          <AvatarFallback>{i}</AvatarFallback>
                        </Avatar>
                      ))}
                      <Avatar className="border-2 border-background">
                        <AvatarFallback>+5</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">Stats Cards</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { label: "Total Users", value: "2,543", change: "+12.5%", icon: Users },
                      { label: "Revenue", value: "$45,231", change: "+20.1%", icon: BarChart },
                      { label: "Active Now", value: "573", change: "+4.3%", icon: Zap },
                    ].map((stat) => (
                      <motion.div key={stat.label} whileHover={{ y: -4 }}>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <stat.icon className="h-5 w-5 text-muted-foreground" />
                              <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                            </div>
                            <div className="mt-3">
                              <p className="text-2xl font-bold">{stat.value}</p>
                              <p className="text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <h3 className="text-lg font-semibold mb-4">List Items</h3>
                  <Card>
                    <CardContent className="p-0">
                      {[
                        { name: "Alice Johnson", email: "alice@example.com", status: "Active" },
                        { name: "Bob Smith", email: "bob@example.com", status: "Pending" },
                        { name: "Carol White", email: "carol@example.com", status: "Active" },
                      ].map((user, i) => (
                        <motion.div
                          key={user.email}
                          whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                          className="flex items-center justify-between p-4 border-b last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
