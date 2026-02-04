# DesignForge Component Library Documentation

## Overview

The DesignForge component library provides a comprehensive set of reusable UI components built with React, TypeScript, and Tailwind CSS. This documentation covers all available components, their props, usage examples, and best practices.

---

## Table of Contents

1. [Layout Components](#layout-components)
2. [Form Components](#form-components)
3. [Data Display Components](#data-display-components)
4. [Feedback Components](#feedback-components)
5. [Navigation Components](#navigation-components)
6. [Overlay Components](#overlay-components)
7. [Animation Components](#animation-components)

---

## Layout Components

### Resizable

A resizable panel component for creating adjustable layouts.

```tsx
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={20}>
    <Sidebar />
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={80}>
    <MainContent />
  </ResizablePanel>
</ResizablePanelGroup>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultSize | number | - | Initial size percentage |
| minSize | number | 10 | Minimum size percentage |
| maxSize | number | 90 | Maximum size percentage |
| direction | 'horizontal' \| 'vertical' | 'horizontal' | Layout direction |

### Aspect Ratio

Displays content at a specific aspect ratio.

```tsx
import { AspectRatio } from './components/ui/aspect-ratio'

<AspectRatio ratio={16 / 9}>
  <img src="image.jpg" alt="16:9 aspect ratio" />
</AspectRatio>
```

### Card-3D

A 3D perspective card component with tilt effects.

```tsx
import { Card3D } from './components/ui/card-3d'

<Card3D 
  tiltStrength={10}
  perspective={1000}
>
  <Card3D.Content>
    <Card3D.Face front>
      Front content
    </Card3D.Face>
    <Card3D.Face back>
      Back content
    </Card3D.Face>
  </Card3D.Content>
</Card3D>
```

### Bento Grid

A grid layout for organizing content in bento-style boxes.

```tsx
import { BentoGrid, BentoGridItem } from './components/ui/bento-grid'

<BentoGrid className="max-w-4xl mx-auto">
  <BentoGridItem 
    title="Analytics" 
    description="View your analytics dashboard"
    icon={<BarChart />}
    span={2}
  />
  <BentoGridItem 
    title="Settings" 
    icon={<Settings />}
  />
  <BentoGridItem 
    title="Profile" 
    icon={<User />}
  />
</BentoGrid>
```

### Skeleton

A loading placeholder component.

```tsx
import { Skeleton } from './components/ui/skeleton'

<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-4 w-[180px]" />
<div className="flex gap-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

### Skeleton Loader

An enhanced skeleton with animated loading states.

```tsx
import { SkeletonLoader } from './components/ui/skeleton-loader'

<SkeletonLoader variant="pulse" />
<SkeletonLoader variant="wave" />
<SkeletonLoader variant="shimmer" />
```

---

## Form Components

### Button

```tsx
import { Button } from './components/ui/button'

// Variants
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Icon />
</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
```

### Input

```tsx
import { Input } from './components/ui/input'

<Input 
  placeholder="Enter text..."
  type="text"
  disabled={false}
  error={hasError}
/>

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

### Checkbox

```tsx
import { Checkbox } from './components/ui/checkbox'

<Checkbox 
  checked={isChecked}
  onCheckedChange={setIsChecked}
  disabled={false}
/>

// With label
<CheckboxWithLabel 
  id="terms"
  label="I agree to the terms"
  checked={agreed}
  onChange={setAgreed}
/>
```

### Radio Group

```tsx
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group'

<RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
  <RadioGroupItem value="option-1">Option 1</RadioGroupItem>
  <RadioGroupItem value="option-2">Option 2</RadioGroupItem>
  <RadioGroupItem value="option-3">Option 3</RadioGroupItem>
</RadioGroup>
```

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'

<Select value={selectedValue} onValueChange={setSelectedValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option-1">Option 1</SelectItem>
    <SelectItem value="option-2">Option 2</SelectItem>
    <SelectItem value="option-3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### Label

```tsx
import { Label } from './components/ui/label'

<Label htmlFor="input-id">Label Text</Label>
<Label required>Required Field</Label>
<Label error>Error Label</Label>
```

### Textarea

```tsx
import { Textarea } from './components/ui/textarea'

<Textarea 
  placeholder="Enter your message..."
  rows={4}
  maxLength={500}
  disabled={false}
/>
```

### Slider

```tsx
import { Slider } from './components/ui/slider'

<Slider 
  value={[50]}
  onValueChange={setValue}
  min={0}
  max={100}
  step={1}
/>

// Range slider
<Slider 
  value={[20, 80]}
  onValueChange={setRange}
  min={0}
  max={100}
/>
```

### Progress

```tsx
import { Progress } from './components/ui/progress'

<Progress value={45} max={100} />
<Progress value={75} variant="success" />
<Progress value={25} variant="warning" />
```

### Calendar

```tsx
import { Calendar } from './components/ui/calendar'

<Calendar 
  mode="single"
  selected={date}
  onSelect={setDate}
  disabled={(date) => date < new Date()}
/>

// Range mode
<Calendar 
  mode="range"
  selected={range}
  onSelect={setRange}
/>
```

### Form

```tsx
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './components/ui/form'

<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Input OTP

One-time password input component.

```tsx
import { InputOTP, InputOTPGroup, InputOTPSlot } from './components/ui/input-otp'

<InputOTP maxLength={6} value={otp} onChange={setOtp}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

---

## Data Display Components

### Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'

<Avatar>
  <AvatarImage src="user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Sizes
<Avatar size="sm" />
<Avatar size="default" />
<Avatar size="lg" />
<Avatar size="xl" />
```

### Badge

```tsx
import { Badge } from './components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>

// With icon
<Badge icon={<Check />}>Verified</Badge>
```

### Table

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### ScrollArea

```tsx
import { ScrollArea } from './components/ui/scroll-area'

<ScrollArea className="h-[200px]">
  <div className="p-4">
    Scrollable content
  </div>
</ScrollArea>
```

### Hover Card

```tsx
import { HoverCard, HoverCardContent, HoverCardTrigger } from './components/ui/hover-card'

<HoverCard>
  <HoverCardTrigger>Hover me</HoverCardTrigger>
  <HoverCardContent>
    This content appears on hover
  </HoverCardContent>
</HoverCard>
```

### Separator

```tsx
import { Separator } from './components/ui/separator'

// Horizontal
<Separator />

// Vertical
<Separator orientation="vertical" />

// With label
<Separator label="Or" />
```

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

---

## Feedback Components

### Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert'

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>

// Variants
<Alert variant="default" />
<Alert variant="destructive" />
<Alert variant="success" />
<Alert variant="warning" />
```

### Alert Dialog

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog'

<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Toast

```tsx
import { useToast } from './components/ui/use-toast'

const { toast } = useToast()

toast({
  title: "Scheduled: Catch up",
  description: "Friday, February 10, 2024 at 5:57 PM",
})

// Success toast
toast.success("Changes saved successfully")

// Error toast
toast.error("Failed to save changes")
```

### Progress

```tsx
import { Progress } from './components/ui/progress'

<Progress value={33} />
<Progress value={66} indicatorClassName="bg-green-500" />
```

### Spinner

```tsx
import { LoadingSpinner } from './components/animations/LoadingSpinner'

<LoadingSpinner size="sm" />
<LoadingSpinner size="default" />
<LoadingSpinner size="lg" />

// With text
<LoadingSpinner>Loading...</LoadingSpinner>
```

### Animated Feedback

```tsx
import { AnimatedFeedback } from './components/ui/animated-feedback'

<AnimatedFeedback type="success" />
<AnimatedFeedback type="error" />
<AnimatedFeedback type="warning" />
```

---

## Navigation Components

### Navigation Menu

```tsx
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from './components/ui/navigation-menu'

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Link</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Breadcrumb

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './components/ui/breadcrumb'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Components</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Context Menu

```tsx
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './components/ui/context-menu'

<ContextMenu>
  <ContextMenuTrigger>Right click me</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Cut</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### Dropdown Menu

```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Menubar

```tsx
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from './components/ui/menubar'

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>Copy</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

---

## Overlay Components

### Dialog

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

### Drawer

```tsx
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './components/ui/drawer'

<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Edit Profile</DrawerTitle>
      <DrawerDescription>Make changes to your profile.</DrawerDescription>
    </DrawerHeader>
    {/* Drawer content */}
    <DrawerFooter>
      <DrawerClose>Cancel</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### Sheet

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet'

<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
    </SheetHeader>
    {/* Sheet content */}
  </SheetContent>
</Sheet>
```

### Popover

```tsx
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover'

<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>
    Popover content
  </PopoverContent>
</Popover>
```

### Tooltip

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      Tooltip content
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Collapsible

```tsx
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/ui/collapsible'

<Collapsible>
  <CollapsibleTrigger>Can I use this?</CollapsibleTrigger>
  <CollapsibleContent>
    Yes! You can use this component in your project.
  </CollapsibleContent>
</Collapsible>
```

---

## Animation Components

### TextReveal

Animated text reveal component.

```tsx
import { TextReveal } from './components/animations/TextReveal'

<TextReveal 
  text="DesignForge Design System"
  duration={0.5}
  stagger={0.1}
/>
```

### ParallaxCard

A card with parallax scrolling effect.

```tsx
import { ParallaxCard } from './components/animations/ParallaxCard'

<ParallaxCard intensity={0.1}>
  <CardContent>Content</CardContent>
</ParallaxCard>
```

### StaggerList

A list with staggered animation.

```tsx
import { StaggerList } from './components/animations/StaggerList'

<StaggerList items={['Item 1', 'Item 2', 'Item 3']} staggerDelay={0.1}>
  {(item) => <div>{item}</div>}
</StaggerList>
```

### PageTransition

Wrapper for page transitions.

```tsx
import { PageTransition } from './components/animations/PageTransition'

<PageTransition>
  <YourPageContent />
</PageTransition>
```

### AuroraBackground

Animated aurora background effect.

```tsx
import { AuroraBackground } from './components/animations/AuroraBackground'

<AuroraBackground>
  <YourContent />
</AuroraBackground>
```

### GlowingBorder

A component with glowing border animation.

```tsx
import { GlowingBorder } from './components/animations/GlowingBorder'

<GlowingBorder color="#3b82f6" duration={2}>
  <YourContent />
</GlowingBorder>
```

### GradientOrbs

Animated gradient orb effects.

```tsx
import { GradientOrbs } from './components/animations/GradientOrbs'

<GradientOrbs count={3} speed={1}>
  <YourContent />
</GradientOrbs>
```

### MagneticButton

A button with magnetic hover effect.

```tsx
import { MagneticButton } from './components/animations/MagneticButton'

<MagneticButton strength={0.3}>
  Hover me
</MagneticButton>
```

### MicroInteractions

Small interactive animations.

```tsx
import { MicroInteractions } from './components/animations/MicroInteractions'

<MicroInteractions type="pulse" trigger="hover">
  <YourElement />
</MicroInteractions>
```

### MotionWrapper

A wrapper for adding motion to any component.

```tsx
import { MotionWrapper } from './components/animations/MotionWrapper'

<MotionWrapper 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <YourComponent />
</MotionWrapper>
```

---

## Icon Registry

All icons are provided through the Lucide React library.

```tsx
import { 
  // Navigation
  Home, Menu, ChevronLeft, ChevronRight,
  // Actions
  Plus, Minus, Edit, Trash, Copy, Search,
  // Status
  Check, X, CheckCircle, AlertCircle, Info,
  // Communication
  Mail, MessageSquare, Phone, Bell,
  // Social
  Github, Twitter, Linkedin, Facebook,
  // File
  File, Folder, Image, Download, Upload,
  // Other
  Settings, User, LogOut, Sun, Moon
} from 'lucide-react'
```

---

## Component Best Practices

### 1. Composition

Compose components instead of extending them:

```tsx
// Good
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid
<CardWithHeaderAndContent title="Title">Content </CardWithHeaderAndContent>
```

### 2. TypeScript

Always use TypeScript for type safety:

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg' | 'icon'
  loading?: boolean
}
```

### 3. Accessibility

Ensure all components are accessible:

```tsx
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  aria-controls="dialog-content"
>
  <XIcon />
</button>
```

### 4. Testing

Write tests for components:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'

test('renders button with correct text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
})
```

---

## Contributing to Components

1. Follow the existing component structure
2. Use the component template
3. Add proper TypeScript types
4. Include accessibility attributes
5. Write unit tests
6. Update documentation

---

## Related Documentation

- [Design System Documentation](./DESIGN_SYSTEM_DOCUMENTATION.md)
- [Design Tokens Specification](./DESIGN_TOKENS.md)
- [Accessibility Guidelines](./ACCESSIBILITY.md)
