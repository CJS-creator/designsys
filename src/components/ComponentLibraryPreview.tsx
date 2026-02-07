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
  AlertCircle, Check, ChevronRight, Heart, Loader2, Mail,
  Moon, Search, Settings, ShoppingCart, Sun, X, Zap,
  Home, FileText, BarChart, Users, Calendar, Code,
} from "lucide-react";
import { CodeViewer } from "@/components/ui/CodeViewer";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/animations/variants";
import { Spotlight } from "@/components/ui/spotlight";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { CardContainer, CardBody, CardItem } from "@/components/ui/card-3d";
import { NumberTicker } from "@/components/ui/number-ticker";

import { spotlightCode, movingBorderCode, bentoGridCode, card3dCode, numberTickerCode } from "@/data/component-codes";

// Placeholder code snippets for component preview
const buttonCode = `<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Button
</button>`;

const formsCode = `<input
  type="text"
  placeholder="Enter text..."
  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
/>`;

const cardsCode = `<div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content goes here.</p>
</div>`;

const feedbackCode = `<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
  Success message
</div>`;

const navigationCode = `<nav className="flex space-x-4">
  <a href="#" className="text-blue-500 hover:text-blue-700">Home</a>
  <a href="#" className="text-blue-500 hover:text-blue-700">About</a>
</nav>`;

const dataCode = `<table className="min-w-full divide-y divide-gray-200">
  <thead>
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Item 1</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Value 1</td>
    </tr>
  </tbody>
</table>`;

interface ComponentLibraryPreviewProps {
  designSystem?: GeneratedDesignSystem;
}

export function ComponentLibraryPreview(_props: ComponentLibraryPreviewProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("showcase");
  const [sliderValue, setSliderValue] = useState([50]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const sections = [
    { id: "showcase", label: "✨ Showcase (New)" },
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
            <div className="flex items-center gap-2 mr-4 border-r pr-4">
              <Code className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="show-code" className="text-sm font-medium cursor-pointer">Code</Label>
              <Switch id="show-code" checked={showCode} onCheckedChange={setShowCode} />
            </div>
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

      <CardContent className={`space-y-6 ${isDarkMode ? "dark" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeUp}
          >
            {/* Showcase Section */}
            {activeSection === "showcase" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">

                {/* 1. Spotlight */}
                <motion.div variants={staggerItem}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Spotlight Effect
                      </h3>
                      <p className="text-muted-foreground">Dynamic cone of light for hero sections.</p>
                    </div>
                  </div>
                  <div className="relative h-[20rem] w-full overflow-hidden rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
                    <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
                    <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
                      <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        Spotlight <br /> is here.
                      </h1>
                    </div>
                  </div>
                  <div className="mt-4">
                    <CodeViewer code={spotlightCode} />
                  </div>
                </motion.div>

                <Separator />

                {/* 2. Moving Border Button */}
                <motion.div variants={staggerItem}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Moving Border Button</h3>
                      <p className="text-muted-foreground">Button with a continuously rotating gradient border.</p>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-center bg-zinc-950 rounded-lg">
                    <MovingBorderButton
                      borderRadius="1.75rem"
                      className="bg-zinc-900 text-white border-neutral-200 dark:border-slate-800"
                    >
                      Click me
                    </MovingBorderButton>
                  </div>
                  <div className="mt-4">
                    <CodeViewer code={movingBorderCode} />
                  </div>
                </motion.div>

                <Separator />

                {/* 3. Bento Grid */}
                <motion.div variants={staggerItem}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Bento Grid</h3>
                      <p className="text-muted-foreground">A highly flexible grid layout component.</p>
                    </div>
                  </div>
                  <BentoGrid className="max-w-4xl mx-auto">
                    {[
                      {
                        title: "Drag & Drop",
                        description: "Intuitive drag and drop interface for your components.",
                        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />,
                        icon: <FileText className="h-4 w-4 text-neutral-500" />,
                        className: "md:col-span-2",
                      },
                      {
                        title: "Automated",
                        description: "Everything is automated for your convenience.",
                        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />,
                        icon: <Zap className="h-4 w-4 text-neutral-500" />,
                        className: "md:col-span-1",
                      },
                    ].map((item, i) => (
                      <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        header={item.header}
                        icon={item.icon}
                        className={item.className}
                      />
                    ))}
                  </BentoGrid>
                  <div className="mt-4">
                    <CodeViewer code={bentoGridCode} />
                  </div>
                </motion.div>

                <Separator />

                {/* 4. 3D Card */}
                <motion.div variants={staggerItem}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">3D Perspective Card</h3>
                      <p className="text-muted-foreground">Hover over the card to see the 3D effect.</p>
                    </div>
                  </div>
                  <CardContainer className="inter-var">
                    <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
                      <CardItem
                        translateZ="50"
                        className="text-xl font-bold text-neutral-600 dark:text-white"
                      >
                        Make things float in air
                      </CardItem>
                      <CardItem
                        as="p"
                        translateZ="60"
                        className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                      >
                        Hover over this card to unleash the power of CSS perspective
                      </CardItem>
                      <CardItem translateZ="100" className="w-full mt-4">
                        <div className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl bg-gradient-to-br from-violet-500 to-fuchsia-500" />
                      </CardItem>
                    </CardBody>
                  </CardContainer>
                  <div className="mt-4">
                    <CodeViewer code={card3dCode} />
                  </div>
                </motion.div>

                <Separator />

                {/* 5. Number Ticker */}
                <motion.div variants={staggerItem}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Number Ticker</h3>
                      <p className="text-muted-foreground">Smoothly animating numbers.</p>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-center bg-card border rounded-lg">
                    <p className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-black dark:text-white">
                      <NumberTicker value={100} />
                    </p>
                  </div>
                  <div className="mt-4">
                    <CodeViewer code={numberTickerCode} />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Buttons Section */}
            {activeSection === "buttons" && (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                {showCode && (
                  <motion.div variants={staggerItem}>
                    <CodeViewer code={buttonCode} className="mb-6" />
                  </motion.div>
                )}
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
                {showCode && (
                  <motion.div variants={staggerItem}>
                    <CodeViewer code={formsCode} className="mb-6" />
                  </motion.div>
                )}
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
                {showCode && (
                  <motion.div variants={staggerItem} className="md:col-span-2 lg:col-span-3">
                    <CodeViewer code={cardsCode} className="mb-6" />
                  </motion.div>
                )}
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
                {showCode && (
                  <motion.div variants={staggerItem}>
                    <CodeViewer code={feedbackCode} className="mb-6" />
                  </motion.div>
                )}
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
                {showCode && (
                  <motion.div variants={staggerItem}>
                    <CodeViewer code={navigationCode} className="mb-6" />
                  </motion.div>
                )}
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
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${item.active
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
                {showCode && (
                  <motion.div variants={staggerItem}>
                    <CodeViewer code={dataCode} className="mb-6" />
                  </motion.div>
                )}
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
                      ].map((user) => (
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
