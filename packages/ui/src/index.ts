// UI组件统一导出文件
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
export { Alert, AlertDescription, AlertTitle } from "./alert"
export { AspectRatio } from "./aspect-ratio"
export { Avatar, AvatarFallback, AvatarImage } from "./avatar"
export { Badge, badgeVariants } from "./badge"
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"
export { Button, buttonVariants } from "./button"
export { Calendar } from "./calendar"
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel"
export { Checkbox } from "./checkbox"
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command"
export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu"
export { DatePicker } from "./date-picker"
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form"
export { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
export { Input } from "./input"
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./input-otp"
export { Label } from "./label"
export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./menubar"
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu"
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"
export { Popover, PopoverContent, PopoverTrigger } from "./popover"
export { Progress } from "./progress"
export { RadioGroup, RadioGroupItem } from "./radio-group"
export { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable"
export { ScrollArea, ScrollBar } from "./scroll-area"
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
export { Separator } from "./separator"
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"
export { Skeleton } from "./skeleton"
export { Slider } from "./slider"
export { Switch } from "./switch"
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table"
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
export { Textarea } from "./textarea"
export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast"
export { Toaster } from "./toaster"
export { Toggle, toggleVariants } from "./toggle"
export { ToggleGroup, ToggleGroupItem } from "./toggle-group"
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
export { useToast, toast } from "./use-toast"

// 自定义UI组件
export { LoadingSpinner } from "./loading-spinner"
export { LoadingFallback } from "./loading-fallback"
export { MedicalCard } from "./medical-card"
export { MedicalButton } from "./medical-button"
export { InteractiveCard } from "./interactive-card"
export { ResponsiveMedicalCard } from "./responsive-medical-card"
export { ResponsiveTable } from "./responsive-table"
export { EnhancedForm } from "./enhanced-form"
export { AdvancedSearch } from "./advanced-search"
export { DynamicLoading } from "./dynamic-loading"
export { LazyComponent, createLazyComponent } from "./lazy-load"
export { PageTransition } from "./page-transition"
export { BarChart, LineChart, ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"

// 工具函数（Phase 1：随冒烟测试补导出——shadcn 惯例 cn 随桶导出；utils 位于包根 lib/）
export { cn, formatDate } from "../lib/utils"

// ============================================================
// YYC³ Claw UI（Phase 3a · S1 迁入 · 2026-11-04）
// 自研零依赖双主题组件系，与 shadcn 同名件以 Claw 前缀区分（D1 决策）
// 3a：Button / Layout(+Header/Sider/Content/Footer) / Container / 主题上下文 / 设计令牌 re-export
// 3b 待入：Input / Card / Modal / Header / Sidebar / Footer
// ============================================================
export {
  Button as ClawButton,
  type ButtonProps as ClawButtonProps,
  type ButtonVariant as ClawButtonVariant,
  type ButtonSize as ClawButtonSize,
} from "./claw"
export {
  Input as ClawInput,
  type InputProps as ClawInputProps,
  type TextareaProps as ClawTextareaProps,
  type InputStatus as ClawInputStatus,
  type InputType as ClawInputType,
} from "./claw"
export {
  Card as ClawCard,
  type CardProps as ClawCardProps,
  type CardShadow as ClawCardShadow,
} from "./claw"
export { Layout as ClawLayout, Container as ClawContainer } from "./claw"
export type {
  LayoutProps as ClawLayoutProps,
  ContainerProps as ClawContainerProps,
} from "./claw"
export {
  YYC3ThemeProvider,
  useYYC3Theme,
  type YYC3Theme,
} from "./claw"
// 设计令牌（真身 @yyc3/theme，经 claw 薄壳转发，方便 Claw 消费者单口进出）
export {
  getThemeTokens,
  injectThemeCSSVars,
  breakpoints as clawBreakpoints,
  cx as clawCx,
  mergeStyles as clawMergeStyles,
  isCyberpunk,
  type ThemeVariables as ClawThemeVariables,
} from "./claw/theme-tokens"
